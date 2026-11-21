import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../../primitives/Text/Text';
import { Surface } from '../../theme/Theme';
import { CheckoutSkeleton, OrderSummarySkeleton } from './CheckoutSkeleton';

const demo: Demo = {
  title: 'CheckoutSkeleton, OrderSummarySkeleton',
  group: 'Checkout blocks',
  order: 1.5,
  summary: 'What the page shows while it loads. The shell appears at once; these grey shapes fade in 160ms later, so a fast load never flashes them, and pulse while they wait. `Checkout` shows them while its `loading` prop is true, then fades them out over 133ms as the real page fades in. Reload the full checkout to see the whole sequence.',
  usage: `// The whole page
<Checkout loading={!cart} items={cart?.lines ?? []} … />

// Or by hand, inside your own layout
<CheckoutLayout summary={ready ? <OrderSummary … /> : <OrderSummarySkeleton />}>
  {ready ? <form>…</form> : <CheckoutSkeleton />}
</CheckoutLayout>`,
  props: [
    ['CheckoutSkeleton express', 'boolean', 'Show the express row: a label and three button shapes. Default true.'],
    ['CheckoutSkeleton sections', 'number', 'How many heading-and-two-lines sections. Default 2.'],
    ['OrderSummarySkeleton items', 'number', 'How many product shapes. Default 1.'],
    ['Checkout loading', 'boolean', 'Shows both skeletons in place of the form and the summary.'],
  ],
  Example: () => {
    const [run, setRun] = useState(0);
    return (
      <States stacked>
        <State label="Form column and summary column, as they appear on load">
          <p style={{ marginBottom: 16 }}>
            <Link onClick={() => setRun(count => count + 1)}>Play the fade-in again</Link>
          </p>
          <div key={run} style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ flex: '1 1 380px', minWidth: 0, padding: 40 }}>
              <CheckoutSkeleton />
            </div>
            <Surface style={{ flex: '1 1 320px', minWidth: 0, padding: 40 }}>
              <OrderSummarySkeleton />
            </Surface>
          </div>
        </State>
        <State label="Without the express row, one section" width={420}>
          <CheckoutSkeleton key={run} express={false} sections={1} />
        </State>
      </States>
    );
  },
};

export default demo;
