# Getting started

How to run the project, and the three ways to put it into your own app.

**On this page:** [Run it](#run-it) · [What your app needs](#what-your-app-needs) · [Three ways to adopt it](#three-ways-to-adopt-it) · [Your first checkout](#your-first-checkout) · [Your first single component](#your-first-single-component) · [Where to go next](#where-to-go-next)

## Run it

```bash
git clone https://github.com/gurfi1/react-shopify-style-checkout.git
cd react-shopify-style-checkout
npm install
npm run dev
```

Open the address Vite prints. You get:

- **`/`** The full checkout on canned data. Discount code `WELCOME10` works; a card number ending in `0002` is declined; anything else goes through.
- **Browse components** (bottom-left of the checkout) The galleries: foundations, building blocks, checkout blocks and recipes.

Nothing you type is sent anywhere. The demo's "back end" is [`demo/fakeApi.ts`](../demo/fakeApi.ts), a file of canned answers that runs in the browser.

Other commands:

| Command | What it does |
|---|---|
| `npm test` | Unit tests for the logic in `src/lib` |
| `npm run typecheck` | TypeScript, no output files |
| `npm run lint` | oxlint |
| `npm run build` | Type-check, then a production build of the demo site |
| `npm run docs` | Regenerate the README beside each component |

## What your app needs

| Requirement | Why |
|---|---|
| React 19 | Components take `ref` as a normal prop and use the `inert` attribute |
| A bundler that handles CSS Modules | Every component's styles are in a `*.module.css` file beside it. Vite and Next.js do this out of the box |
| SVG imports as URLs | Only for the card logos in `CardFields`. Vite does this out of the box. In Next.js an SVG import is an object, so read `.src` from it |
| TypeScript support | The source is `.ts` and `.tsx`. Your app does not have to be written in TypeScript, but its bundler has to compile it (Vite and Next.js do) |

There are no other runtime dependencies: no UI kit, no animation library, no CSS framework.

## Three ways to adopt it

There is no npm package yet. You take the source.

| You want | Do this |
|---|---|
| **The whole checkout** | Copy the `src/` folder into your app, for example as `src/checkout-kit/`. Import `Checkout` from its `index.ts` |
| **One component or block** | Open its folder's README. The **Files** section lists the folder to copy and every other folder it needs. Copy those, plus `src/theme` |
| **A new project built on it** | Click **Use this template** on GitHub, then replace `demo/` with your app |

In the examples below, `./checkout-kit` stands for wherever you put the copied `src/` folder.

## Your first checkout

```tsx
import { Checkout, type CheckoutApi, type LineItemData } from './checkout-kit';

const api: CheckoutApi = {
  suggestAddresses: async (query, country) => [],                      // no suggestions yet
  shippingRates: async address => fetch('/api/shipping-rates', { method: 'POST', body: JSON.stringify(address) }).then(r => r.json()),
  applyDiscount: async code => fetch('/api/discounts/' + code).then(r => (r.ok ? r.json() : Promise.reject(new Error('Enter a valid discount code')))),
  placeOrder: async order => fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) }).then(r => (r.ok ? r.json() : Promise.reject(new Error('Payment failed')))),
};

export function CheckoutPage({ cart }: { cart?: { lines: LineItemData[] } }) {
  return <Checkout api={api} items={cart?.lines ?? []} storeName="Northfield" loading={!cart} />;
}
```

`Checkout` brings its own `Theme` and fills the page. Give it a route of its own.

[backend.md](backend.md) has the exact shape each call receives and returns.

## Your first single component

Every component needs a `Theme` somewhere above it. That is the only setup.

```tsx
import { useState } from 'react';
import { TextField, Theme } from './checkout-kit';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  return (
    <Theme accent="#0a7c59">
      <TextField label="Email" value={email} onChange={event => setEmail(event.target.value)} />
    </Theme>
  );
}
```

Class names are scoped per component by CSS Modules, and `Theme` styles only what is inside it, so this is safe on a page that already uses Tailwind, Bootstrap or your own CSS.

## Where to go next

| To | Read |
|---|---|
| Connect a real back end | [backend.md](backend.md) |
| Take real payments | [payments.md](payments.md) |
| Change colours, corners or timings | [theming.md](theming.md) |
| Translate it or change the currency | [wording-and-locale.md](wording-and-locale.md) |
| Understand the measurements and motion | [design-spec.md](design-spec.md) |
| See what was tested for accessibility | [accessibility.md](accessibility.md) |
| Use it in a Laravel app | [laravel.md](laravel.md) |
