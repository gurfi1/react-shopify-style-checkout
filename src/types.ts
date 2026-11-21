import type { ReactNode } from 'react';

/** One postal address. `region` is the state or province code, or '' where the country has none. */
export type Address = {
  country: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal: string;
};

/** How one country's address form behaves. */
export type Country = {
  code: string;
  name: string;
  /** Emoji flag shown in the contact field when a phone number is typed. */
  flag?: string;
  /** Label of the region select ("State", "Province"). Leave out for countries without regions. */
  regionLabel?: string;
  /** [code, name] pairs for the region select. */
  regions?: [code: string, name: string][];
  /** Label of the postal field ("ZIP code", "Postcode"). */
  postalLabel: string;
  postalPattern: RegExp;
};

export type AddressSuggestion = { line1: string; city: string; region: string; postal: string };

export type ShippingRate = { id: string; name: string; eta: string; price: number };

export type Discount = { code: string; amount: number };

export type PickupLocation = {
  id: string;
  name: string;
  address: string;
  /** "Usually ready in 24 hours" */
  ready?: string;
  /** "1.2 mi" */
  distance?: string;
};

export type PaymentMethod = {
  id: string;
  title: string;
  /**
   * card: card fields and billing address open under the row.
   * redirect: the shopper finishes paying somewhere else.
   * manual: pay later, for example cash on delivery. The pay button reads "Complete order".
   */
  kind: 'card' | 'redirect' | 'manual';
  /** Text shown in the panel of a redirect or manual method. */
  note?: string;
};

export type LineItemData = {
  id: string;
  title: string;
  variant?: string;
  quantity: number;
  /** Price of the whole line (unit price times quantity). */
  price: number;
  image?: ReactNode;
};

export type Policy = { id: string; label: string; title?: string; content: ReactNode };

export type CardValue = { number: string; expiry: string; cvc: string; name: string };

/** Everything the checkout collects, in the shape handed to `placeOrder`. Card details are deliberately absent. */
export type Order = {
  contact: string;
  marketing: boolean;
  delivery: 'ship' | 'pickup';
  shippingAddress: Address | null;
  shippingRate: string | null;
  pickupLocation: string | null;
  /** null means "same as shipping" or not needed. */
  billingAddress: Address | null;
  saveInfo: boolean;
  discountCode: string | null;
  /** `last4` is demo-only: with a real provider the card never reaches this code. */
  payment: { method: string; last4: string | null };
};

/** The four calls the checkout makes to a back end. Each returns a promise. */
export type CheckoutApi = {
  /** Address lookup. Resolve to up to five suggestions, or [] to show none. */
  suggestAddresses(query: string, country: string): Promise<AddressSuggestion[]>;
  /** Shipping rates for an address. [] means "cannot ship there". */
  shippingRates(address: Address): Promise<ShippingRate[]>;
  /** Apply a discount code. Reject with an Error whose message is shown under the field. */
  applyDiscount(code: string): Promise<Discount>;
  /** Place the order. Reject when the payment fails. */
  placeOrder(order: Order): Promise<{ confirmation: string }>;
};
