# Using it in a Laravel app

Two ways to put the checkout into a Laravel site, and how to talk to Laravel routes from it.

> **Untested.** This page describes the approach. Nobody has yet run this exact code against a Laravel app. Treat the snippets as a starting point, and please open an issue or a pull request with corrections once you have.

**On this page:** [Which setup](#which-setup) · [With Inertia and React](#with-inertia-and-react) · [Inside a Blade page](#inside-a-blade-page) · [The `api` object for Laravel](#the-api-object-for-laravel) · [Routes](#routes) · [Things to handle on the server](#things-to-handle-on-the-server)

## Which setup

| Your app | Use |
|---|---|
| Already uses Inertia with React | [With Inertia and React](#with-inertia-and-react) |
| Renders Blade views (with or without Livewire) | [Inside a Blade page](#inside-a-blade-page) |

Either way, copy this repository's `src/` folder to `resources/js/checkout-kit/`. Laravel's Vite setup already compiles TypeScript, CSS Modules and SVG imports once the React plugin is installed.

## With Inertia and React

The checkout is one page component.

```tsx
// resources/js/Pages/Checkout.tsx
import { router } from '@inertiajs/react';
import { Checkout, type LineItemData } from '../checkout-kit';
import { api } from '../checkout-api';

type Props = { cart: { lines: LineItemData[] }; store: { name: string; currency: string } };

export default function CheckoutPage({ cart, store }: Props) {
  return (
    <Checkout
      api={api}
      items={cart.lines}
      storeName={store.name}
      currency={store.currency}
      cartHref="/cart"
      onContinueShopping={() => router.visit('/')}
    />
  );
}
```

Do not wrap this page in your app's shared layout. `Checkout` draws its own header and fills the window.

## Inside a Blade page

Mount React into one element of an otherwise ordinary view.

```bash
npm install react react-dom
npm install --save-dev @vitejs/plugin-react
```

Add `react()` to the plugins in `vite.config.js`, and the entry file to the `input` list of the Laravel plugin.

```blade
{{-- resources/views/checkout.blade.php --}}
<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Checkout</title>
  @viteReactRefresh
  @vite('resources/js/checkout.tsx')
</head>
<body style="margin: 0">
  <div id="checkout" data-cart='@json($cart)' data-store='@json($store)'></div>
</body>
</html>
```

```tsx
// resources/js/checkout.tsx
import { createRoot } from 'react-dom/client';
import { Checkout } from './checkout-kit';
import { api } from './checkout-api';

const element = document.getElementById('checkout')!;
const cart = JSON.parse(element.dataset.cart!);
const store = JSON.parse(element.dataset.store!);

createRoot(element).render(
  <Checkout api={api} items={cart.lines} storeName={store.name} currency={store.currency} cartHref="/cart" />,
);
```

Give the view a layout of its own, with no site header or footer around it.

## The `api` object for Laravel

Laravel rejects POST requests that lack its CSRF token, and answers JSON only when asked for it. One helper covers both.

```ts
// resources/js/checkout-api.ts
import type { CheckoutApi } from './checkout-kit';

const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': token },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? 'Something went wrong');
  return data as T;
}

export const api: CheckoutApi = {
  suggestAddresses: (query, country) => post('/checkout/addresses', { query, country }),
  shippingRates: address => post('/checkout/shipping-rates', { address }),
  applyDiscount: code => post('/checkout/discount', { code }),
  placeOrder: order => post('/checkout/orders', order),
};
```

With Inertia, the `csrf-token` meta tag is usually already in `app.blade.php`. If it is not, add it.

`applyDiscount` relies on the thrown error's message: return a 422 with a `message` and that text appears under the discount field.

## Routes

```php
// routes/web.php
Route::get('/checkout', [CheckoutController::class, 'show']);
Route::post('/checkout/addresses', [CheckoutController::class, 'addresses']);
Route::post('/checkout/shipping-rates', [CheckoutController::class, 'shippingRates']);
Route::post('/checkout/discount', [CheckoutController::class, 'discount']);
Route::post('/checkout/orders', [CheckoutController::class, 'store']);
```

What each should return is in [backend.md](backend.md). In short:

| Route | Returns |
|---|---|
| `addresses` | A JSON array of up to five `{ line1, city, region, postal }`, or `[]` |
| `shipping-rates` | A JSON array of `{ id, name, eta, price }`, or `[]` if you cannot ship there |
| `discount` | `{ code, amount }`, or a 422 with a `message` |
| `orders` | `{ confirmation }`, or an error status if the payment fails |

The cart lines you pass as `items` need `id`, `title`, `quantity` and `price` (the line's total as a number), and optionally `variant`. For a picture, map each line to add `image: <img src={line.image_url} alt="" />`.

## Things to handle on the server

- **Recompute the total.** The order names a shipping rate and a discount code, not prices. Work out the amount from the cart in the session.
- **Validate again.** Use a form request for the order. Note the [known limit](backend.md#known-limit-field-errors-from-the-server): its per-field messages are not shown under fields yet.
- **Take the payment with your provider.** The card inputs here are placeholders. See [payments.md](payments.md) before going live.
- **Wording and currency.** Pass `labels`, `locale` and `currency` from your app's settings; see [wording-and-locale.md](wording-and-locale.md).
