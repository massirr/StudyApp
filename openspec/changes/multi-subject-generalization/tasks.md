# Tasks — Multi-Subject Generalization

Implementation plan for this change. Execute top to bottom; each numbered section ends with a build/test-green, independently reviewable deliverable. TDD: write the failing test, watch it fail, implement minimally, watch it pass, commit.

## Global Constraints

- No backend, auth, database, or cloud sync — content is build-time-bundled JSON; state is LocalStorage only.
- `npm run build` (`tsc && vite build`) MUST pass with zero errors at the end of every section.
- Subject `shortLabel` may only contain glyphs in the pixel font: `A–Z`, `0–9`, `-` (hyphen), ` ` (space). Validated at load.
- `sourcePolicy` is per subject: `"microsoft-only" | "any"`. `dp-750` = `microsoft-only` (all source URLs on `learn.microsoft.com`); missing policy defaults to `"any"`.
- Existing DP-750 LocalStorage progress MUST survive migration (wrapped under subject id `dp-750`).
- 4-space indent; use the existing global `index.css` / CSS-module patterns; no new runtime deps beyond what a task explicitly adds.
- Keep the GSAP hero animation behavior unchanged; it targets `<rect>` elements generically.

## File Structure

**New:** `src/data/subjects/dp-750.json`, `src/data/subjects/index.ts`, `src/data/subjects/schema.ts`, `src/pages/SubjectPickerPage.tsx`, `src/components/common/SubjectSwitcher.tsx`, `src/lib/pixelFont.ts`, `src/lib/route.ts`, `scripts/migrate-dp750-to-json.mjs` (throwaway), `playwright.config.ts`.
**Modified:** `src/types/study.ts`, `src/types/quiz.ts`, `src/utils/contentValidation.ts`, `src/utils/progressStorage.ts`, `src/context/ProgressContext.tsx`, `src/hooks/useProgress.ts`, `src/App.tsx`, `src/pages/{DashboardPage,TopicPage,QuizPage}.tsx`, `src/components/AppShell.tsx`, `src/components/quiz/QuizPage.tsx`, `src/components/common/PixelLogo.tsx`, `vite.config.ts`, `package.json`.
**Deleted after migration:** `src/data/{topics,questions,sources,contentNotes}.ts`.

**Phase order:** Progress (§9–10) depends on the active subject being resolvable from the route (§4–5). Build 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11.

---

## 1. Types — Subject entity, source policy, optional level

Files: modify `src/types/study.ts`, `src/types/quiz.ts`.
Produces: `SourcePolicy = 'microsoft-only' | 'any'`; `Subject`; `QuizQuestion.level?: number`; `SubjectProgress`, `ProgressStateV2`.

- [x] 1.1 Add `level?: number` to `QuizQuestion` in `src/types/quiz.ts` (below `codeSnippet?`), commented "reserved for future tiered quizzes; unused in this release".
- [x] 1.2 Add to `src/types/study.ts`:

```ts
import { QuizQuestion } from './quiz';

export type SourcePolicy = 'microsoft-only' | 'any';

export interface Subject {
    id: string;
    slug: string;
    name: string;
    shortLabel: string; // pixel hero; A-Z 0-9 hyphen space only
    tagline: string;
    sourcePolicy?: SourcePolicy; // defaults to 'any'
    sources: SourceReference[];
    topics: Topic[];
    questions: QuizQuestion[];
    notes: ContentNote[];
}

export interface SubjectProgress {
    completedTopicIds: string[];
    completedSubtopicIds: Record<string, string[]>;
    lastVisitedTopicSlug?: string;
}

export interface ProgressStateV2 {
    version: 2;
    subjects: Record<string, SubjectProgress>;
    preferences?: ProgressPreferences;
}
```

- [x] 1.3 Run `npx tsc --noEmit` — expect PASS (old `ProgressState` stays until §9).
- [x] 1.4 Commit: `feat(types): add Subject, SourcePolicy, progress v2, optional level`.

## 2. Subject schema validation + vitest setup

Files: create `src/data/subjects/schema.ts`, `src/data/subjects/schema.test.ts`; modify `vite.config.ts`, `package.json`.
Produces: `SUPPORTED_GLYPHS: Set<string>`, `validateSubject(raw: unknown): Subject` (throws), `isSupportedLabel(label): boolean`.

