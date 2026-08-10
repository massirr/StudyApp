import { Subject, SourcePolicy } from '../../types/study';
import { isOfficialMicrosoftUrl } from '../../utils/contentValidation.js';

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
    id: req(o, 'id'),
    slug: req(o, 'slug'),
    name: req(o, 'name'),
    shortLabel: req(o, 'shortLabel'),
    tagline: req(o, 'tagline'),
    sourcePolicy: (o.sourcePolicy as SourcePolicy) ?? 'any',
    sources: req(o, 'sources'),
    topics: req(o, 'topics'),
    questions: req(o, 'questions'),
    notes: req(o, 'notes'),
  };

  for (const key of ['topics', 'questions', 'sources', 'notes'] as const) {
    if (!Array.isArray(s[key])) throw new Error(`Subject ${key} must be an array`);
  }

  if (!isSupportedLabel(s.shortLabel)) {
    throw new Error(`shortLabel "${s.shortLabel}" contains an unsupported glyph (allowed: A-Z 0-9 hyphen space)`);
  }

  // Only the additive freeText/media fields are checked here — existing MCQ and
  // topic shapes are left to TypeScript, exactly as before this change.
  for (const q of s.questions) {
    if (q.type === 'freeText' && typeof q.sampleAnswer !== 'string') {
      throw new Error(`freeText question "${q.id}" is missing sampleAnswer`);
    }
    // shortText is auto-graded, so it is useless without something to grade against.
    if (
      q.type === 'shortText' &&
      (!Array.isArray(q.acceptedAnswers) ||
        q.acceptedAnswers.filter((a) => typeof a === 'string' && a.trim()).length === 0)
    ) {
      throw new Error(`shortText question "${q.id}" needs a non-empty acceptedAnswers array`);
    }
  }

  for (const t of s.topics) {
    if (t.passage !== undefined && typeof t.passage.text !== 'string') {
      throw new Error(`topic "${t.id}" has a passage without text`);
    }
    if (t.audio !== undefined && typeof t.audio.src !== 'string') {
      throw new Error(`topic "${t.id}" has audio without src`);
    }
  }

  if (s.sourcePolicy === 'microsoft-only') {
    const urls = [
      ...s.sources.map((x) => x.url),
      ...s.questions.flatMap((q) => q.sourceUrls),
    ];
    const bad = urls.find((u) => !isOfficialMicrosoftUrl(u));
    if (bad) throw new Error(`microsoft-only subject has non-Microsoft source URL: ${bad}`);
  }

  return s;
}
