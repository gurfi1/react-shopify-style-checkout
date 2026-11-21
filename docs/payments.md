# Payments

This project is the interface of a checkout. It does not take payments. This page explains what is a placeholder and how to put a real payment provider behind it.

**On this page:** [What is a placeholder](#what-is-a-placeholder) · [Card payments](#card-payments) · [Express buttons](#express-buttons) · [Other payment methods](#other-payment-methods) · [The logos](#the-logos)

## What is a placeholder

| Piece | In this repo | On a real site |
|---|---|---|
| Card number, expiry, security code | Plain inputs that format what is typed | Your payment provider's hosted fields |
| Express checkout buttons | Buttons with a wallet's logo that do nothing | Buttons rendered by each provider's own script |
| "Digital wallet", "Cash on Delivery" | Example methods that show a note | Whatever methods you actually offer |
| Declining a card ending `0002` | A rule in `demo/fakeApi.ts` | Your provider's response |

**Do not put real card numbers through the placeholder inputs.** A card number typed into an ordinary input on your page passes through your code, which makes your whole site subject to card-industry (PCI DSS) rules that hosted fields exist to avoid.

## Card payments

Every card provider (Stripe, Adyen, Braintree, PayPlus and others) offers hosted fields: small frames, served by the provider, that you place inside your form. The card number is typed into the provider's frame and never touches your page.

To use them here:

1. Keep [`CardFields`](../src/checkout/CardFields)' layout, or copy it into a component of your own.
2. Replace the number, expiry and security code `TextField`s with the provider's mount points, each inside a [`Field`](../src/primitives/Field) so it keeps the border, focus ring and error styling.
3. In your `placeOrder`, ask the provider's script for a token (or to confirm the payment), then send that token to your server with the order.
4. Reject from `placeOrder` if the provider declines. The payment banner opens.

`Field` is the bordered box on its own:

```tsx
<Field error={cardError}>
  <div id="card-number" />   {/* the provider mounts its frame here */}
</Field>
```

Most providers let you set the font, size and colour inside their frame. The values to match are 14px (16px on touch devices), the system font, and `#000` text with `#707070` placeholders.

## Express buttons

[`ExpressCheckout`](../src/checkout/ExpressCheckout) lays out a row of wallet buttons and handles the grey loading state. Each button can show any content:

```tsx
<ExpressCheckout
  loading={!walletsReady}
  buttons={[
    { id: 'paypal', label: 'PayPal', content: <PayPalLogo />, background: '#ffc439', onClick: startPayPal },
    { id: 'google-pay', label: 'Google Pay', content: <GooglePayLogo />, background: '#000', onClick: startGooglePay },
  ]}
/>
```

Wallet providers usually require that you show *their* button, rendered by *their* script, and their brand rules say how. Where that applies, render the provider's button in place of this row and keep `ExpressCheckout` only for its heading and the "OR" line (pass an empty `buttons` list, or build the row yourself).

Leave the `expressButtons` prop off `Checkout` and the whole row disappears.

## Other payment methods

`paymentMethods` on `Checkout` is a list. Each entry has a `kind`:

| `kind` | Opens under the row | Pay button reads |
|---|---|---|
| `card` | The card fields and the billing address | "Pay now" |
| `redirect` | An illustration and your `note`, for methods finished on another site | "Pay now" |
| `manual` | Your `note`, for methods paid later, such as cash on delivery | "Complete order" |

The order tells you which was chosen in `order.payment.method`.

## The logos

The card logos and the two wallet logos in the demo are other companies' trademarks, included as the standard marks a checkout shows. [NOTICE.md](../NOTICE.md) lists where each file came from and under what licence. For your own site, follow each brand's rules, and prefer the artwork your payment provider gives you.