- [x] 2.1 Add vitest: `npm i -D vitest@^2`; add script `"test:unit": "vitest run"` (keep `"test": "playwright test"`); enable in `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  test: { environment: 'node' },
})
```

- [x] 2.2 Write failing test `src/data/subjects/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { validateSubject, isSupportedLabel } from './schema';

const valid = {
  id: 'demo', slug: 'demo', name: 'Demo', shortLabel: 'DEMO-1',
  tagline: 't', sourcePolicy: 'any',
  sources: [], topics: [], questions: [], notes: [],
};

describe('validateSubject', () => {
  it('accepts a well-formed subject', () => {
    expect(validateSubject(valid).slug).toBe('demo');
  });
  it('throws when a required field is missing', () => {
    const { name, ...rest } = valid;
    expect(() => validateSubject(rest)).toThrow(/name/);
  });
  it('throws when shortLabel has an unsupported glyph', () => {
    expect(() => validateSubject({ ...valid, shortLabel: 'Dutch!' })).toThrow(/glyph/i);
  });
  it('enforces microsoft-only source URLs', () => {
    const bad = {
      ...valid, sourcePolicy: 'microsoft-only',
      sources: [{ id: 's', label: 'x', url: 'https://example.com', usageNote: '' }],
    };
    expect(() => validateSubject(bad)).toThrow(/microsoft/i);
  });
  it('allows any source URL when policy is any', () => {
    const ok = { ...valid, sources: [{ id: 's', label: 'x', url: 'https://example.com', usageNote: '' }] };
    expect(validateSubject(ok).sources).toHaveLength(1);
  });
});

describe('isSupportedLabel', () => {
  it('accepts A-Z 0-9 hyphen space', () => expect(isSupportedLabel('AZ-900 X')).toBe(true));
  it('rejects lowercase/punctuation', () => expect(isSupportedLabel('Dutch!')).toBe(false));
});
```

- [x] 2.3 Run `npm run test:unit` — expect FAIL (no exports).
- [x] 2.4 Implement `src/data/subjects/schema.ts`:

```ts
import { Subject, SourcePolicy } from '../../types/study';

export const SUPPORTED_GLYPHS = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- '.split('')
);

export function isSupportedLabel(label: string): boolean {
  return label.length > 0 && [...label].every((c) => SUPPORTED_GLYPHS.has(c));
}

function req<T>(obj: Record<string, unknown>, key: string): T {
  if (obj[key] === undefined || obj[key] === null) {
    throw new Error(`Subject is missing required field: ${key}`);
  }
  return obj[key] as T;
}

export function validateSubject(raw: unknown): Subject {
  if (typeof raw !== 'object' || raw === null) throw new Error('Subject must be an object');
  const o = raw as Record<string, unknown>;
  const s: Subject = {
    id: req(o, 'id'), slug: req(o, 'slug'), name: req(o, 'name'),
    shortLabel: req(o, 'shortLabel'), tagline: req(o, 'tagline'),
    sourcePolicy: (o.sourcePolicy as SourcePolicy) ?? 'any',
    sources: req(o, 'sources'), topics: req(o, 'topics'),
    questions: req(o, 'questions'), notes: req(o, 'notes'),
  };
  if (!isSupportedLabel(s.shortLabel)) {
    throw new Error(`shortLabel "${s.shortLabel}" contains an unsupported glyph (allowed: A-Z 0-9 hyphen space)`);
  }
  if (s.sourcePolicy === 'microsoft-only') {
    const urls = [...s.sources.map((x) => x.url), ...s.questions.flatMap((q) => q.sourceUrls)];
    const bad = urls.find((u) => !u.startsWith('https://learn.microsoft.com/'));
    if (bad) throw new Error(`microsoft-only subject has non-Microsoft source URL: ${bad}`);
  }
  return s;
}
```

- [x] 2.5 Run `npm run test:unit` — expect PASS.
- [x] 2.6 Commit: `feat(content): add subject schema validation + vitest`.

## 3. Migrate DP-750 content to JSON + registry loader

