import { State, States, type Demo } from '../../demo';
import { Link, Text } from '../../primitives/Text/Text';
import { CheckoutHeader, CheckoutLayout } from './CheckoutLayout';

const block = (label: string, height: number) => (
  <div style={{ display: 'grid', placeItems: 'center', height, borderRadius: 12, border: '1px dashed var(--border)', color: 'var(--text-subdued)' }}>{label}</div>
);

const demo: Demo = {
  title: 'CheckoutLayout, CheckoutHeader',
  group: 'Checkout blocks',
  order: 1,
  summary: 'The page shell. From 1000px wide: a full-width header, a form column up to 580px right-aligned to a divider 50px right of centre, and a sticky grey summary column up to 480px. Below that it is one column and the summary collapses behind `summaryBar`. It answers to the window’s width, so the preview here is the wide layout at half size.',
  usage: `<CheckoutLayout
  header={<CheckoutHeader storeName="Northfield" cartHref="/cart" />}
  summaryBar={<OrderSummaryToggle open={open} onToggle={toggle} total="$126.90" />}
  summaryOpen={open}
  summary={<OrderSummary … />}
>
  <form>…</form>
</CheckoutLayout>`,
  props: [
    ['header', 'ReactNode', 'Contents of the header row.'],
    ['summary', 'ReactNode', 'The grey column.'],
    ['summaryBar', 'ReactNode', 'Shown above the summary below 1000px; hidden above.'],
    ['summaryOpen', 'boolean', 'Whether the summary is expanded below 1000px.'],
    ['stage, stageOffset', "'exit' | 'intro' | 'settle' | 'done', number", 'Drive the order-confirmed entrance. `Checkout` sets these.'],
    ['children', 'ReactNode', 'The form column.'],
    ['CheckoutHeader storeName, logo', 'string, ReactNode', 'Spaced-out name, or your own logo.'],
    ['CheckoutHeader homeHref, cartHref', 'string', 'Where the logo and the bag icon link.'],
  ],
  Example: () => (
    <States stacked>
      <State label="Wide layout at 50% scale. Open the full checkout and narrow the window to see it fold.">
        <div style={{ height: 330, overflow: 'hidden', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ width: '200%', transform: 'scale(.5)', transformOrigin: '0 0' }}>
            <CheckoutLayout header={<CheckoutHeader storeName="Northfield" homeHref="#/blocks" cartHref="#/blocks" />} summary={block('summary', 260)}>
              {block('form', 520)}
            </CheckoutLayout>
          </div>
        </div>
        <Text style={{ marginTop: 10 }}><Link href="#/">Open the full checkout</Link></Text>
      </State>
    </States>
  ),
};

export default demo;
