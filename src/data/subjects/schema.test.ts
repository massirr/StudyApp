import { describe, expect, it } from 'vitest';
import { validateSubject, isSupportedLabel } from './schema';
import dp750 from './dp-750.json';

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
    const rest: Record<string, unknown> = { ...valid };
    delete rest.name;
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
  it('throws when topics is not an array', () => {
    expect(() => validateSubject({ ...valid, topics: 'x' })).toThrow(/topics must be an array/);
  });

  it('validates the shipped dp-750 subject unchanged', () => {
    expect(validateSubject(dp750).slug).toBe('dp-750');
  });

  it('accepts a freeText question with a sampleAnswer and no options', () => {
    const s = {
      ...valid,
      questions: [{
        id: 'q1', topicId: 't1', prompt: 'Vertaal: the house', type: 'freeText',
        options: [], correctOptionIds: [], sampleAnswer: 'het huis',
        explanation: 'huis is a het-word.', sourceUrls: [],
      }],
    };
    expect(validateSubject(s).questions[0].sampleAnswer).toBe('het huis');
  });

  it('rejects a freeText question missing sampleAnswer', () => {
    const s = {
      ...valid,
      questions: [{
        id: 'q1', topicId: 't1', prompt: 'p', type: 'freeText',
        options: [], correctOptionIds: [], explanation: 'e', sourceUrls: [],
      }],
    };
    expect(() => validateSubject(s)).toThrow(/sampleAnswer/);
  });

  it('accepts a topic carrying passage and audio', () => {
    const s = {
      ...valid,
      topics: [{
        id: 't1', slug: 't1', title: 'T', summary: '', subtopics: [], sourceLinks: [], studyOrder: 1,
        passage: { title: 'Op het station', text: 'Ik wacht op de trein.' },
        audio: { src: '/audio/dutch/t1.mp3', title: 'Dialoog 1' },
      }],
    };
    expect(validateSubject(s).topics[0].passage?.text).toBe('Ik wacht op de trein.');
  });

  it('rejects a passage without text and audio without src', () => {
    const topic = { id: 't1', slug: 't1', title: 'T', summary: '', subtopics: [], sourceLinks: [], studyOrder: 1 };
    expect(() => validateSubject({ ...valid, topics: [{ ...topic, passage: { title: 'x' } }] }))
      .toThrow(/passage without text/);
    expect(() => validateSubject({ ...valid, topics: [{ ...topic, audio: { title: 'x' } }] }))
      .toThrow(/audio without src/);
  });

  it('leaves topics without media untouched', () => {
    const topic = { id: 't1', slug: 't1', title: 'T', summary: '', subtopics: [], sourceLinks: [], studyOrder: 1 };
    const out = validateSubject({ ...valid, topics: [topic] }).topics[0];
    expect(out.passage).toBeUndefined();
    expect(out.audio).toBeUndefined();
  });
});

describe('isSupportedLabel', () => {
  it('accepts A-Z 0-9 hyphen space', () => expect(isSupportedLabel('AZ-900 X')).toBe(true));
  it('rejects lowercase/punctuation', () => expect(isSupportedLabel('Dutch!')).toBe(false));
});
