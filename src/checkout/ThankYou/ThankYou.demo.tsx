import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../../primitives/Text/Text';
import { OrderDetails, type OrderDetail } from '../OrderDetails/OrderDetails';
import { ThankYou } from './ThankYou';

const details: [OrderDetail[], OrderDetail[]] = [
  [
    { title: 'Contact information', lines: ['ada@example.com'] },
    { title: 'Shipping address', lines: ['Ada Lovelace', '12 Market St', 'San Francisco CA 94103', 'United States'] },
    { title: 'Shipping method', lines: ['Standard'] },
  ],
  [
    { title: 'Payment method', lines: ['Visa ending with 4242 · $126.90'] },
    { title: 'Billing address', lines: ['Ada Lovelace', '12 Market St', 'San Francisco CA 94103', 'United States'] },
  ],
];

const demo: Demo = {
  title: 'OrderDetails, ThankYou',
  group: 'Checkout blocks',
  order: 16,
  summary: '`ThankYou` is the confirmation page: tick, code and heading, the map card, the order details and a way onward, rising in 90ms apart. `OrderDetails` is its two-column grid of titled facts, one column below 480px.',
  usage: `<ThankYou
  confirmation="K7RM2XQ4P"
  firstName="Ada"
  mapLabel="Shipping address"
  mapPlace="San Francisco CA"
  details={[leftColumn, rightColumn]}
  onContinue={() => navigate('/')}
/>

<OrderDetails columns={[leftColumn, rightColumn]} />`,
  props: [
    ['confirmation', 'string', 'The code after “Confirmation #”.'],
    ['firstName', 'string', '“Thank you, Ada!” or, without it, “Thank you!”.'],
    ['mapLabel, mapPlace', 'string', 'The map callout’s two lines.'],
    ['details', '[OrderDetail[], OrderDetail[]]', 'Left and right columns of { title, lines }.'],
    ['onContinue, helpHref', '() => void, string', 'The button and the “Contact us” link.'],
    ['revealing, iconShown, iconRef, titleRef', '', 'For a parent that stages the entrance, as `Checkout` does. Leave them out otherwise.'],
  ],
  Example: () => {
    const [run, setRun] = useState(0);
    return (
      <States>
        <State label="ThankYou" width={500}>
          <p style={{ marginBottom: 16 }}><Link onClick={() => setRun(count => count + 1)}>Play the entrance again</Link></p>
          <ThankYou key={run} confirmation="K7RM2XQ4P" firstName="Ada" mapLabel="Shipping address" mapPlace="San Francisco CA" details={details} />
        </State>
        <State label="OrderDetails alone" width={420}>
          <OrderDetails columns={details} />
        </State>
      </States>
    );
  },
};

export default demo;
