const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Formats an amount as US dollars, e.g. 1234.5 -> "$1,234.50". */
export function formatMoney(amount: number): string {
  return usd.format(amount);
}

/** Rounds to whole cents so sums of decimal prices never drift (0.1 + 0.2 -> 0.3). */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
