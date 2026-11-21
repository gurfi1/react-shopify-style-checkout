import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Checkbox } from './Checkbox';

const demo: Demo = {
  title: 'Checkbox',
  group: 'Components',
  order: 5,
  summary: 'A native checkbox under an 18px drawn box. Ticking fills the box in 133ms, then the tick draws as a stroke over 300ms.',
  usage: `<Checkbox checked={news} onChange={event => setNews(event.target.checked)}>
  Email me with news and offers
</Checkbox>`,
  props: [
    ['children', 'ReactNode', 'The label text.'],
    ['…input', 'InputHTMLAttributes', 'checked, onChange, disabled and the rest go to the <input type="checkbox">.'],
  ],
  Example: () => {
    const [off, setOff] = useState(false);
    const [on, setOn] = useState(true);
    return (
      <States>
        <State label="Unticked">
          <Checkbox checked={off} onChange={event => setOff(event.target.checked)}>Email me with news and offers</Checkbox>
        </State>
        <State label="Ticked">
          <Checkbox checked={on} onChange={event => setOn(event.target.checked)}>Save this information for next time</Checkbox>
        </State>
        <State label="Long label wraps beside the box" width={220}>
          <Checkbox defaultChecked={false}>Use shipping address as billing address for this order</Checkbox>
        </State>
      </States>
    );
  },
};

export default demo;
