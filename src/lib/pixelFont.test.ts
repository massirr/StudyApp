import { describe, expect, it } from 'vitest';
import { glyphRectsFor, GLYPHS, GLYPH_H } from './pixelFont';

describe('pixelFont', () => {
  it('has a glyph for every supported char', () => {
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'.split('').forEach((c) => {
      expect(GLYPHS[c], `glyph for ${c}`).toBeDefined();
    });
  });
  it('every glyph is 7 rows of 5 columns', () => {
    Object.entries(GLYPHS).forEach(([ch, rows]) => {
      expect(rows.length, `${ch} row count`).toBe(GLYPH_H);
      rows.forEach((row) => expect(row).toMatch(/^[01]{5}$/));
    });
  });
  it('produces integer rects for a label', () => {
    const rects = glyphRectsFor('DP-750');
    expect(rects.length).toBeGreaterThan(0);
    rects.forEach((r) => {
      expect(Number.isInteger(r.x)).toBe(true);
      expect(Number.isInteger(r.y)).toBe(true);
    });
  });
  it('space advances but emits no rects for the space itself', () => {
    expect(glyphRectsFor('A A').length).toBe(glyphRectsFor('AA').length);
  });
  it('throws on unsupported glyph', () => {
    expect(() => glyphRectsFor('a')).toThrow();
  });
});
