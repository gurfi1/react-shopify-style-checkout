# Wording, language and currency

Every word the checkout shows comes from one object, and every price is formatted from a locale and a currency you set. This page shows how to change them.

**On this page:** [Change some wording](#change-some-wording) · [Translate everything](#translate-everything) · [Labels that take a value](#labels-that-take-a-value) · [Currency and number format](#currency-and-number-format) · [Country-specific wording](#country-specific-wording) · [Using blocks on their own](#using-blocks-on-their-own) · [Right-to-left languages](#right-to-left-languages)

## Change some wording

Pass only the labels you want to replace. The rest stay as they are.

```tsx
<Checkout
  labels={{
    payNow: 'Place order',
    marketing: 'Send me product news',
    paymentNote: 'Payments are handled by our payment provider.',
  }}
  …
/>
```

Define the object outside the component, or with `useMemo`, so it is not rebuilt on every render.

## Translate everything

The full list, with the English defaults, is [`src/labels.ts`](../src/labels.ts): about 90 labels in eight groups.

| Group | Examples |
|---|---|
| Header and layout | `checkout`, `backToCart`, `orderSummary`, `close` |
| Express checkout | `expressCheckout`, `or` |
| Contact | `contact`, `contactField`, `contactTooltip`, `marketing` |
| Delivery | `ship`, `pickUp`, `firstName`, `address`, `shippingMethod`, `shippingEmpty`, `free` |
| Payment | `payment`, `cardNumber`, `expiry`, `securityCode`, `billingAddress`, `payNow` |
| Order summary | `discountField`, `apply`, `subtotal`, `shipping`, `total`, `totalSavings` |
| Field errors | `errorEmail`, `errorLastName`, `errorPostalInvalid`, `errorCardInvalid` |
| Thank-you page | `thankYou`, `orderConfirmed`, `orderDetails`, `continueShopping` |

A translation is a file that exports a complete object:

```ts
import type { Labels } from './checkout-kit';

export const german: Partial<Labels> = {
  contact: 'Kontakt',
  delivery: 'Lieferung',
  payNow: 'Jetzt bezahlen',
  subtotal: items => `Zwischensumme · ${items} Artikel`,
  thankYou: firstName => (firstName ? `Danke, ${firstName}!` : 'Danke!'),
  // …
};
```

`Partial<Labels>` means TypeScript checks the names and shapes of what you provide and lets you leave the rest for later.

## Labels that take a value

Most labels are strings. A few are functions, because the sentence changes with a number or a name:

| Label | Receives | English result |
|---|---|---|
| `subtotal` | number of items | "Subtotal · 3 items" |
| `pickupCount` | number of locations | "There are 2 locations with stock close to you" |
| `thankYou` | first name, or `''` | "Thank you, Ada!" or "Thank you!" |
| `cardEnding` | brand, last four digits | "Visa ending with 4242" |
| `didYouMean` | the suggested address | `['Did you mean ', suggestion, '?']` |
| `errorRegion` | the region label | "Select a state" |
| `errorPostalRequired`, `errorPostalInvalid` | the postal label | "Enter a ZIP code" |

`didYouMean` returns three parts because the middle one is rendered as a link. Put your language's words before and after it.

## Currency and number format

```tsx
<Checkout locale="de-DE" currency="EUR" … />
```

- `locale` is a BCP 47 tag. It decides separators and where the symbol goes: `120,00 €` for `de-DE`, `€120.00` for `en-IE`.
- `currency` is an ISO 4217 code. It is also shown in small letters beside the total.

Formatting uses the browser's `Intl.NumberFormat`, so there are no currency tables in the code.

The checkout shows one currency. Converting between currencies is for your server.

## Country-specific wording

The labels on the region and postal fields ("State", "Province", "ZIP code", "Postcode") are not in `labels`. They belong to each country's entry in the `countries` list, because they change with the country the shopper picks:

```ts
import type { Country } from './checkout-kit';

const germany: Country = {
  code: 'DE',
  name: 'Deutschland',
  flag: '🇩🇪',
  postalLabel: 'Postleitzahl',
  postalPattern: /^\d{5}$/,
};

<Checkout countries={[germany]} defaultCountry="DE" … />
```

Add `regionLabel` and `regions` (a list of `[code, name]` pairs) for a country that has states or provinces. The four built-in countries are in [`src/lib/address.ts`](../src/lib/address.ts).

## Using blocks on their own

Blocks such as `AddressForm` and `OrderSummary` read wording and currency from the nearest `CheckoutProvider`. `Checkout` sets one up for you. When you use blocks by themselves, add it:

```tsx
<Theme>
  <CheckoutProvider labels={german} locale="de-DE" currency="EUR">
    <OrderSummary … />
  </CheckoutProvider>
</Theme>
```

Without a provider, blocks use English and US dollars. Building blocks such as `TextField` and `Button` have no built-in wording at all; you pass their text as props.

## Right-to-left languages

The stylesheets use logical properties (`inset-inline-start`, `margin-inline-end`, `text-align: start`) throughout, and the segmented control's pill reverses under `dir="rtl"`. **This has not been tested.** If you try it with Hebrew or Arabic, an issue describing what you find would be very welcome.
