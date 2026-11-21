export type CardBrand = 'visa' | 'mastercard' | 'amex' | '';

export const CARD_BRAND_NAMES: Record<Exclude<CardBrand, ''>, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
};

export const cardDigits = (value: string) => value.replace(/\D/g, '');

/** Brand from the first digits; '' when not recognised yet. */
export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return '';
}

/** Groups of four, or 4-6-5 for American Express. Extra digits are dropped. */
export function formatCardNumber(value: string): string {
  let digits = cardDigits(value);
  const brand = detectCardBrand(digits);
  digits = digits.slice(0, brand === 'amex' ? 15 : 19);
  const groups = brand === 'amex' ? [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)] : (digits.match(/.{1,4}/g) ?? []);
  return groups.filter(Boolean).join(' ');
}

/**
 * Turns typed digits into "MM / YY". A first digit above 1 gets a leading zero.
 * `deleting` and `previous` let a backspace over the separator remove a digit instead of bouncing back.
 */
export function formatExpiry(value: string, previous = '', deleting = false): string {
  let digits = cardDigits(value).slice(0, 4);
  if (deleting && previous.endsWith(' / ') && digits.length === 2) digits = digits.slice(0, 1);
  if (digits.length === 1 && digits > '1') digits = '0' + digits;
  return digits.length >= 2 ? digits.slice(0, 2) + ' / ' + digits.slice(2) : digits;
}

/** True for a complete "MM / YY" that is this month or later. */
export function isExpiryValid(value: string, now = new Date()): boolean {
  const match = value.match(/^(\d{2}) \/ (\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  return month >= 1 && month <= 12 && (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1));
}

export const formatSecurityCode = (value: string) => cardDigits(value).slice(0, 4);

export const isSecurityCodeValid = (value: string) => /^\d{3,4}$/.test(value);

/** Long enough to be a card number. Real validation belongs to the payment provider. */
export const isCardNumberPlausible = (value: string) => cardDigits(value).length >= 12;
