import { describe, expect, it } from 'vitest';
import { addressKey, addressLines, COUNTRIES, emptyAddress, findCountry, isAddressComplete, isPostalValid, postalWord } from './address';
import { detectCardBrand, formatCardNumber, formatExpiry, formatSecurityCode, isExpiryValid } from './card';
import { isContact, looksLikePhone, suggestEmailFix } from './email';
import { formatMoney } from './money';
import { computeTotals } from './totals';
import { addressErrors, cardErrors, cardNumberBlurError, contactError, expiryBlurError, postalBlurError } from './validate';

const US = findCountry(COUNTRIES, 'US');
const GB = findCountry(COUNTRIES, 'GB');
const CA = findCountry(COUNTRIES, 'CA');

describe('card', () => {
  it('detects the brand from the first digits', () => {
    expect(detectCardBrand('4')).toBe('visa');
    expect(detectCardBrand('51')).toBe('mastercard');
    expect(detectCardBrand('2221')).toBe('mastercard');
    expect(detectCardBrand('34')).toBe('amex');
    expect(detectCardBrand('37')).toBe('amex');
    expect(detectCardBrand('6011')).toBe('');
    expect(detectCardBrand('')).toBe('');
  });

  it('groups digits in fours and drops anything else', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardNumber('4242-4242 42')).toBe('4242 4242 42');
    expect(formatCardNumber('42424242424242424242424')).toBe('4242 4242 4242 4242 424');
    expect(formatCardNumber('abc')).toBe('');
  });

  it('groups American Express as 4-6-5 and stops at 15 digits', () => {
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
    expect(formatCardNumber('3782822463100059999')).toBe('3782 822463 10005');
  });

  it('formats the expiry as MM / YY while typing', () => {
    expect(formatExpiry('1')).toBe('1');
    expect(formatExpiry('5')).toBe('05 / ');
    expect(formatExpiry('12')).toBe('12 / ');
    expect(formatExpiry('12 / 3')).toBe('12 / 3');
    expect(formatExpiry('1234567')).toBe('12 / 34');
  });

  it('lets backspace cross the separator', () => {
    expect(formatExpiry('12 /', '12 / ', true)).toBe('1');
    expect(formatExpiry('12 / ', '12 / 3', true)).toBe('12 / ');
  });

  it('accepts this month and later, rejects the past and nonsense', () => {
    const now = new Date(2026, 10, 21);
    expect(isExpiryValid('11 / 26', now)).toBe(true);
    expect(isExpiryValid('01 / 27', now)).toBe(true);
    expect(isExpiryValid('10 / 26', now)).toBe(false);
    expect(isExpiryValid('13 / 30', now)).toBe(false);
    expect(isExpiryValid('00 / 30', now)).toBe(false);
    expect(isExpiryValid('12 / ', now)).toBe(false);
  });

  it('keeps up to four digits of security code', () => {
    expect(formatSecurityCode('12a345')).toBe('1234');
  });
});

describe('address', () => {
  it('validates postal codes per country', () => {
    expect(isPostalValid(US, '94103')).toBe(true);
    expect(isPostalValid(US, '94103-1234')).toBe(true);
    expect(isPostalValid(US, '9410')).toBe(false);
    expect(isPostalValid(CA, 'K2P 1L4')).toBe(true);
    expect(isPostalValid(GB, 'NW1 6XE')).toBe(true);
    expect(isPostalValid(GB, '94103')).toBe(false);
  });

  it('words the postal field for a sentence', () => {
    expect(postalWord(US)).toBe('ZIP code');
    expect(postalWord(GB)).toBe('postcode');
  });

  it('needs a region only where the country has them', () => {
    const base = { ...emptyAddress('US'), line1: '12 Market St', city: 'San Francisco', postal: '94103' };
    expect(isAddressComplete(base, US)).toBe(false);
    expect(isAddressComplete({ ...base, region: 'CA' }, US)).toBe(true);
    expect(isAddressComplete({ ...base, country: 'GB' }, GB)).toBe(true);
  });

  it('builds a key from the parts that affect shipping', () => {
    const a = { ...emptyAddress('US'), line1: '12 Market St', city: 'San Francisco', region: 'CA', postal: '94103' };
    expect(addressKey(a)).toBe(addressKey({ ...a, firstName: 'Ada', line2: 'Apt 4' }));
    expect(addressKey(a)).not.toBe(addressKey({ ...a, postal: '94104' }));
  });

  it('lays an address out as display lines', () => {
    const a = { country: 'US', firstName: 'Ada', lastName: 'Lovelace', line1: '12 Market St', line2: '', city: 'San Francisco', region: 'CA', postal: '94103' };
    expect(addressLines(a, US)).toEqual(['Ada Lovelace', '12 Market St', 'San Francisco CA 94103', 'United States']);
  });
});

