import { State, States, type Demo } from '../../demo';
import { PolicyLinks } from './PolicyLinks';

const demo: Demo = {
  title: 'PolicyLinks',
  group: 'Checkout blocks',
  order: 12,
  summary: 'The footer’s row of links. Each opens its text in a `Modal`, so the shopper never leaves the checkout, and focus returns to the link when it closes.',
  usage: `<PolicyLinks
  policies={[
    { id: 'refund', label: 'Refund policy', content: <p>We have a 30-day return policy…</p> },
    { id: 'privacy', label: 'Privacy policy', content: <PrivacyText /> },
  ]}
/>`,
  props: [['policies', 'Policy[]', '{ id, label, title?, content }. The modal’s title defaults to the label.']],
  Example: () => (
    <States>
      <State label="Click a link">
        <PolicyLinks
          policies={[
            { id: 'refund', label: 'Refund policy', content: <><p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p><p>Approved refunds go back to your original payment method within 10 business days.</p></> },
            { id: 'shipping', label: 'Shipping', content: <p>Orders are processed within 1 to 2 business days.</p> },
            { id: 'privacy', label: 'Privacy policy', content: <p>We do not sell your personal information.</p> },
          ]}
        />
      </State>
    </States>
  ),
};

export default demo;
