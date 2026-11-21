import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import type { RatesStatus } from '../../hooks/useShippingRates';
import { SegmentedControl } from '../../primitives/SegmentedControl/SegmentedControl';
import { DEMO_RATES } from '../demoData';
import { ShippingMethods } from './ShippingMethods';

const demo: Demo = {
  title: 'ShippingMethods',
  group: 'Checkout blocks',
  order: 6,
  summary: 'The shipping method block in its four states: a grey box asking for the address, a skeleton while rates load, a grey box when the address cannot be shipped to, and the list of rates. Each change fades in and the height follows. Pair it with `useShippingRates`, which supplies `status` and `rates`.',
  usage: `const shipping = useShippingRates({ address, country, load: api.shippingRates });

<ShippingMethods
  status={shipping.status}
  rates={shipping.rates}
  value={shipping.selected}
  onChange={shipping.select}
/>`,
  props: [
    ['status', "'empty' | 'loading' | 'none' | 'ready'", 'Which state to show.'],
    ['rates', 'ShippingRate[]', '{ id, name, eta, price }. A price of 0 reads “FREE”.'],
    ['value / onChange', 'string | null / (id) => void', 'The chosen rate.'],
    ['name', 'string', 'Shared name of the radios. Default "shipping".'],
  ],
  Example: () => {
    const [status, setStatus] = useState<RatesStatus>('empty');
    const [rate, setRate] = useState('economy');
    return (
      <States>
        <State label="Step through the states" width={500}>
          <SegmentedControl
            name="demo-rates-status"
            label="State"
            value={status}
            onChange={value => setStatus(value as RatesStatus)}
            options={[{ value: 'empty', label: 'Empty' }, { value: 'loading', label: 'Loading' }, { value: 'ready', label: 'Ready' }, { value: 'none', label: 'None' }]}
          />
          <div style={{ marginTop: 14 }}>
            <ShippingMethods name="demo-rates" status={status} rates={DEMO_RATES} value={rate} onChange={setRate} />
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
