import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Text } from '../../primitives/Text/Text';
import { DEMO_METHODS } from '../demoData';
import { PaymentMethods } from './PaymentMethods';

const demo: Demo = {
  title: 'PaymentMethods',
  group: 'Checkout blocks',
  order: 8,
  summary: 'Payment methods as a choice list with panels. A `card` method shows the brand badges and opens whatever you pass as `cardPanel`. A `redirect` method opens an illustration and its note. A `manual` method opens its note.',
  usage: `<PaymentMethods
  methods={[
    { id: 'card', title: 'Credit card', kind: 'card' },
    { id: 'wallet', title: 'Digital wallet', kind: 'redirect', note: 'You’ll be taken to your wallet…' },
    { id: 'cod', title: 'Cash on Delivery (COD)', kind: 'manual', note: 'Pay with cash…' },
  ]}
  value={method}
  onChange={setMethod}
  cardPanel={<CardFields … />}
  cardBrand={cardBrandOf(card.number)}
/>`,
  props: [
    ['methods', 'PaymentMethod[]', "{ id, title, kind: 'card' | 'redirect' | 'manual', note? }"],
    ['value / onChange', 'string / (id) => void', 'The chosen method.'],
    ['cardPanel', 'ReactNode', 'Opens under a card method.'],
    ['cardBrand', 'CardBrand', 'Dims the other badges.'],
  ],
  Example: () => {
    const [method, setMethod] = useState('wallet');
    return (
      <States>
        <State label="Switch methods: one panel closes as the next opens" width={500}>
          <PaymentMethods name="demo-payment" methods={DEMO_METHODS} value={method} onChange={setMethod} cardPanel={<Text tone="subdued">CardFields goes here.</Text>} />
        </State>
      </States>
    );
  },
};

export default demo;
