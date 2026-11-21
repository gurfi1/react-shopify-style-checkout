import { describe, expect, it } from 'vitest';
import { defaultLabels } from '../labels';
import { he } from './he';

describe('Hebrew labels', () => {
  it('has every label, each of the same kind as the English one', () => {
    for (const key of Object.keys(defaultLabels) as (keyof typeof defaultLabels)[]) {
      expect(typeof he[key], key).toBe(typeof defaultLabels[key]);
    }
    expect(Object.keys(he).sort()).toEqual(Object.keys(defaultLabels).sort());
  });

  it('leaves no label empty or still in English', () => {
    for (const [key, value] of Object.entries(he)) {
      if (typeof value !== 'string' || key === 'moreCardsCount') continue;
      expect(value.trim(), key).not.toBe('');
      expect(/[֐-׿]/.test(value), key).toBe(true);
    }
  });

  it('builds the sentences that take a value', () => {
    expect(he.subtotal(1)).toBe('סכום ביניים · פריט אחד');
    expect(he.subtotal(3)).toBe('סכום ביניים · 3 פריטים');
    expect(he.thankYou('עדה')).toBe('תודה, עדה!');
    expect(he.thankYou('')).toBe('תודה!');
    expect(he.errorPostalInvalid('מיקוד')).toBe('הזינו מיקוד תקין');
    expect(he.cardEnding('Visa', '4242')).toContain('4242');
    expect(he.didYouMean('a@b.co')).toHaveLength(3);
  });
});
