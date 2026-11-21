import { State, States, type Demo } from '../../demo';
import { Heading, Text } from '../Text/Text';
import { Card, CardBody } from './Card';

const demo: Demo = {
  title: 'Card',
  group: 'Components',
  order: 23,
  summary: 'The bordered container the thank-you page is built from: 1px border, 12px corners, 16px padding in the body.',
  usage: `<Card>
  <CardBody>
    <Heading level={3}>Your order is confirmed</Heading>
    <Text>We’ve emailed you a confirmation with your order number.</Text>
  </CardBody>
</Card>`,
  props: [
    ['Card children', 'ReactNode', 'Media goes straight inside; text goes in a CardBody.'],
    ['CardBody children', 'ReactNode', 'Padded 16px.'],
  ],
  Example: () => (
    <States>
      <State label="Heading and text" width={420}>
        <Card>
          <CardBody>
            <Heading level={3}>Your order is confirmed</Heading>
            <Text>We’ve emailed you a confirmation with your order number.</Text>
          </CardBody>
        </Card>
      </State>
    </States>
  ),
};

export default demo;
