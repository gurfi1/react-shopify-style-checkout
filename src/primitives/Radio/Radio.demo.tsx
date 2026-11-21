import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Radio } from './Radio';

const row = { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' } as const;

const demo: Demo = {
  title: 'Radio',
  group: 'Components',
  order: 6,
  summary: 'The bare radio used inside `ChoiceList`. A native input, so arrow keys move between radios that share a name.',
  usage: `<label>
  <Radio name="size" value="m" checked={size === 'm'} onChange={() => setSize('m')} />
  Medium
</label>`,
  props: [['…input', 'InputHTMLAttributes', 'name, value, checked, onChange and the rest go to the <input type="radio">.']],
  Example: () => {
    const [size, setSize] = useState('m');
    return (
      <States>
        <State label="A group: click or use the arrow keys">
          <div role="radiogroup" aria-label="Size" style={{ display: 'grid', gap: 10 }}>
            {[['s', 'Small'], ['m', 'Medium'], ['l', 'Large']].map(([value, label]) => (
              <label key={value} style={row}>
                <Radio name="radio-demo" value={value} checked={size === value} onChange={() => setSize(value)} />
                {label}
              </label>
            ))}
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