Files: create `scripts/migrate-dp750-to-json.mjs` (throwaway), `src/data/subjects/dp-750.json`, `src/data/subjects/index.ts`, `src/data/subjects/index.test.ts`; modify `tsconfig.json`.
Produces: `getSubjects(): Subject[]`, `getSubjectBySlug(slug): Subject | undefined`, and subject-scoped helpers.

- [x] 3.1 Write `scripts/migrate-dp750-to-json.mjs` (run via `npx tsx`). Per **D8**, bake enrichment: the exported helpers already return the enriched (padded, 4-option) questions, and preserve the `codeSnippet` field. Build the full bank as the union over topics of regular + code-snippet questions so both tiers are captured with enrichment baked in.

```js
import { writeFileSync } from 'node:fs';
import { TOPICS } from '../src/data/topics.ts';
import { SOURCES } from '../src/data/sources.ts';
import { CONTENT_NOTES } from '../src/data/contentNotes.ts';
import { getQuestionsForTopic, getCodeSnippetQuestionsForTopic } from '../src/data/questions.ts';

// Enriched union: regular (padded to 4 options) + code-snippet questions, per topic.
const questions = TOPICS.flatMap((t) => [
  ...getQuestionsForTopic(t.id),
  ...getCodeSnippetQuestionsForTopic(t.id),
]);

const subject = {
  id: 'dp-750', slug: 'dp-750',
  name: 'DP-750: Azure Databricks Data Engineering', shortLabel: 'DP-750',
  tagline: 'Follow your topic path, resume where you left off, and keep progress in this browser.',
  sourcePolicy: 'microsoft-only',
  sources: SOURCES, topics: TOPICS, questions, notes: CONTENT_NOTES,
};
writeFileSync(new URL('../src/data/subjects/dp-750.json', import.meta.url), JSON.stringify(subject, null, 2) + '\n');
console.log(`Wrote dp-750.json: ${TOPICS.length} topics, ${questions.length} questions`);
```

- [x] 3.2 Run `npx tsx scripts/migrate-dp750-to-json.mjs` — expect `5 topics, N questions` and a new `dp-750.json`.
- [x] 3.3 Write failing loader test `src/data/subjects/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getSubjects, getSubjectBySlug } from './index';

describe('subject registry', () => {
  it('loads dp-750', () => {
    const s = getSubjectBySlug('dp-750');
    expect(s?.name).toMatch(/DP-750/);
    expect(s?.topics).toHaveLength(5);
    expect(s?.questions.length).toBeGreaterThan(0);
  });
  it('lists dp-750 among subjects', () => {
    expect(getSubjects().map((s) => s.slug)).toContain('dp-750');
  });
  it('returns undefined for unknown slug', () => {
    expect(getSubjectBySlug('nope')).toBeUndefined();
  });
});
```

- [x] 3.4 Run `npm run test:unit` — expect FAIL (no `./index`).
- [x] 3.5 Implement `src/data/subjects/index.ts` and add `"resolveJsonModule": true` to `tsconfig.json` if absent:

```ts
import { Subject } from '../../types/study';
import { validateSubject } from './schema';
import dp750 from './dp-750.json';

const RAW: unknown[] = [dp750];
const SUBJECTS: Subject[] = RAW.map(validateSubject);

export function getSubjects(): Subject[] { return SUBJECTS; }
export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
export const getTopicBySlug = (subject: Subject, slug: string) =>
  subject.topics.find((t) => t.slug === slug);
// Preserve the code-snippet tier split (D8): regular vs code questions.
export const getQuestionsForTopic = (subject: Subject, topicId: string) =>
  subject.questions.filter((q) => q.topicId === topicId && !q.codeSnippet);
export const getCodeSnippetQuestionsForTopic = (subject: Subject, topicId: string) =>
  subject.questions.filter((q) => q.topicId === topicId && !!q.codeSnippet);
export const getQuestionCountForTopic = (subject: Subject, topicId: string) =>
  getQuestionsForTopic(subject, topicId).length;
export const getAllQuestions = (subject: Subject) =>
  subject.questions.filter((q) => !q.codeSnippet);
```

