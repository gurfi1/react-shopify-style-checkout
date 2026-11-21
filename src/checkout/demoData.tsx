import type { AddressSuggestion, LineItemData, PaymentMethod, PickupLocation, ShippingRate } from '../types';

/** Canned data shared by the checkout blocks' demo files. Not part of the components. */

const STREETS: [string, string, string, string][] = [
  ['Market St', 'San Francisco', 'CA', '94103'],
  ['Main St', 'Portland', 'OR', '97204'],
  ['Broadway', 'New York', 'NY', '10012'],
  ['Pike St', 'Seattle', 'WA', '98101'],
];

/** Answers after a moment, like a lookup service. Any text gets suggestions. */
export const demoSuggest = (query: string): Promise<AddressSuggestion[]> =>
  new Promise(resolve =>
    setTimeout(() => {
      const number = query.match(/^\d+/)?.[0] ?? '12';
      resolve(STREETS.map(([street, city, region, postal]) => ({ line1: `${number} ${street}`, city, region, postal })));
    }, 120),
  );

export const DEMO_RATES: ShippingRate[] = [
  { id: 'economy', name: 'Economy', eta: '5 to 8 business days', price: 0 },
  { id: 'standard', name: 'Standard', eta: '3 to 4 business days', price: 6.9 },
  { id: 'express', name: 'Express', eta: '1 to 2 business days', price: 14.9 },
];

export const DEMO_LOCATIONS: PickupLocation[] = [
  { id: 'flagship', name: 'Northfield Flagship', address: '118 Alder St, Portland OR', ready: 'Usually ready in 24 hours', distance: '1.2 mi' },
  { id: 'eastside', name: 'Northfield Eastside', address: '2040 Hawthorne Blvd, Portland OR', ready: 'Usually ready in 2 to 4 days', distance: '3.8 mi' },
];

export const DEMO_METHODS: PaymentMethod[] = [
  { id: 'card', title: 'Credit card', kind: 'card' },
  { id: 'wallet', title: 'Digital wallet', kind: 'redirect', note: 'When you click “Pay now” you’ll be taken to your wallet to finish paying securely.' },
  { id: 'cod', title: 'Cash on Delivery (COD)', kind: 'manual', note: 'Pay with cash when your order is delivered. Please have the exact amount ready.' },
];

const Tote = () => (
  <svg viewBox="0 0 64 64" aria-hidden>
    <rect width="64" height="64" fill="#ededed" />
    <path d="M22 27c0-9 4.5-14 10-14s10 5 10 14" fill="none" stroke="#8a6a47" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M15 26h34l3.5 25a3 3 0 0 1-3 3.4H14.5a3 3 0 0 1-3-3.4L15 26Z" fill="#c9a779" />
    <path d="M15 26h34l.9 6H14.1l.9-6Z" fill="#b8956a" />
  </svg>
);
const Mug = () => (
  <svg viewBox="0 0 64 64" aria-hidden>
    <rect width="64" height="64" fill="#ededed" />
    <path d="M44 28h4.5a6.5 6.5 0 0 1 0 13H44" fill="none" stroke="#7f9a86" strokeWidth="3.4" />
    <path d="M17 21h28v22a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V21Z" fill="#9db5a2" />
    <ellipse cx="31" cy="21" rx="14" ry="3.4" fill="#86a08c" />
  </svg>
);

export const DEMO_ITEMS: LineItemData[] = [
  { id: 'tote', title: 'Waxed Canvas Tote', variant: 'Tan / Large', quantity: 1, price: 84, image: <Tote /> },
  { id: 'mug', title: 'Stoneware Mug', variant: 'Sage', quantity: 2, price: 36, image: <Mug /> },
];
