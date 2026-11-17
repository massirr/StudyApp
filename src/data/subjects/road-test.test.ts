import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSubjectBySlug } from './index';
import { gradeQuestion as isAnswerCorrect } from '../../hooks/useQuizState';

// Content guards for the road-test subject (openspec/changes/road-test-subject).
// Schema, option-id and answer-letter rules are enforced for every subject by
// schema.test.ts and answerDistribution.test.ts; this file covers what is specific
// here: the exam-centre intro, the sign meanings, the GOCA fail rules, the
// manoeuvre rules, and that every source, video link and image resolves.

const subject = getSubjectBySlug('road-test');

const correctLabel = (promptPart: string, opts: { image?: string } = {}) => {
  const q = subject!.questions.find(
    (x) => x.prompt.includes(promptPart) && (!opts.image || x.image?.src.endsWith(`/${opts.image}.svg`)),
  );
  expect(q, promptPart).toBeDefined();
  return q!.options.find((o) => o.id === q!.correctOptionIds[0])!.label;
};

describe('road-test subject', () => {
  it('is registered with a pixel-safe short label', () => {
    expect(subject).toBeDefined();
    expect(subject!.shortLabel).toBe('ROAD TEST');
    expect(subject!.sourcePolicy).toBe('any');
  });

  it('has the five topics in study order', () => {
    expect(subject!.topics.map((t) => t.slug)).toEqual([
      'examendag-mollem',
      'borden-nooit-missen',
      'fouten-examen-stopt',
      'rustig-rijden',
      'manoeuvres-video',
    ]);
  });

  it('gives every topic at least one note and one question, under existing topics', () => {
    const ids = new Set(subject!.topics.map((t) => t.id));
    for (const q of subject!.questions) expect(ids, q.id).toContain(q.topicId);
    for (const n of subject!.notes) expect(ids, n.id).toContain(n.topicId);
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

  it('cites a listed source for every question, note and topic link', () => {
    const listed = new Set(subject!.sources.map((s) => s.url));
    for (const q of subject!.questions) {
      expect(q.sourceUrls.length, q.id).toBeGreaterThan(0);
      for (const u of q.sourceUrls) expect(listed, `${q.id} ${u}`).toContain(u);
    }
    for (const n of subject!.notes) for (const u of n.sourceUrls) expect(listed, `${n.id} ${u}`).toContain(u);
    for (const t of subject!.topics) for (const l of t.sourceLinks) expect(listed, `${t.id} ${l.url}`).toContain(l.url);
  });

  it('links only VSV videos on YouTube, each labelled as a video', () => {
    const videos = subject!.sources.filter((s) => s.url.startsWith('https://www.youtube.com/'));
    expect(videos.length).toBeGreaterThanOrEqual(5);
    for (const v of videos) {
      expect(v.url, v.id).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/);
      expect(v.label, v.id).toMatch(/^Video VSV/);
    }
    const manoeuvres = subject!.topics.find((t) => t.slug === 'manoeuvres-video')!;
    expect(manoeuvres.sourceLinks.filter((l) => l.label.startsWith('Video:')).length).toBe(5);
  });

  it('points every image at an existing file with a description', () => {
    const withImage = subject!.questions.filter((q) => q.image);
    expect(withImage.length).toBeGreaterThanOrEqual(13);
    for (const q of withImage) {
      expect(q.image!.alt.trim().length, q.id).toBeGreaterThan(10);
      const file = resolve(__dirname, '../../../public', q.image!.src.replace(/^\//, ''));
      expect(existsSync(file), `${q.id}: missing ${q.image!.src}`).toBe(true);
    }
  });

  it('makes every prompt bilingual (Dutch with an English rendering in brackets)', () => {
    for (const q of subject!.questions) expect(q.prompt, q.id).toMatch(/\(.+\)\s*$/);
  });

  describe('exam day in Mollem', () => {
    const intro = () => subject!.topics[0];

    it('names the exam centre with address and contact', () => {
      const text = intro().subtopics.map((s) => s.summary).join(' ');
      expect(text).toContain('Industriezone Z.5 Mollem 80, 1730 Mollem');
      expect(text).toContain('+32 2 452 99 37');
      expect(text).toContain('examenmollem@aibv.be');
    });

    it('allows a sworn interpreter for French, German or English only', () => {
      expect(correctLabel('beëdigd tolk je bijstaan')).toContain('Frans, Duits of Engels');
    });

    it('does not let the interpreter be the companion', () => {
      expect(correctLabel('Mag je tolk ook je begeleider zijn')).toMatch(/^Nee/);
    });
  });

  describe('signs you must never miss', () => {
    it('uses the official meaning for C1 (no entry)', () => {
      expect(correctLabel('Wat betekent dit bord', { image: 'c1' })).toMatch(/^Verboden richting voor iedere bestuurder/);
    });

    it('covers every sign on the GOCA fail list and the priority signs', () => {
      const shown = new Set(
        subject!.questions.filter((q) => q.image).map((q) => q.image!.src.split('/').pop()!.replace('.svg', '')),
      );
      for (const code of ['c1', 'c3', 'c31a', 'c33', 'd1', 'd3', 'd5', 'b1', 'b5', 'b9', 'b11', 'b15', 'b17']) {
        expect(shown, code).toContain(code);
      }
    });

    it('puts the road code above the GPS', () => {
      expect(correctLabel('De gps zegt \'rechtsaf\'')).toMatch(/^Niet inrijden/);
    });
  });

  describe('mistakes that end the exam', () => {
    it('stops the exam when the companion intervenes', () => {
      expect(correctLabel('Je begeleider zet tijdens de rit de ruitenwissers aan')).toMatch(/examen stopt/);
    });

    it('uses only explicitly allowed actions as wrong options for the immediate-fail question', () => {
      const q = subject!.questions.find((x) => x.prompt.startsWith('Welke van deze fouten betekent meteen'))!;
      const wrong = q.options.filter((o) => !q.correctOptionIds.includes(o.id)).map((o) => o.label).join(' | ');
      expect(wrong).toContain('herbeginnen bij evenwijdig parkeren');
      expect(wrong).toContain('spiegels bij te stellen');
      expect(wrong).toContain('geluid van de gps');
    });
  });

  describe('manoeuvres', () => {
    it('allows one restart in parallel parking', () => {
      expect(correctLabel('Hoe vaak mag je herbeginnen bij evenwijdig parkeren')).toMatch(/^1 keer/);
    });

    it('ends parallel parking only when you rejoin traffic', () => {
      expect(correctLabel('Wanneer is het manoeuvre evenwijdig parkeren beëindigd')).toMatch(/deelneemt aan het verkeer/);
    });
  });

  describe('typed vocabulary answers', () => {
    const typed = subject!.questions.filter((q) => q.type === 'shortText');

    it('accepts every listed variant and tolerates case and trailing punctuation', () => {
      expect(typed.length).toBeGreaterThan(0);
      for (const q of typed) {
        for (const a of q.acceptedAnswers!) {
          expect(isAnswerCorrect(q, [], null, a), `${q.id} "${a}"`).toBe(true);
          expect(isAnswerCorrect(q, [], null, `  ${a.toUpperCase()}. `), `${q.id} "${a}" upper`).toBe(true);
        }
      }
    });

    it('rejects an unrelated word', () => {
      for (const q of typed) expect(isAnswerCorrect(q, [], null, 'banaan'), q.id).toBe(false);
    });
  });
});