- [x] 3.6 Run `npm run test:unit && npm run build` — expect PASS. (Physical deletion of old `.ts` data files is deferred to §5 so the app keeps compiling; §3 only ADDs JSON + loader.)
- [x] 3.7 Commit: `feat(content): migrate DP-750 to JSON + subject registry loader`.

## 4. Route parsing + subject picker page

Files: create `src/lib/route.ts`, `src/lib/route.test.ts`, `src/pages/SubjectPickerPage.tsx`; modify `src/App.tsx`.
Produces: `parseRoute(pathname): Route`.

- [x] 4.1 Write failing test `src/lib/route.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { parseRoute } from './route';

describe('parseRoute', () => {
  it('/ → picker', () => expect(parseRoute('/')).toEqual({ kind: 'picker' }));
  it('/dp-750 → dashboard', () => expect(parseRoute('/dp-750')).toEqual({ kind: 'dashboard', subject: 'dp-750' }));
  it('trailing slash normalizes', () => expect(parseRoute('/dp-750/')).toEqual({ kind: 'dashboard', subject: 'dp-750' }));
  it('/dp-750/topics/x → topic', () => expect(parseRoute('/dp-750/topics/x')).toEqual({ kind: 'topic', subject: 'dp-750', topicSlug: 'x' }));
  it('/dp-750/quiz → quiz', () => expect(parseRoute('/dp-750/quiz')).toEqual({ kind: 'quiz', subject: 'dp-750' }));
  it('/dp-750/topic/x (singular) → redirect', () => expect(parseRoute('/dp-750/topic/x')).toEqual({ kind: 'redirect', to: '/dp-750/topics/x' }));
  it('junk → notFound', () => expect(parseRoute('/a/b/c/d')).toEqual({ kind: 'notFound' }));
});
```

- [x] 4.2 Run `npm run test:unit` — expect FAIL.
- [x] 4.3 Implement `src/lib/route.ts`:

```ts
export type Route =
  | { kind: 'picker' }
  | { kind: 'dashboard'; subject: string }
  | { kind: 'topic'; subject: string; topicSlug: string }
  | { kind: 'quiz'; subject: string }
  | { kind: 'notFound' }
  | { kind: 'redirect'; to: string };

export function parseRoute(pathname: string): Route {
  const clean = pathname.replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { kind: 'picker' };
  const [subject, seg, rest] = parts;
  if (parts.length === 1) return { kind: 'dashboard', subject };
  if (seg === 'quiz' && parts.length === 2) return { kind: 'quiz', subject };
  if (seg === 'topics' && parts.length === 3) return { kind: 'topic', subject, topicSlug: rest };
  if (seg === 'topic' && parts.length === 3) return { kind: 'redirect', to: `/${subject}/topics/${rest}` };
  return { kind: 'notFound' };
}
```

- [x] 4.4 Run `npm run test:unit` — expect PASS.
- [x] 4.5 Create `src/pages/SubjectPickerPage.tsx` (lists `getSubjects()` as links to `/${slug}`), add minimal `.subject-picker*` styles to `index.css` reusing the dashboard card pattern:

```tsx
import React from 'react';
import { getSubjects } from '../data/subjects';

const SubjectPickerPage: React.FC = () => (
  <section className="subject-picker" aria-label="Choose a subject">
    <h1>Choose a subject</h1>
    <ul className="subject-picker-list">
      {getSubjects().map((s) => (
        <li key={s.id}>
          <a href={`/${s.slug}`}>
            <span className="subject-picker-label">{s.shortLabel}</span>
            <span className="subject-picker-name">{s.name}</span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);
export default SubjectPickerPage;
```

- [x] 4.6 Rewrite the matcher in `src/App.tsx` to `switch (parseRoute(pathname).kind)`; resolve subject via `getSubjectBySlug`; unknown subject → `NotFoundPage`; `redirect` → `window.history.replaceState(null,'',route.to)` then re-read pathname (mirror existing normalize/popstate). Keep `DashboardBg` + `AppShell`. Pages gain a `subject: Subject` prop — make it **optional** here, required in §5, so the build stays green between sections.

