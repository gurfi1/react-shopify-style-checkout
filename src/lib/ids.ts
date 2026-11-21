import type { Address, CardValue } from '../types';

/** DOM ids of the checkout's fields. A billing address uses the same ids with a `b-` prefix. */
export const CONTACT_FIELD_ID = 'email';

export const ADDRESS_FIELD_IDS: Record<keyof Address, string> = {
  country: 'country',
  firstName: 'first',
  lastName: 'last',
  line1: 'address1',
  line2: 'address2',
  city: 'city',
  region: 'region',
  postal: 'postal',
};

export const CARD_FIELD_IDS: Record<keyof CardValue, string> = { number: 'cc', expiry: 'exp', cvc: 'cvc', name: 'ccname' };
