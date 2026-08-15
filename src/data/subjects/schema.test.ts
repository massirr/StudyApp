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

  it('accepts a shortText question with acceptedAnswers and no options', () => {
    const s = {
      ...valid,
      questions: [{
        id: 'q1', topicId: 't1', prompt: "Vul in: 'Ik ____ graag ...'", type: 'shortText',
        options: [], correctOptionIds: [], acceptedAnswers: ['zou'],
        explanation: 'Conditional.', sourceUrls: [],
      }],
    };
    expect(validateSubject(s).questions[0].acceptedAnswers).toEqual(['zou']);
  });

  it('rejects a shortText question with missing or empty acceptedAnswers', () => {
    const base = {
      id: 'q1', topicId: 't1', prompt: 'p', type: 'shortText',
      options: [], correctOptionIds: [], explanation: 'e', sourceUrls: [],
    };
    for (const acceptedAnswers of [undefined, [], ['   '], 'zou']) {
      const s = { ...valid, questions: [{ ...base, acceptedAnswers }] };
      expect(() => validateSubject(s), `acceptedAnswers=${JSON.stringify(acceptedAnswers)}`)
        .toThrow(/acceptedAnswers/);
    }
  });

  it('accepts a question with a well-formed image', () => {
    const s = {
      ...valid,
      questions: [{
        id: 'q1', topicId: 't1', prompt: 'Beschrijf', type: 'freeText',
        options: [], correctOptionIds: [], sampleAnswer: 'a',
        image: { src: '/images/nl3/x.jpg', alt: 'Twee vrouwen naast elkaar' },
        explanation: 'e', sourceUrls: [],
      }],
    };
    expect(validateSubject(s).questions[0].image?.alt).toBe('Twee vrouwen naast elkaar');
  });

  it('rejects an image without a non-empty src and alt', () => {
    const base = {
      id: 'q1', topicId: 't1', prompt: 'p', type: 'freeText',
      options: [], correctOptionIds: [], sampleAnswer: 'a', explanation: 'e', sourceUrls: [],
    };
    const bad = [
      { src: '/x.jpg' },                       // no alt
      { src: '/x.jpg', alt: '' },              // empty alt
      { src: '/x.jpg', alt: '   ' },           // whitespace alt
      { alt: 'beschrijving' },                 // no src
      { src: '', alt: 'beschrijving' },        // empty src
      'not-an-object',
    ];
    for (const image of bad) {
      const s = { ...valid, questions: [{ ...base, image }] };
      expect(() => validateSubject(s), JSON.stringify(image)).toThrow(/image/);
    }
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
