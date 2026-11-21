import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link, Text } from '../Text/Text';
import { TextField } from '../TextField/TextField';
import { Collapsible } from './Collapsible';

const demo: Demo = {
  title: 'Collapsible',
  group: 'Components',
  order: 15,
  summary: 'Opens and closes content over 200ms by animating a grid row from 0fr to 1fr, so nothing is measured in JavaScript. It clips only while moving: once open, focus rings and tooltips inside can spill out.',
  usage: `<Collapsible open={!sameAsShipping}>
  <AddressForm … />
</Collapsible>`,
  props: [
    ['open', 'boolean', 'Whether the content is shown.'],
    ['children', 'ReactNode', 'Stays mounted while closed, hidden from sight, keyboard and screen readers.'],
  ],
  Example: () => {
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState('');
    return (
      <States stacked>
        <State label="Toggle it. Focus the field: its ring is not clipped." width={360}>
          <Link onClick={() => setOpen(next => !next)}>{open ? 'Close' : 'Open'}</Link>
          <Collapsible open={open}>
            <div style={{ paddingTop: 12 }}>
              <TextField label="Company (optional)" value={value} onChange={event => setValue(event.target.value)} />
            </div>
          </Collapsible>
          <Text tone="subdued" style={{ marginTop: 12 }}>Content after it moves with the animation.</Text>
        </State>
      </States>
    );
  },
};

export default demo;
