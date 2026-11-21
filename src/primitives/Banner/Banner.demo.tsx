import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link, Text } from '../Text/Text';
import { Banner } from './Banner';

const demo: Demo = {
  title: 'Banner',
  group: 'Components',
  order: 19,
  summary: 'The critical message shown when a payment fails. It opens by pushing the content below it down, drops in 8px with the spring curve, and takes focus so it is announced. The checkout has only this one tone.',
  usage: `<Banner open={paymentFailed} title="Your payment didn’t go through.">
  Try again or use a different payment method.
</Banner>`,
  props: [
    ['open', 'boolean', 'Whether it is shown.'],
    ['title', 'ReactNode', 'Bold lead-in.'],
    ['children', 'ReactNode', 'The rest of the message.'],
    ['focusOnOpen', 'boolean', 'Scroll it into view and focus it when it opens. Default true.'],
  ],
  Example: () => {
    const [open, setOpen] = useState(false);
    return (
      <States>
        <State label="Toggle it" width={460}>
          <Link onClick={() => setOpen(value => !value)}>{open ? 'Dismiss' : 'Fail the payment'}</Link>
          <div style={{ marginTop: 12 }}>
            <Banner open={open} title="Your payment didn’t go through." focusOnOpen={false}>
              Try again or use a different payment method.
            </Banner>
            <Text tone="subdued">Payment methods would follow here.</Text>
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
