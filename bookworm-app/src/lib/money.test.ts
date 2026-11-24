import { describe, expect, it } from 'vitest';
import { formatMoney, roundMoney } from './money';

describe('formatMoney', () => {
  it.each([
    [0, '$0.00'],
    [8, '$8.00'],
    [12.99, '$12.99'],
    [1234.5, '$1,234.50'],
  ])('formats %s as %s', (amount, expected) => {
    expect(formatMoney(amount)).toBe(expected);
  });
});

describe('roundMoney', () => {
  it('removes floating point drift', () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });

  it('rounds to whole cents', () => {
    expect(roundMoney(12.994)).toBe(12.99);
    expect(roundMoney(12.996)).toBe(13);
  });

  it('keeps already rounded values unchanged', () => {
    expect(roundMoney(19.99)).toBe(19.99);
  });
});
