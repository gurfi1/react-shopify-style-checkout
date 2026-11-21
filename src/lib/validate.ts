import { defaultLabels, type Labels } from '../labels';
import type { Address, CardValue, Country } from '../types';
import { hasRegions, isPostalValid, postalWord } from './address';
import { cardDigits, isCardNumberPlausible, isExpiryValid, isSecurityCodeValid } from './card';
import { isContact, startsLikePhone } from './email';

export type AddressField = 'lastName' | 'line1' | 'city' | 'region' | 'postal';
export type CardField = 'number' | 'expiry' | 'cvc' | 'name';

/**
 * The contact field's error, or null when it is fine.
 * `final` is true on submit, when an empty field is an error; on blur an empty field is left alone.
 */
export function contactError(value: string, final: boolean, labels: Labels = defaultLabels): string | null {
  const text = value.trim();
  if (!text) return final ? labels.errorContactRequired : null;
  if (isContact(text)) return null;
  return startsLikePhone(text) ? labels.errorPhone : labels.errorEmail;
}

/** The postal field's error on blur: only a filled-in, malformed code is flagged. */
export function postalBlurError(postal: string, country: Country, labels: Labels = defaultLabels): string | null {
  return postal.trim() && !isPostalValid(country, postal) ? labels.errorPostalInvalid(postalWord(country)) : null;
}

/** Errors for a whole address on submit, in field order. */
export function addressErrors(address: Address, country: Country, labels: Labels = defaultLabels): Partial<Record<AddressField, string>> {
  const errors: Partial<Record<AddressField, string>> = {};
  if (!address.lastName.trim()) errors.lastName = labels.errorLastName;
  if (!address.line1.trim()) errors.line1 = labels.errorAddress;
  if (!address.city.trim()) errors.city = labels.errorCity;
  if (hasRegions(country) && !address.region) errors.region = labels.errorRegion(country.regionLabel ?? '');
  if (!address.postal.trim()) errors.postal = labels.errorPostalRequired(postalWord(country));
  else if (!isPostalValid(country, address.postal)) errors.postal = labels.errorPostalInvalid(postalWord(country));
  return errors;
}

/** The card number's error on blur: only a started, too-short number is flagged. */
export function cardNumberBlurError(number: string, labels: Labels = defaultLabels): string | null {
  return cardDigits(number) && !isCardNumberPlausible(number) ? labels.errorCardInvalid : null;
}

/** The expiry's error on blur: only a filled-in, invalid date is flagged. */
export function expiryBlurError(expiry: string, labels: Labels = defaultLabels, now = new Date()): string | null {
  return expiry && !isExpiryValid(expiry, now) ? labels.errorExpiry : null;
}

/** Errors for the card fields on submit, in field order. */
export function cardErrors(card: CardValue, labels: Labels = defaultLabels, now = new Date()): Partial<Record<CardField, string>> {
  const errors: Partial<Record<CardField, string>> = {};
  if (!cardDigits(card.number)) errors.number = labels.errorCardRequired;
  else if (!isCardNumberPlausible(card.number)) errors.number = labels.errorCardInvalid;
  if (!isExpiryValid(card.expiry, now)) errors.expiry = labels.errorExpiry;
  if (!isSecurityCodeValid(card.cvc)) errors.cvc = labels.errorSecurityCode;
  if (!card.name.trim()) errors.name = labels.errorNameOnCard;
  return errors;
}
