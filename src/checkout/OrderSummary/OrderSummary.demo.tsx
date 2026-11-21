import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Surface } from '../../theme/Theme';
import type { Discount } from '../../types';
import { DEMO_ITEMS } from '../demoData';
import { OrderSummary, OrderSummaryToggle } from './OrderSummary';

const demo: Demo = {
  title: 'OrderSummary, OrderSummaryToggle',
  group: 'Checkout blocks',
  order: 10,
  summary: 'The grey column’s content: products, the discount field and the totals. Without `onApplyDiscount` it is read-only, which is how the checkout repeats it above the pay button on small screens. `OrderSummaryToggle` is the bar that stands in for it below 1000px. Try code `WELCOME10`.',
  usage: `<Surface>
  <OrderSummary
    items={items}
    subtotal={120}
    discount={discount}
    shipping="amount"
    shippingAmount={6.9}
    total={total}
    onApplyDiscount={applyDiscount}
    onRemoveDiscount={removeDiscount}
  />
</Surface>

<OrderSummaryToggle open={open} onToggle={toggle} total="$126.90" />`,
  props: [
    ['items', 'LineItemData[]', '{ id, title, variant?, quantity, price, image? }. Price is the line total.'],
    ['subtotal, total', 'number', 'Computed by you, ideally by your server.'],
    ['discount', 'Discount | null', '{ code, amount }. Opens the discount row and the savings line.'],
    ['shipping', "'pending' | 'loading' | 'free' | 'amount'", 'What the shipping row shows.'],
    ['shippingAmount, shippingLabel', 'number, string', 'The price, and the row’s label.'],
    ['onApplyDiscount', '(code) => Promise<void>', 'Shows the code field. Reject with an Error to show its message.'],
    ['onRemoveDiscount', '() => void', 'The tag’s remove button.'],
    ['discountOpen', 'boolean', 'False folds the code field away.'],
    ['OrderSummaryToggle open, onToggle, total', 'boolean, () => void, string', 'The small-screen bar.'],
  ],
  Example: () => {
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [open, setOpen] = useState(false);
    const apply = (code: string) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          if (code !== 'WELCOME10') return reject(new Error('Enter a valid discount code or gift card'));
          setDiscount({ code, amount: 12 });
          resolve();
        }, 700),
      );
    return (
      <States>
        <State label="On a grey Surface, with the discount field" width={440}>
          <Surface style={{ padding: 24, borderRadius: 12 }}>
            <OrderSummary items={DEMO_ITEMS} subtotal={120} discount={discount} shipping="amount" shippingAmount={6.9} total={126.9 - (discount?.amount ?? 0)} onApplyDiscount={apply} onRemoveDiscount={() => setDiscount(null)} />
          </Surface>
        </State>
        <State label="The small-screen bar" width={390}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <OrderSummaryToggle open={open} onToggle={() => setOpen(value => !value)} total="$126.90" />
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
