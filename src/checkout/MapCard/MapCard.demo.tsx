import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Card, CardBody } from '../../primitives/Card/Card';
import { Heading, Link, Text } from '../../primitives/Text/Text';
import { MapCard } from './MapCard';

const demo: Demo = {
  title: 'MapCard',
  group: 'Checkout blocks',
  order: 15,
  summary: 'A 180px stylised map for the top of the confirmation card. The map settles in from 112% over 700ms, the pin pops, then the callout rises. It is drawn in CSS and shows no real place.',
  usage: `<Card>
  <MapCard label="Shipping address" place="San Francisco CA" />
  <CardBody>…</CardBody>
</Card>`,
  props: [
    ['label', 'ReactNode', 'Small grey line in the callout.'],
    ['place', 'ReactNode', 'Bold line in the callout.'],
    ['active', 'boolean', 'Hold the entrance until true.'],
  ],
  Example: () => {
    const [run, setRun] = useState(0);
    return (
      <States>
        <State label="At the top of a Card" width={460}>
          <Card key={run}>
            <MapCard label="Shipping address" place="San Francisco CA" />
            <CardBody>
              <Heading level={3}>Your order is confirmed</Heading>
              <Text>We’ve emailed you a confirmation with your order number.</Text>
            </CardBody>
          </Card>
          <p style={{ marginTop: 12 }}><Link onClick={() => setRun(count => count + 1)}>Play again</Link></p>
        </State>
      </States>
    );
  },
};

export default demo;
