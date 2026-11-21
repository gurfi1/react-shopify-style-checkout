import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { StoreIcon, TruckIcon } from '../../icons';
import { SegmentedControl } from './SegmentedControl';

const demo: Demo = {
  title: 'SegmentedControl',
  group: 'Components',
  order: 8,
  summary: 'A switch between a few options. The white pill slides to the selected one in 133ms. Native radios underneath, so arrow keys work.',
  usage: `<SegmentedControl
  name="delivery"
  label="Delivery method"
  value={delivery}
  onChange={setDelivery}
  options={[
    { value: 'ship', label: 'Ship', icon: <TruckIcon /> },
    { value: 'pickup', label: 'Pick up', icon: <StoreIcon /> },
  ]}
/>`,
  props: [
    ['name', 'string', 'Shared name of the radios.'],
    ['value / onChange', 'string / (value, index) => void', 'The selected option.'],
    ['options', '{ value, label, icon? }[]', 'Two in the checkout; any small number works.'],
    ['label', 'string', 'Accessible name of the group.'],
  ],
  Example: () => {
    const [delivery, setDelivery] = useState('ship');
    const [period, setPeriod] = useState('month');
    return (
      <States>
        <State label="Two options with icons, as in the checkout" width={420}>
          <SegmentedControl
            name="demo-delivery"
            label="Delivery method"
            value={delivery}
            onChange={setDelivery}
            options={[
              { value: 'ship', label: 'Ship', icon: <TruckIcon /> },
              { value: 'pickup', label: 'Pick up', icon: <StoreIcon /> },
            ]}
          />
        </State>
        <State label="Three options" width={420}>
          <SegmentedControl
            name="demo-period"
            label="Billing period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'week', label: 'Weekly' },
              { value: 'month', label: 'Monthly' },
              { value: 'year', label: 'Yearly' },
            ]}
          />
        </State>
      </States>
    );
  },
};

export default demo;
