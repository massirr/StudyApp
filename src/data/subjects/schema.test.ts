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
