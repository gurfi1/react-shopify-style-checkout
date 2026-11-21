import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { LockIcon } from '../../icons';
import { InfoButton, Tooltip } from '../Tooltip/Tooltip';
import { TextField } from './TextField';

const demo: Demo = {
  title: 'TextField',
  group: 'Components',
  order: 2,
  summary: 'A 49px text input with a floating label. Empty, it shows the label as a placeholder. Filled, a 12px label sits above the value. The switch is pure CSS, so browser autofill works too.',
  usage: `const [city, setCity] = useState('');

<TextField
  label="City"
  value={city}
  onChange={event => setCity(event.target.value)}
  error={cityError}
  autoComplete="address-level2"
/>`,
  props: [
    ['label', 'string', 'Placeholder while empty, small label once filled. Always rendered as a real <label>.'],
    ['error', 'string | null', 'Red border and a message that opens underneath. Sets aria-invalid and aria-describedby.'],
    ['accessory', 'ReactNode', 'Icon or tooltip button at the end of the field.'],
    ['below', 'ReactNode', 'Content under the field, above the error: a hint, a suggestion list.'],
    ['…input', 'InputHTMLAttributes', 'Everything else goes to the <input>: value, onChange, autoComplete, inputMode.'],
  ],
  Example: () => {
    const [empty, setEmpty] = useState('');
    const [filled, setFilled] = useState('San Francisco');
    const [bad, setBad] = useState('9410');
    const [card, setCard] = useState('');
    const [code, setCode] = useState('');
    return (
      <States>
        <State label="Empty" width={240}>
          <TextField label="City" value={empty} onChange={event => setEmpty(event.target.value)} />
        </State>
        <State label="Filled" width={240}>
          <TextField label="City" value={filled} onChange={event => setFilled(event.target.value)} />
        </State>
        <State label="Error (type to keep it, clear the prop to close)" width={240}>
          <TextField label="ZIP code" value={bad} onChange={event => setBad(event.target.value)} error={/^\d{5}$/.test(bad) ? null : 'Enter a valid ZIP code'} />
        </State>
        <State label="With an icon" width={240}>
          <TextField label="Card number" value={card} onChange={event => setCard(event.target.value)} accessory={<LockIcon />} inputMode="numeric" />
        </State>
        <State label="With a tooltip" width={240}>
          <TextField
            label="Security code"
            value={code}
            onChange={event => setCode(event.target.value)}
            accessory={
              <Tooltip content="The 3-digit code on the back of your card.">
                <InfoButton label="More information" />
              </Tooltip>
            }
          />
        </State>
        <State label="Long label truncates" width={160}>
          <TextField label="Apartment, suite, etc. (optional)" defaultValue="Flat 4" />
        </State>
      </States>
    );
  },
};

export default demo;