```tsx
const route = parseRoute(pathname);
let content: React.ReactNode;
switch (route.kind) {
  case 'picker': content = <SubjectPickerPage />; break;
  case 'redirect': window.history.replaceState(null, '', route.to); content = <div />; break;
  case 'dashboard': { const s = getSubjectBySlug(route.subject); content = s ? <DashboardPage subject={s} /> : <NotFoundPage />; break; }
  case 'topic': { const s = getSubjectBySlug(route.subject); const t = s && getTopicBySlug(s, route.topicSlug); content = s && t ? <TopicPage subject={s} topic={t} /> : <NotFoundPage />; break; }
  case 'quiz': { const s = getSubjectBySlug(route.subject); content = s ? <QuizPage subject={s} /> : <NotFoundPage />; break; }
  default: content = <NotFoundPage />;
}
```

- [x] 4.7 Run `npm run test:unit` — route tests PASS.
- [x] 4.8 Commit: `feat(routing): subject-scoped routes + subject picker`.

## 5. Scope pages to the active subject

Files: modify `src/pages/{DashboardPage,TopicPage,QuizPage}.tsx`, `src/components/quiz/QuizPage.tsx`; delete `src/data/{topics,questions,sources,contentNotes}.ts`.

- [x] 5.1 `DashboardPage({ subject })`: read `subject.topics`/`subject.tagline`; topic links → `/${subject.slug}/topics/${t.slug}`; quiz/resume links → `/${subject.slug}/quiz`. (Hero pixel logo wired in §8.)
- [x] 5.2 `TopicPage({ subject, topic })`: "Open Quiz" CTA → `/${subject.slug}/quiz?topic=${topic.slug}`.
- [x] 5.3 `src/pages/QuizPage.tsx` wrapper `({ subject })`: read `?topic` from `window.location.search`; pass `subject` + `topicSlug` to `components/quiz/QuizPage`, which loads via `getQuestionsForTopic(subject, id)` / `getAllQuestions(subject)`.
- [x] 5.4 Delete old data modules and the script:

```bash
rm src/data/topics.ts src/data/questions.ts src/data/sources.ts src/data/contentNotes.ts scripts/migrate-dp750-to-json.mjs
grep -rn "data/topics\|data/questions\|data/sources\|data/contentNotes" src   # must be empty
```

- [x] 5.5 Run `npm run build && npm run test:unit` — expect PASS.
- [x] 5.6 Commit: `feat(pages): scope dashboard/topic/quiz to active subject; drop TS data modules`.

## 6. Header ☰ subject switcher

Files: create `src/components/common/SubjectSwitcher.tsx`; modify `src/components/AppShell.tsx`, `src/index.css`; create `tests/switcher.spec.ts`.

- [x] 6.1 Implement `SubjectSwitcher.tsx` — accessible disclosure menu (`aria-haspopup="menu"`, `aria-expanded`, `<ul role="menu">` of subject links; close on outside-click / Escape):

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { getSubjects } from '../../data/subjects';

