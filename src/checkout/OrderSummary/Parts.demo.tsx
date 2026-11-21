import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { SegmentedControl } from '../../primitives/SegmentedControl/SegmentedControl';
import { Surface } from '../../theme/Theme';
import { DEMO_ITEMS } from '../demoData';
import { DiscountField } from './DiscountField';
import { LineItem } from './LineItem';
import { Totals, type ShippingDisplay } from './Totals';

const demo: Demo = {
  title: 'LineItem, Totals, DiscountField',
  group: 'Checkout blocks',
  order: 11,
  summary: 'The order summary’s three parts, each usable alone. `Totals` covers the shipping row’s four displays, and its discount row and savings line open and close. `DiscountField` keeps Apply grey until something is typed and shows a spinner while the code is checked.',
  usage: `<LineItem title="Stoneware Mug" variant="Sage" quantity={2} price="$36.00" image={<img … />} />

<DiscountField onApply={applyDiscount} applied={discount?.code} onRemove={removeDiscount} />

<Totals subtotal={120} itemCount={3} discount={discount} shipping="loading" total={120} />`,
  props: [
    ['LineItem title, variant, quantity, price, image', 'ReactNode…', 'Price is already formatted.'],
    ['DiscountField onApply', '(code) => Promise<void>', 'Gets the code trimmed and upper-cased. Reject with an Error to show its message.'],
    ['DiscountField applied, onRemove', 'string | null, () => void', 'The applied code, shown as a tag.'],
    ['Totals subtotal, itemCount, total', 'number', 'The figures.'],
    ['Totals discount', 'Discount | null', 'Opens the discount row and the savings line.'],
    ['Totals shipping', "'pending' | 'loading' | 'free' | 'amount'", 'Grey prompt, skeleton pill, “FREE”, or the price.'],
  ],
  Example: () => {
    const [shipping, setShipping] = useState<ShippingDisplay>('pending');
    const [code, setCode] = useState<string | null>(null);
    const apply = (entered: string) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          if (entered !== 'WELCOME10') return reject(new Error('Enter a valid discount code or gift card'));
          setCode(entered);
          resolve();
        }, 700),
      );
    return (
      <States>
        <State label="LineItem" width={400}>
          <Surface style={{ padding: 24, borderRadius: 12 }}>
            <LineItem title={DEMO_ITEMS[1].title} variant={DEMO_ITEMS[1].variant} quantity={2} price="$36.00" image={DEMO_ITEMS[1].image} />
          </Surface>
        </State>
        <State label="DiscountField: try WELCOME10, or anything else" width={400}>
          <Surface style={{ padding: '4px 24px 24px', borderRadius: 12 }}>
            <DiscountField id="demo-discount" onApply={apply} applied={code} onRemove={() => setCode(null)} />
          </Surface>
        </State>
        <State label="Totals: switch the shipping display; apply the code above for the discount rows" width={400}>
          <SegmentedControl
            name="demo-totals-shipping"
            label="Shipping display"
            value={shipping}
            onChange={value => setShipping(value as ShippingDisplay)}
            options={[{ value: 'pending', label: 'Pending' }, { value: 'loading', label: 'Loading' }, { value: 'free', label: 'Free' }, { value: 'amount', label: 'Amount' }]}
          />
          <Surface style={{ marginTop: 12, padding: '4px 24px 24px', borderRadius: 12 }}>
            <Totals subtotal={120} itemCount={3} discount={code ? { code, amount: 12 } : null} shipping={shipping} shippingAmount={6.9} total={120 - (code ? 12 : 0) + (shipping === 'amount' ? 6.9 : 0)} />
          </Surface>
        </State>
      </States>
    );
  },
};

export default demo;
