/** Formats a decimal amount with the browser's own currency rules. */
export function formatMoney(amount: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
