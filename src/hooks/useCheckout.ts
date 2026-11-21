import { useCallback, useMemo, useState } from 'react';
import { defaultLabels, type Labels } from '../labels';
import { addressLines, COUNTRIES, emptyAddress, findCountry } from '../lib/address';
import { cardDigits } from '../lib/card';
import { ADDRESS_FIELD_IDS, CARD_FIELD_IDS, CONTACT_FIELD_ID } from '../lib/ids';
import { computeTotals } from '../lib/totals';
import { addressErrors, cardErrors, cardNumberBlurError, contactError, expiryBlurError, postalBlurError } from '../lib/validate';
import type { Address, CardValue, CheckoutApi, Country, Discount, Order, PaymentMethod, PickupLocation } from '../types';
import { useShippingRates, type ShippingRates } from './useShippingRates';

export type AddressErrors = Partial<Record<keyof Address, string>>;
export type CardErrors = Partial<Record<keyof CardValue, string>>;
export type CheckoutErrors = { contact?: string; shipping: AddressErrors; billing: AddressErrors; card: CardErrors };

export type SubmitResult =
  /** Fields failed validation. `firstInvalid` is the DOM id of the first one, to focus. */
  | { status: 'invalid'; firstInvalid: string }
  /** The address cannot be shipped to, or rates did not load. */
  | { status: 'no-rates' }
  /** `placeOrder` rejected. `paymentFailed` is now true. */
  | { status: 'failed' }
  | { status: 'placed'; order: Order; confirmation: string };

export type UseCheckoutOptions = {
  api: CheckoutApi;
  /** Sum of the cart lines, before discount and shipping. */
  subtotal: number;
  countries?: Country[];
  defaultCountry?: string;
  pickupLocations?: PickupLocation[];
  paymentMethods?: PaymentMethod[];
  labels?: Partial<Labels>;
};

const DEFAULT_METHODS: PaymentMethod[] = [{ id: 'card', title: 'Credit card', kind: 'card' }];
const NO_ERRORS: CheckoutErrors = { shipping: {}, billing: {}, card: {} };

/**
 * The checkout's state and rules with no interface attached: what was typed, which errors show,
 * shipping rates, discount, totals, validation and placing the order. `Checkout` is built on it,
 * and a custom layout can be too.
 */
