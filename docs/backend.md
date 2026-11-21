# Connecting a back end

The checkout talks to your server through four functions that you supply. This page gives the exact shape of each, and of the order it hands you.

**On this page:** [The four calls](#the-four-calls) · [Shapes](#shapes) · [The order](#the-order) · [What the interface does while it waits](#what-the-interface-does-while-it-waits) · [What your server should own](#what-your-server-should-own) · [Known limit: field errors from the server](#known-limit-field-errors-from-the-server)

## The four calls

You pass them as one object, the `api` prop of `Checkout` (or the `api` option of `useCheckout`). All four are required, so the code does not compile if one is missing. The types are in [`src/types.ts`](../src/types.ts).

| Call | When it runs | Receives | Resolve to | To signal failure |
|---|---|---|---|---|
| `suggestAddresses` | 3 or more characters typed in the address line | `query: string`, `country: string` (the country code) | Up to 5 `AddressSuggestion` | Resolve to `[]`; the list closes |
| `shippingRates` | The address is complete, 500ms after it stops changing | `address: Address` | `ShippingRate[]` | Resolve to `[]`: "cannot ship there". A rejection is treated the same |
| `applyDiscount` | Apply is pressed | `code: string`, trimmed and upper-cased | `Discount` | Reject with an `Error`; its `message` shows under the field |
| `placeOrder` | Pay is pressed and the form is valid | `order: Order` | `{ confirmation: string }` | Reject; the payment banner opens |

If you have no address lookup, return `[]` from `suggestAddresses`.

[`demo/fakeApi.ts`](../demo/fakeApi.ts) implements all four on canned data and is a good file to copy and edit.

## Shapes

```ts
type Address = {
  country: string;    // country code, "US"
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  region: string;     // state or province code, "CA"; '' where the country has none
  postal: string;
};

type AddressSuggestion = { line1: string; city: string; region: string; postal: string };

type ShippingRate = { id: string; name: string; eta: string; price: number };   // price 0 shows as "FREE"

type Discount = { code: string; amount: number };   // amount taken off, as a positive number
```

Money is a plain decimal number in the currency you set on `Checkout`. It is formatted for display with `Intl.NumberFormat`.

## The order

`placeOrder` receives everything the form collected:

```ts
type Order = {
  contact: string;                  // email or phone, as typed
  marketing: boolean;               // "Email me with news and offers"
  delivery: 'ship' | 'pickup';
  shippingAddress: Address | null;  // null for pick-up
  shippingRate: string | null;      // the chosen rate's id; null for pick-up
  pickupLocation: string | null;    // the chosen location's name; null when shipping
  billingAddress: Address | null;   // null means "same as shipping", or not needed
  saveInfo: boolean;                // "Save this information for next time"
  discountCode: string | null;
  payment: { method: string; last4: string | null };
};
```

Two things to notice:

- **There are no card details.** That is deliberate. With a real payment provider the card number never reaches your code; see [payments.md](payments.md). `last4` exists only so the demo can pretend to decline a card.
- **There are no prices.** The order names a rate and a discount code. Your server looks up what they cost.

## What the interface does while it waits

You do not need to build any of this; it is already there.

| Call pending | The interface shows |
|---|---|
| `suggestAddresses` | Nothing until it resolves. If the shopper types again first, the older answer is discarded |
| `shippingRates` | A skeleton in the shipping section and a grey pill in the summary. The last total stays put. A slow answer for an address that has since changed is ignored |
| `applyDiscount` | A spinner in the Apply button |
| `placeOrder` | A spinner in the pay button; the rest of the form cannot be used |

If Pay is pressed while rates are still loading, the order waits for them and then goes ahead with the first rate, so an order is never placed without a rate chosen for that exact address.

## What your server should own

The checkout computes a total for display (`subtotal − discount + shipping`). Treat that as a preview.

- **Totals.** Tax, rounding and currency rules belong on the server. Recompute everything from the cart, the rate id and the discount code when the order arrives.
- **Validation.** The form checks that fields are filled in and well-formed. It cannot know whether an address is deliverable or a code is still valid. Check again on the server.
- **Stock and prices.** The `items` you pass are shown as given.

## Known limit: field errors from the server

A rejected `placeOrder` always opens the payment banner. There is not yet a way to send back "the postal code is wrong" and have it appear under that field. If you need that today, validate the address in `shippingRates` (return `[]` for an address you cannot accept), which shows the "not available for this address" state in the shipping section.

This is the first thing on the list of improvements; a pull request is welcome.
