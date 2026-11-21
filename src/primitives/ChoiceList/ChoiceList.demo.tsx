import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { ChoiceEnd, ChoiceList } from './ChoiceList';

const demo: Demo = {
  title: 'ChoiceList',
  group: 'Components',
  order: 7,
  summary: 'Radio rows joined into one rounded box, used for shipping rates, pickup locations and payment methods. The selected row takes an accent border and a 5% accent tint. An option can carry a panel that opens under it while selected.',
  usage: `<ChoiceList
  name="shipping"
  label="Shipping method"
  value={rate}
  onChange={setRate}
  options={[
    { value: 'economy', title: 'Economy', description: '5 to 8 business days', end: <b>FREE</b> },
    { value: 'express', title: 'Express', description: '1 to 2 business days', end: <b>$14.90</b> },
  ]}
/>`,
  props: [
    ['name', 'string', 'Shared name of the radios.'],
    ['value / onChange', 'string / (value) => void', 'The selected option.'],
    ['label', 'string', 'Accessible name of the radio group.'],
    ['options[].title', 'ReactNode', 'Bold first line.'],
    ['options[].description', 'ReactNode', 'Second line.'],
    ['options[].detail', 'ReactNode', 'Third line, in grey.'],
    ['options[].end', 'ReactNode', 'Content at the end of the row. `ChoiceEnd` gives a price with a note under it.'],
    ['options[].panel', 'ReactNode', 'Opens under the row while it is selected.'],
  ],
  Example: () => {
    const [rate, setRate] = useState('economy');
    const [place, setPlace] = useState('a');
    const [method, setMethod] = useState('card');
    return (
      <States>
        <State label="Two lines and a price" width={420}>
          <ChoiceList
            name="demo-rate"
            label="Shipping method"
            value={rate}
            onChange={setRate}
            options={[
              { value: 'economy', title: 'Economy', description: '5 to 8 business days', end: <b>FREE</b> },
              { value: 'standard', title: 'Standard', description: '3 to 4 business days', end: <b>$6.90</b> },
              { value: 'express', title: 'Express', description: '1 to 2 business days', end: <b>$14.90</b> },
            ]}
          />
        </State>
        <State label="Three lines, price with a note" width={420}>
          <ChoiceList
            name="demo-place"
            label="Pickup location"
            value={place}
            onChange={setPlace}
            options={[
              { value: 'a', title: 'Northfield Flagship', description: '118 Alder St, Portland OR', detail: 'Usually ready in 24 hours', end: <ChoiceEnd title="FREE" detail="1.2 mi" /> },
              { value: 'b', title: 'Northfield Eastside', description: '2040 Hawthorne Blvd, Portland OR', detail: 'Usually ready in 2 to 4 days', end: <ChoiceEnd title="FREE" detail="3.8 mi" /> },
            ]}
          />
        </State>
        <State label="With panels: the selected row's panel opens" width={420}>
          <ChoiceList
            name="demo-method"
            label="Payment method"
            value={method}
            onChange={setMethod}
            options={[
              { value: 'card', title: 'Credit card', panel: 'Card fields go here.' },
              { value: 'wallet', title: 'Digital wallet', panel: 'You’ll be taken to your wallet to finish paying.' },
              { value: 'cod', title: 'Cash on Delivery (COD)', panel: 'Pay with cash when your order is delivered.' },
            ]}
          />
        </State>
      </States>
    );
  },
};

export default demo;