export const SubjectSwitcher: React.FC<{ activeSlug?: string }> = ({ activeSlug }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const subjects = getSubjects();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className="subject-switcher" ref={ref}>
      <button type="button" className="subject-switcher-btn" aria-haspopup="menu" aria-expanded={open}
        aria-label="Switch subject" onClick={() => setOpen((v) => !v)}>☰</button>
      {open && (
        <ul className="subject-switcher-menu" role="menu">
          {subjects.map((s) => (
            <li key={s.id} role="none">
              <a role="menuitem" href={`/${s.slug}`} aria-current={s.slug === activeSlug || undefined}>{s.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

- [x] 6.2 Mount in `AppShell.tsx`: give it optional `subject?: Subject` (supplied by `App.tsx` per route). Left = home link (subject wordmark via `PixelLogo` when present, else app brand); right = `<SubjectSwitcher activeSlug={subject?.slug} />` then the existing GitHub link.
- [x] 6.3 Add `.subject-switcher*` styles to `index.css` (absolute menu under the button, paper/ink palette, `--border`, small shadow).
- [x] 6.4 Add `tests/switcher.spec.ts`:

```ts
import { expect, test } from '@playwright/test';
test('header switcher lists subjects and navigates', async ({ page }) => {
  await page.goto('/dp-750');
  await page.getByRole('button', { name: 'Switch subject' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem').first()).toBeVisible();
});
```

- [x] 6.5 Run `npm run build && npm run test:unit` — expect PASS (Playwright runs in §11).
- [x] 6.6 Commit: `feat(nav): header subject switcher menu`.

## 7. Pixel-font renderer

Files: create `src/lib/pixelFont.ts`, `src/lib/pixelFont.test.ts`; modify `src/components/common/PixelLogo.tsx`.
Produces: `GLYPHS`, `glyphRectsFor(text)`, `labelWidth(text)`, `GLYPH_W`, `GLYPH_H`; `PixelLogo` gains `text: string`.

- [ ] 7.1 Write failing test `src/lib/pixelFont.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { glyphRectsFor, GLYPHS } from './pixelFont';

describe('pixelFont', () => {
  it('has a glyph for every supported char', () => {
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'.split('').forEach((c) => {
      expect(GLYPHS[c], `glyph for ${c}`).toBeDefined();
    });
  });
  it('produces integer rects for a label', () => {
    const rects = glyphRectsFor('DP-750');
    expect(rects.length).toBeGreaterThan(0);
    rects.forEach((r) => { expect(Number.isInteger(r.x)).toBe(true); expect(Number.isInteger(r.y)).toBe(true); });
  });
  it('space advances but emits no rects for the space', () => {
    expect(glyphRectsFor('A A').length).toBe(glyphRectsFor('AA').length);
  });
  it('throws on unsupported glyph', () => expect(() => glyphRectsFor('a')).toThrow());
});
```

- [ ] 7.2 Run `npm run test:unit` — expect FAIL.
- [ ] 7.3 Implement `src/lib/pixelFont.ts`. Author a 5×7 bitmap per glyph (A–Z, 0–9, `-`), keeping DP-750's glyphs visually close to the current hand-drawn logo:

```ts
import { isSupportedLabel } from '../data/subjects/schema';

export const GLYPH_W = 5;
export const GLYPH_H = 7;
const GAP = 1;

// Each glyph: 7 rows of 5 chars ('0'/'1'). Author all A-Z, 0-9, '-' at implementation.
export const GLYPHS: Record<string, string[]> = {
  '-': ['00000', '00000', '00000', '01110', '00000', '00000', '00000'],
  // ... remaining glyphs ...
};

export function glyphRectsFor(text: string): { x: number; y: number }[] {
  if (!isSupportedLabel(text)) throw new Error(`pixelFont: unsupported text "${text}"`);
  const rects: { x: number; y: number }[] = [];
  let cursorX = 0;
  for (const ch of text) {
    if (ch === ' ') { cursorX += GLYPH_W + GAP; continue; }
    const rows = GLYPHS[ch];
    if (!rows) throw new Error(`pixelFont: no glyph for "${ch}"`);
    rows.forEach((row, y) => [...row].forEach((bit, x) => { if (bit === '1') rects.push({ x: cursorX + x, y }); }));
    cursorX += GLYPH_W + GAP;
  }
  return rects;
}

export function labelWidth(text: string): number { return text.length * (GLYPH_W + GAP) - GAP; }
```

- [ ] 7.4 Run `npm run test:unit` — expect PASS (after all glyphs authored; the glyph-coverage test is the correctness gate).
- [ ] 7.5 Refactor `PixelLogo.tsx` to `PixelLogo({ text, scale = 6, animated = true, showCursor = true })`: build `<rect>`s from `glyphRectsFor(text)`; viewBox `0 0 {labelWidth(text)} {GLYPH_H}`; keep the identical GSAP effect (selects `svg.querySelectorAll('rect')`) and the existing fill colour.
- [ ] 7.6 Run `npm run build && npm run test:unit` — expect PASS.
- [ ] 7.7 Commit: `feat(hero): pixel-font renderer for arbitrary short labels`.

## 8. Drive branding from the active subject

Files: modify `src/components/AppShell.tsx`, `src/pages/DashboardPage.tsx`, `src/components/quiz/QuizPage.tsx`.

- [ ] 8.1 `AppShell`: `<PixelLogo text={subject.shortLabel} scale={2} animated={false} showCursor={false} />` when a subject is active; app-brand text on the picker route.
- [ ] 8.2 `DashboardPage`: hero `<PixelLogo text={subject.shortLabel} />`.
- [x] 8.3 `components/quiz/QuizPage.tsx`: replace the 4 `"DP-750 Quiz"` literals with `` `${subject.shortLabel} Quiz` `` (and `` `${subject.shortLabel} Quiz: ${topic.title}` `` where a topic is set).
- [ ] 8.4 `grep -rn "DP-750" src` — expect hits only inside `src/data/subjects/dp-750.json`.
- [ ] 8.5 Run `npm run build` — expect PASS.
- [ ] 8.6 Commit: `feat(branding): drive wordmark, hero, quiz titles from active subject`.

## 9. Progress storage v2 + migration

Files: modify `src/utils/progressStorage.ts`; create `src/utils/progressStorage.test.ts`.
Produces: `migrate(raw): ProgressStateV2`, `loadProgressState()`, `saveProgressState()`, `createDefaultProgressState()`, `emptySubjectProgress()`, `getSubjectProgress(state, id)`, `resetProgressState()`.

- [x] 9.1 Write failing test `src/utils/progressStorage.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { migrate } from './progressStorage';

describe('progress migration', () => {
  it('wraps a v1 blob under dp-750', () => {
    const v1 = { version: 1, completedTopicIds: ['t1', 't2'], completedSubtopicIds: { t1: ['s1'] }, lastVisitedTopicSlug: 'plan' };
    const v2 = migrate(v1);
    expect(v2.version).toBe(2);
    expect(v2.subjects['dp-750'].completedTopicIds).toEqual(['t1', 't2']);
    expect(v2.subjects['dp-750'].lastVisitedTopicSlug).toBe('plan');
  });
  it('is idempotent on v2', () => {
    const v2 = { version: 2, subjects: { 'dp-750': { completedTopicIds: ['t1'], completedSubtopicIds: {} } } };
    expect(migrate(v2)).toEqual(v2);
  });
  it('falls back to default on garbage', () => {
    expect(migrate(null).version).toBe(2);
    expect(migrate({ foo: 1 }).subjects).toBeDefined();
  });
});
```

- [x] 9.2 Run `npm run test:unit` — expect FAIL.
- [x] 9.3 Rewrite `src/utils/progressStorage.ts` to v2 (key stays `studyapp_progress`):

```ts
import { ProgressStateV2, SubjectProgress } from '../types/study';

const STORAGE_KEY = 'studyapp_progress';
const DEFAULT_SUBJECT = 'dp-750';

export const emptySubjectProgress = (): SubjectProgress => ({ completedTopicIds: [], completedSubtopicIds: {} });
export const createDefaultProgressState = (): ProgressStateV2 => ({ version: 2, subjects: {} });

export function migrate(raw: unknown): ProgressStateV2 {
  if (typeof raw !== 'object' || raw === null) return createDefaultProgressState();
  const o = raw as Record<string, unknown>;
  if (o.version === 2 && typeof o.subjects === 'object' && o.subjects !== null) return o as unknown as ProgressStateV2;
  if (Array.isArray(o.completedTopicIds)) {
    return {
      version: 2,
      subjects: { [DEFAULT_SUBJECT]: {
        completedTopicIds: o.completedTopicIds as string[],
        completedSubtopicIds: (o.completedSubtopicIds as Record<string, string[]>) ?? {},
        lastVisitedTopicSlug: o.lastVisitedTopicSlug as string | undefined,
      } },
      preferences: o.preferences as ProgressStateV2['preferences'],
    };
  }
  return createDefaultProgressState();
}

export const loadProgressState = (): ProgressStateV2 => {
  try { const raw = localStorage.getItem(STORAGE_KEY); return migrate(raw ? JSON.parse(raw) : null); }
  catch { return createDefaultProgressState(); }
};
export const saveProgressState = (s: ProgressStateV2): void => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
export const resetProgressState = (): ProgressStateV2 => { const n = createDefaultProgressState(); saveProgressState(n); return n; };
export const getSubjectProgress = (s: ProgressStateV2, id: string): SubjectProgress => s.subjects[id] ?? emptySubjectProgress();
```

- [x] 9.4 Run `npm run test:unit` — expect PASS.
- [x] 9.5 Commit: `feat(progress): subject-scoped v2 store with lossless v1 migration`.

## 10. Subject-scoped ProgressContext + useProgress

Files: modify `src/context/ProgressContext.tsx`, `src/hooks/useProgress.ts`, `src/pages/{DashboardPage,TopicPage}.tsx`.
Produces: `useProgress(subjectId)` → `{ progress, toggleTopicComplete, markTopicComplete, setLastVisitedTopic }`.

- [x] 10.1 `ProgressContext.tsx`: hold full `ProgressStateV2`; expose `state`, `updateSubject(id, fn)`, `resetProgress`:

```tsx
const updateSubject = useCallback((subjectId: string, fn: (p: SubjectProgress) => SubjectProgress) => {
  setState((prev) => {
    const cur = prev.subjects[subjectId] ?? emptySubjectProgress();
    const next = { ...prev, subjects: { ...prev.subjects, [subjectId]: fn(cur) } };
    saveProgressState(next);
    return next;
  });
}, []);
```

- [x] 10.2 `useProgress.ts` binds one subject:

```ts
export function useProgress(subjectId: string) {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  const progress = ctx.state.subjects[subjectId] ?? emptySubjectProgress();
  return {
    progress,
    toggleTopicComplete: (topicId: string) => ctx.updateSubject(subjectId, (p) => ({
      ...p,
      completedTopicIds: p.completedTopicIds.includes(topicId)
        ? p.completedTopicIds.filter((id) => id !== topicId)
        : [...p.completedTopicIds, topicId],
    })),
    markTopicComplete: (topicId: string) => ctx.updateSubject(subjectId, (p) =>
      p.completedTopicIds.includes(topicId) ? p : { ...p, completedTopicIds: [...p.completedTopicIds, topicId] }),
    setLastVisitedTopic: (slug: string) => ctx.updateSubject(subjectId, (p) =>
      p.lastVisitedTopicSlug === slug ? p : { ...p, lastVisitedTopicSlug: slug }),
  };
}
```

- [x] 10.3 `DashboardPage`/`TopicPage` call `useProgress(subject.id)`; stats compute against `subject.topics`; `TopicPage` calls `setLastVisitedTopic(topic.slug)` on mount.
- [x] 10.4 Run `npm run build && npm run test:unit` — expect PASS.
- [x] 10.5 Commit: `feat(progress): subject-scoped context + useProgress(subjectId)`.

## 11. E2e updates + Playwright webServer + final verification

Files: create `playwright.config.ts`; modify `tests/dashboard.spec.ts`, `tests/quiz-flow.spec.ts`, `tests/quiz-page.screenshot.test.ts`.

- [ ] 11.1 Add `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:5174' },
  webServer: { command: 'npm run dev -- --port 5174', url: 'http://localhost:5174', reuseExistingServer: true, timeout: 60_000 },
});
```

- [ ] 11.2 Update specs to subject routes: `/quiz` → `/dp-750/quiz`, `/quiz?topic=...` → `/dp-750/quiz?topic=...`, dashboard `/` → `/dp-750`. Screenshot test URL → `/dp-750/quiz` (path already `test-results/quiz-page.png`). Use relative paths now that `baseURL` is set.
- [ ] 11.3 Run `npm run test:unit && npm run test` — unit PASS; Playwright PASS (webServer auto-starts). Fix any selector drift.
- [ ] 11.4 Build + visual smoke: `npm run build && npm run preview -- --port 4173`; screenshot `/` (picker), `/dp-750` (pixel hero), open ☰ switcher, run one quiz question; confirm previously-completed DP-750 topics still show complete (migration worked).
- [ ] 11.5 Commit: `test: subject-scoped e2e routes + playwright webServer config`.

---

## Coverage map

- subject-catalog → §4, §5, §6, §8 · subject-content-model → §1, §2, §3 · pixel-font-hero → §7 · localstorage-progress (v2 + migration) → §9, §10 · content-grounding (per-subject sourcePolicy) → §2 · header switcher → §6 · arbitrary/non-Microsoft subjects → `sourcePolicy` default in §2.
- **Generated-data exception:** the 5×7 glyph bitmaps (§7) and migrated `dp-750.json` (§3) are authored/generated during implementation, each guarded by a validating test (glyph-coverage; loader counts).