export function useCheckout({ api, subtotal, countries = COUNTRIES, defaultCountry, pickupLocations = [], paymentMethods = DEFAULT_METHODS, labels: labelOverrides }: UseCheckoutOptions) {
  const labels = useMemo(() => ({ ...defaultLabels, ...labelOverrides }), [labelOverrides]);
  const firstCountry = defaultCountry ?? countries[0].code;

  const [contact, setContactValue] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [delivery, setDelivery] = useState<'ship' | 'pickup'>('ship');
  const [shipping, setShippingValue] = useState<Address>(() => emptyAddress(firstCountry));
  const [billing, setBillingValue] = useState<Address>(() => emptyAddress(firstCountry));
  const [saveInfo, setSaveInfo] = useState(false);
  const [pickup, setPickup] = useState(pickupLocations[0]?.id ?? '');
  const [payment, setPaymentValue] = useState(paymentMethods[0].id);
  const [card, setCardValue] = useState<CardValue>({ number: '', expiry: '', cvc: '', name: '' });
  const [nameEdited, setNameEdited] = useState(false);
  const [billingSame, setBillingSame] = useState(true);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>(NO_ERRORS);
  const [busy, setBusy] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const shippingCountry = findCountry(countries, shipping.country);
  const billingCountry = findCountry(countries, billing.country);
  const rates = useShippingRates({ address: shipping, country: shippingCountry, load: api.shippingRates });

  const method = paymentMethods.find(item => item.id === payment) ?? paymentMethods[0];
  const isPickup = delivery === 'pickup';
  const isCard = method.kind === 'card';
  /** A separate billing address is collected: card payment, and either pick-up or the box unticked. */
  const needsBilling = isCard && (isPickup || !billingSame);

  // ---- Field changes. Typing in a field clears its error. ----
  const setContact = useCallback((value: string) => {
    setContactValue(value);
    setErrors(current => (current.contact ? { ...current, contact: undefined } : current));
  }, []);

  const changeAddress = (which: 'shipping' | 'billing') => (next: Address, field: keyof Address) => {
    (which === 'shipping' ? setShippingValue : setBillingValue)(next);
    setErrors(current => {
      const group = { ...current[which], [field]: undefined };
      if (field === 'country') { group.region = undefined; group.postal = undefined; }
      return { ...current, [which]: group };
    });
    // "Name on card" follows the shipping name until it is edited by hand.
    if (which === 'shipping' && (field === 'firstName' || field === 'lastName') && !nameEdited) {
      setCardValue(current => ({ ...current, name: [next.firstName.trim(), next.lastName.trim()].filter(Boolean).join(' ') }));
    }
  };
  const setShipping = changeAddress('shipping');
  const setBilling = changeAddress('billing');

  /** Fills the shipping address from a chosen suggestion and loads rates at once. */
  const fillShipping = (next: Address) => {
    rates.expedite();
    setShippingValue(next);
    setErrors(current => ({ ...current, shipping: { ...current.shipping, line1: undefined, city: undefined, region: undefined, postal: undefined } }));
  };

  const setCard = (next: CardValue, field: keyof CardValue) => {
    setCardValue(next);
    if (field === 'name') setNameEdited(true);
    setErrors(current => ({ ...current, card: { ...current.card, [field]: undefined } }));
  };

  const setPayment = (id: string) => {
    setPaymentValue(id);
    setPaymentFailed(false);
  };

  // ---- Checks that run when a field loses focus. ----
  const blurContact = () => {
    const message = contactError(contact, false, labels);
    if (message) setErrors(current => ({ ...current, contact: message }));
    return !message;
  };
  const blurPostal = (which: 'shipping' | 'billing') => {
    const message = postalBlurError(which === 'shipping' ? shipping.postal : billing.postal, which === 'shipping' ? shippingCountry : billingCountry, labels);
    if (message) setErrors(current => ({ ...current, [which]: { ...current[which], postal: message } }));
  };
  const blurCard = (field: keyof CardValue) => {
    const message = field === 'number' ? cardNumberBlurError(card.number, labels) : field === 'expiry' ? expiryBlurError(card.expiry, labels) : null;
    if (message) setErrors(current => ({ ...current, card: { ...current.card, [field]: message } }));
  };

  // ---- Discount ----
  /** Applies a code. Rejects with the Error from `api.applyDiscount`, whose message belongs under the field. */
  const applyDiscount = async (code: string) => {
    setDiscount(await api.applyDiscount(code.trim().toUpperCase()));
  };
  const removeDiscount = () => setDiscount(null);

  // ---- Totals. While rates reload, the last shipping price stays so the total does not jump. ----
  const rate = rates.rates.find(item => item.id === rates.selected) ?? null;
  const [keptShipping, setKeptShipping] = useState<number | null>(null);
  let shippingAmount: number | null;
  if (isPickup) shippingAmount = 0;
  else if (rates.status === 'ready' && rate) shippingAmount = rate.price;
  else if (rates.status === 'loading') shippingAmount = keptShipping;
  else shippingAmount = null;
  if (rates.status !== 'loading' && shippingAmount !== keptShipping) setKeptShipping(shippingAmount);
  const totals = computeTotals({ subtotal, discount: discount?.amount ?? 0, shipping: shippingAmount });
  /** What the summary's shipping row shows. */
  const shippingDisplay: 'pending' | 'loading' | 'free' | 'amount' = isPickup
    ? 'free'
    : rates.status === 'loading'
      ? 'loading'
      : rates.status === 'ready' && rate
        ? rate.price ? 'amount' : 'free'
        : 'pending';

  // ---- Submit ----
  const validate = (): { errors: CheckoutErrors; invalid: string[] } => {
    const next: CheckoutErrors = { shipping: {}, billing: {}, card: {} };
    const invalid: string[] = [];
    const contactMessage = contactError(contact, true, labels);
    if (contactMessage) { next.contact = contactMessage; invalid.push(CONTACT_FIELD_ID); }
    if (!isPickup) {
      next.shipping = addressErrors(shipping, shippingCountry, labels);
      for (const field of Object.keys(next.shipping) as (keyof Address)[]) invalid.push(ADDRESS_FIELD_IDS[field]);
    }
    if (isCard) {
      next.card = cardErrors(card, labels);
      for (const field of Object.keys(next.card) as (keyof CardValue)[]) invalid.push(CARD_FIELD_IDS[field]);
      if (needsBilling) {
        next.billing = addressErrors(billing, billingCountry, labels);
        for (const field of Object.keys(next.billing) as (keyof Address)[]) invalid.push('b-' + ADDRESS_FIELD_IDS[field]);
      }
    }
    return { errors: next, invalid };
  };

  /** Everything collected, in the shape handed to `api.placeOrder`. */
  const buildOrder = (shippingRate: string | null = rates.selected): Order => ({
    contact: contact.trim(),
    marketing,
    delivery,
    shippingAddress: isPickup ? null : shipping,
    shippingRate: isPickup ? null : shippingRate,
    pickupLocation: isPickup ? (pickupLocations.find(location => location.id === pickup)?.name ?? null) : null,
    billingAddress: needsBilling ? billing : null,
    saveInfo,
    discountCode: discount?.code ?? null,
    payment: { method: method.id, last4: isCard ? cardDigits(card.number).slice(-4) : null },
  });

  /** Validates, waits for shipping rates if they are still loading, then places the order. */
  const submit = async (): Promise<SubmitResult> => {
    const checked = validate();
    setErrors(checked.errors);
    if (checked.invalid.length) return { status: 'invalid', firstInvalid: checked.invalid[0] };
    setBusy(true);
    setPaymentFailed(false);
    // The rate comes from `settle`, because it may have been chosen after this function started.
    let shippingRate: string | null = null;
    if (!isPickup) {
      const settled = await rates.settle();
      if (settled.status !== 'ready') {
        setBusy(false);
        return { status: 'no-rates' };
      }
      shippingRate = settled.selected;
    }
    const order = buildOrder(shippingRate);
    try {
      const { confirmation } = await api.placeOrder(order);
      return { status: 'placed', order, confirmation }; // stays busy: the thank-you page takes over
    } catch {
      setBusy(false);
      setPaymentFailed(true);
      return { status: 'failed' };
    }
  };

  return {
    labels, countries, pickupLocations, paymentMethods,
    contact, setContact, blurContact,
    marketing, setMarketing,
    delivery, setDelivery, isPickup,
    shipping, setShipping, fillShipping, shippingCountry,
    billing, setBilling, billingCountry, billingSame, setBillingSame, needsBilling,
    blurPostal,
    saveInfo, setSaveInfo,
    pickup, setPickup,
    payment, setPayment, method, isCard,
    card, setCard, blurCard,
    discount, applyDiscount, removeDiscount,
    rates: rates as ShippingRates, rate,
    totals, shippingDisplay,
    errors, busy, paymentFailed,
    buildOrder, submit,
    /** Display lines for the thank-you page. */
    shippingLines: addressLines(shipping, shippingCountry),
    billingLines: addressLines(billing, billingCountry),
  };
}

export type CheckoutState = ReturnType<typeof useCheckout>;
