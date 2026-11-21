import type { ExpressButton, LineItemData, PaymentMethod, PickupLocation, Policy } from '../src';
import { GooglePayMark, PayPalMark } from './walletMarks';

/** Everything store-specific in the demo. A real shop renders these from its own data. */
export const STORE_NAME = 'Northfield';

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

export const ITEMS: LineItemData[] = [
  { id: 'tote', title: 'Waxed Canvas Tote', variant: 'Tan / Large', quantity: 1, price: 84, image: <Tote /> },
  { id: 'mug', title: 'Stoneware Mug', variant: 'Sage', quantity: 2, price: 36, image: <Mug /> },
];

export const EXPRESS_BUTTONS: ExpressButton[] = [
  { id: 'paypal', label: 'PayPal', content: <PayPalMark />, background: '#ffc439' },
  { id: 'google-pay', label: 'Google Pay', content: <GooglePayMark />, background: '#000' },
];

export const PICKUP_LOCATIONS: PickupLocation[] = [
  { id: 'flagship', name: 'Northfield Flagship', address: '118 Alder St, Portland OR', ready: 'Usually ready in 24 hours', distance: '1.2 mi' },
  { id: 'eastside', name: 'Northfield Eastside', address: '2040 Hawthorne Blvd, Portland OR', ready: 'Usually ready in 2 to 4 days', distance: '3.8 mi' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', title: 'Credit card', kind: 'card' },
  { id: 'wallet', title: 'Digital wallet', kind: 'redirect', note: 'When you click “Pay now” you’ll be taken to your wallet to finish paying securely.' },
  { id: 'cod', title: 'Cash on Delivery (COD)', kind: 'manual', note: 'Pay with cash when your order is delivered. Please have the exact amount ready.' },
];

export const POLICIES: Policy[] = [
  {
    id: 'refund', label: 'Refund policy',
    content: (
      <>
        <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>
        <p>To be eligible, your item must be in the same condition that you received it, unused, and in its original packaging.</p>
        <p>Once we receive and inspect your return, approved refunds go back to your original payment method within 10 business days.</p>
      </>
    ),
  },
  {
    id: 'shipping', label: 'Shipping',
    content: (
      <>
        <p>Orders are processed within 1 to 2 business days. You will receive a notification with tracking details once your order ships.</p>
        <p>Delivery estimates shown at checkout begin from the date of shipment, not the date of order.</p>
      </>
    ),
  },
  {
    id: 'privacy', label: 'Privacy policy',
    content: (
      <>
        <p>We collect the information you give us at checkout so we can fulfil your order, keep you updated about it and comply with legal obligations.</p>
        <p>We do not sell your personal information. You can ask us for a copy of your data, or for it to be deleted, at any time.</p>
      </>
    ),
  },
  {
    id: 'terms', label: 'Terms of service',
    content: (
      <>
        <p>By placing an order you agree to these terms. Prices and availability can change without notice until your order is confirmed.</p>
        <p>We may refuse or cancel an order if a product is mispriced or out of stock; in that case you are refunded in full.</p>
      </>
    ),
  },
  {
    id: 'contact', label: 'Contact',
    content: (
      <>
        <p>Northfield Goods<br />118 Alder St, Portland OR 97204<br />hello@northfield.example</p>
        <p>We reply to messages within one business day.</p>
      </>
    ),
  },
];
