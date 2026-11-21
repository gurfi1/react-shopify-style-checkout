export type TotalsInput = {
  subtotal: number;
  /** Amount taken off, as a positive number. */
  discount?: number;
  /** null while no shipping price is known yet. */
  shipping?: number | null;
};

export type TotalsResult = { subtotal: number; discount: number; shipping: number | null; total: number };

const cents = (amount: number) => Math.round(amount * 100) / 100;

/**
 * subtotal − discount + shipping, rounded to cents.
 * A production site should take totals from its server (tax, rounding rules) and only display them.
 */
export function computeTotals({ subtotal, discount = 0, shipping = null }: TotalsInput): TotalsResult {
  return { subtotal, discount, shipping, total: cents(subtotal - discount + (shipping ?? 0)) };
}
