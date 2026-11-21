import { State, States, type Demo } from '../../demo';
import { Heading, Link, Text } from './Text';

const demo: Demo = {
  title: 'Heading, Text, Link',
  group: 'Components',
  order: 1,
  summary: 'The type scale and the accent link. Two weights only, 400 and 600. Links show the same 3px ring on keyboard focus as every other control.',
  usage: `<Heading level={2}>Delivery</Heading>
<Text tone="subdued">Add your shipping address to see the shipping options.</Text>
<Link href="/account/login">Sign in</Link>
<Link onClick={openPolicy}>Refund policy</Link>`,
  props: [
    ['Heading level', '2 | 3 | 4', '20px section title, 16px sub-section, 14px detail label.'],
    ['Text tone', "'default' | 'subdued'", 'Subdued is the grey used for helper text.'],
    ['Text size', "'body' | 'small'", '14px or 12px.'],
    ['Link href', 'string', 'With it, an anchor. Without it, a button that looks the same.'],
  ],
  Example: () => (
    <States stacked>
      <State label="Heading level 2 · 20px / 1.2 / 600">
        <Heading level={2}>Delivery</Heading>
      </State>
      <State label="Heading level 3 · 16px / 1.3 / 600">
        <Heading level={3}>Shipping method</Heading>
      </State>
      <State label="Heading level 4 · 14px / 600">
        <Heading level={4}>Contact information</Heading>
      </State>
      <State label="Text · 14px / 1.35">
        <Text>Orders are processed within 1 to 2 business days.</Text>
      </State>
      <State label="Text, subdued">
        <Text tone="subdued">Usually ready in 24 hours</Text>
      </State>
      <State label="Text, small and subdued · 12px">
        <Text tone="subdued" size="small">Tan / Large</Text>
      </State>
      <State label="Link (anchor) and Link (button)">
        <Text>
          <Link href="#" onClick={event => event.preventDefault()}>Sign in</Link> · <Link>Refund policy</Link>
        </Text>
      </State>
    </States>
  ),
};

export default demo;