describe('email', () => {
  it('accepts an email or a phone number as contact', () => {
    expect(isContact('ada@example.com')).toBe(true);
    expect(isContact('+1 415 555 0100')).toBe(true);
    expect(isContact('ada@example')).toBe(false);
    expect(isContact('12345')).toBe(false);
  });

  it('spots the start of a phone number', () => {
    expect(looksLikePhone('+14')).toBe(false);
    expect(looksLikePhone('+141')).toBe(true);
    expect(looksLikePhone('ada')).toBe(false);
  });

  it('suggests a fix for known domain typos only', () => {
    expect(suggestEmailFix('ada@gmial.com')).toBe('ada@gmail.com');
    expect(suggestEmailFix('ada@GMAIL.CON')).toBe('ada@gmail.com');
    expect(suggestEmailFix('ada@gmail.com')).toBeNull();
    expect(suggestEmailFix('not an email')).toBeNull();
  });
});

describe('money and totals', () => {
  it('formats with the locale and currency', () => {
    expect(formatMoney(84)).toBe('$84.00');
    expect(formatMoney(6.9, 'en-GB', 'GBP')).toBe('£6.90');
  });

  it('adds shipping and takes off the discount', () => {
    expect(computeTotals({ subtotal: 120 }).total).toBe(120);
    expect(computeTotals({ subtotal: 120, shipping: 6.9 }).total).toBe(126.9);
    expect(computeTotals({ subtotal: 120, discount: 12, shipping: 14.9 }).total).toBe(122.9);
    expect(computeTotals({ subtotal: 120, discount: 12, shipping: null }).total).toBe(108);
  });
});

describe('validation', () => {
  it('leaves an empty contact alone on blur and flags it on submit', () => {
    expect(contactError('', false)).toBeNull();
    expect(contactError('', true)).toBe('Enter an email or phone number');
    expect(contactError('ada@', true)).toBe('Enter a valid email');
    expect(contactError('+1 41', true)).toBe('Enter a valid phone number');
    expect(contactError('ada@example.com', true)).toBeNull();
  });

  it('lists address errors in field order', () => {
    expect(Object.keys(addressErrors(emptyAddress('US'), US))).toEqual(['lastName', 'line1', 'city', 'region', 'postal']);
    expect(addressErrors(emptyAddress('US'), US).region).toBe('Select a state');
    expect(addressErrors(emptyAddress('GB'), GB).region).toBeUndefined();
    expect(addressErrors({ ...emptyAddress('GB'), postal: 'nope' }, GB).postal).toBe('Enter a valid postcode');
    expect(addressErrors(emptyAddress('US'), US).postal).toBe('Enter a ZIP code');
  });

  it('flags a malformed postal code on blur but not an empty one', () => {
    expect(postalBlurError('', US)).toBeNull();
    expect(postalBlurError('941', US)).toBe('Enter a valid ZIP code');
  });

  it('checks the card fields', () => {
    const now = new Date(2026, 10, 21);
    expect(cardErrors({ number: '', expiry: '', cvc: '', name: '' }, undefined, now)).toEqual({
      number: 'Enter a card number',
      expiry: 'Enter a valid expiration date',
      cvc: 'Enter the CVV or security code on your card',
      name: 'Enter your name exactly as it’s written on your card',
    });
    expect(cardErrors({ number: '4242 4242 4242 4242', expiry: '12 / 30', cvc: '123', name: 'Ada Lovelace' }, undefined, now)).toEqual({});
    expect(cardNumberBlurError('4242')).toBe('Enter a valid card number');
    expect(cardNumberBlurError('')).toBeNull();
    expect(expiryBlurError('01 / 20', undefined, now)).toBe('Enter a valid expiration date');
    expect(expiryBlurError('', undefined, now)).toBeNull();
  });
});
