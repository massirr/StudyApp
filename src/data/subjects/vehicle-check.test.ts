import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSubjectBySlug } from './index';
import { gradeQuestion as isAnswerCorrect } from '../../hooks/useQuizState';

// Content guards for the vehicle-check subject
// (openspec/changes/vehicle-check-subject). Schema, option-id and answer-letter
// rules are already enforced for every subject by schema.test.ts and
// answerDistribution.test.ts, so this file only covers what is specific here:
// the image files exist, topics resolve, every fact is sourced, and the typed
// vocabulary answers behave as the learner would expect.

const subject = getSubjectBySlug('vehicle-check');

describe('vehicle-check subject', () => {
  it('is registered', () => {
    expect(subject).toBeDefined();
  });

  it('has the five topics of the Flemish exam structure', () => {
    expect(subject!.topics.map((t) => t.id)).toEqual(['t-1', 't-2', 't-3', 't-4', 't-5']);
  });

  it('puts every question and note under an existing topic', () => {
    const ids = new Set(subject!.topics.map((t) => t.id));
    for (const q of subject!.questions) expect(ids, q.id).toContain(q.topicId);
    for (const n of subject!.notes) expect(ids, n.id).toContain(n.topicId);
  });

  it('gives every topic at least one note and one question', () => {
    for (const t of subject!.topics) {
      expect(subject!.questions.some((q) => q.topicId === t.id), t.id).toBe(true);
      expect(subject!.notes.some((n) => n.topicId === t.id), t.id).toBe(true);
    }
  });

  it('has unique ids', () => {
    for (const key of ['questions', 'notes', 'sources', 'topics'] as const) {
      const ids = subject![key].map((x) => x.id);
      expect(new Set(ids).size, key).toBe(ids.length);
    }
  });

  it('cites a listed source for every question and note', () => {
    const listed = new Set(subject!.sources.map((s) => s.url));
    for (const q of subject!.questions) {
      expect(q.sourceUrls.length, q.id).toBeGreaterThan(0);
      for (const u of q.sourceUrls) expect(listed, `${q.id} ${u}`).toContain(u);
    }
    for (const n of subject!.notes) {
      for (const u of n.sourceUrls) expect(listed, `${n.id} ${u}`).toContain(u);
    }
  });

  it('uses the Belgian rear fog light threshold of 100 m', () => {
    const q = subject!.questions.find((x) => x.prompt.includes('mistachterlicht in België'));
    expect(q).toBeDefined();
    const correct = q!.options.find((o) => o.id === q!.correctOptionIds[0]);
    expect(correct!.label).toContain('100 m');
  });

  it('points every image at a file under public/ with alt text', () => {
    const withImage = subject!.questions.filter((q) => q.image);
    expect(withImage.length).toBeGreaterThan(0);
    for (const q of withImage) {
      expect(q.image!.alt.trim().length, q.id).toBeGreaterThan(10);
      const file = resolve(__dirname, '../../../public', q.image!.src.replace(/^\//, ''));
      expect(existsSync(file), `${q.id}: missing ${q.image!.src}`).toBe(true);
    }
  });

  // ponytail: "photo" = any non-SVG image (the SVGs are the app's own diagrams).
  // If the learner adds their own photos, give them a credit-free path here.
  it('credits every photo with author, licence and a listed source', () => {
    const listed = new Set(subject!.sources.map((s) => s.url));
    const photos = subject!.questions.filter((q) => q.image && !q.image.src.endsWith('.svg'));
    expect(photos.length).toBeGreaterThan(0);
    for (const q of photos) {
      expect(q.explanation, q.id).toMatch(/Foto \/ Photo: .+, (CC|Public domain)/);
      const commons = q.sourceUrls.filter((u) => u.startsWith('https://commons.wikimedia.org/wiki/File:'));
      expect(commons.length, q.id).toBeGreaterThan(0);
      for (const u of commons) expect(listed, `${q.id} ${u}`).toContain(u);
    }
  });

  it('makes every prompt bilingual (Dutch with an English rendering in brackets)', () => {
    for (const q of subject!.questions) {
      expect(q.prompt, q.id).toMatch(/\(.+\)\s*$/);
    }
  });

  describe('typed vocabulary answers', () => {
    const typed = subject!.questions.filter((q) => q.type === 'shortText');

    it('has vocabulary drills in both directions', () => {
      expect(typed.some((q) => q.prompt.includes('in het Nederlands'))).toBe(true);
      expect(typed.some((q) => q.prompt.includes('in het Engels'))).toBe(true);
    });

    it('accepts every listed variant and tolerates case and trailing punctuation', () => {
      for (const q of typed) {
        for (const a of q.acceptedAnswers!) {
          expect(isAnswerCorrect(q, [], null, a), `${q.id} "${a}"`).toBe(true);
          expect(isAnswerCorrect(q, [], null, `  ${a.toUpperCase()}. `), `${q.id} "${a}" upper`).toBe(true);
        }
      }
    });

    it('rejects an unrelated word', () => {
      for (const q of typed) {
        expect(isAnswerCorrect(q, [], null, 'banaan'), q.id).toBe(false);
      }
    });

    it('accepts the standard Dutch term for dipped beam', () => {
      const q = typed.find((x) => x.acceptedAnswers!.includes('dimlicht'));
      expect(q).toBeDefined();
      expect(isAnswerCorrect(q!, [], null, 'Dimlicht')).toBe(true);
    });
  });
});
