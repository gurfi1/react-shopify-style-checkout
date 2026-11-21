import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../../primitives/Text/Text';
import { ExpressCheckout } from './ExpressCheckout';

const buttons = [
  { id: 'fast', label: 'Fast Pay', background: '#5a31f4' },
  { id: 'wallet', label: 'Wallet', background: '#ffc439', color: '#111' },
  { id: 'tap', label: 'Tap Pay', background: '#000' },
];

const demo: Demo = {
  title: 'ExpressCheckout',
  group: 'Checkout blocks',
  order: 2,
  summary: 'A row of wallet buttons above the form with an “OR” line under it. The buttons are placeholders for a payment provider’s own. While loading they pulse grey; their colours then fade in over 300ms. Below 480px they stack.',
  usage: `<ExpressCheckout
  loading={!walletsReady}
  buttons={[
    { id: 'fast', label: 'Fast Pay', background: '#5a31f4', onClick: payFast },
    { id: 'wallet', label: 'Wallet', background: '#ffc439', color: '#111' },
  ]}
/>`,
  props: [
    ['buttons', '{ id, label, content?, background?, color?, onClick? }[]', 'One per wallet. `content` shows a logo in place of the text; `label` then names the button for screen readers.'],
    ['loading', 'boolean', 'Grey pulsing placeholders.'],
    ['label', 'string', 'Text above. Defaults to the “Express checkout” label.'],
    ['dividerLabel', 'string | null', 'Text on the line below; null for no line.'],
  ],
  Example: () => {
    const [loading, setLoading] = useState(false);
    return (
      <States>
        <State label="Toggle the loading state" width={500}>
          <p style={{ marginBottom: 12 }}>
            <Link onClick={() => setLoading(value => !value)}>{loading ? 'Finish loading' : 'Show loading'}</Link>
          </p>
          <ExpressCheckout buttons={buttons} loading={loading} />
        </State>
      </States>
    );
  },
};

export default demo;
