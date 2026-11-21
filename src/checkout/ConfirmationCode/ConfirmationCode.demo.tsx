import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link, Text } from '../../primitives/Text/Text';
import { ConfirmationCode } from './ConfirmationCode';

const demo: Demo = {
  title: 'ConfirmationCode',
  group: 'Checkout blocks',
  order: 14,
  summary: 'Text whose characters appear one at a time, 13ms apart, each rising half a line and settling with a slight overshoot. Screen readers get the whole code at once.',
  usage: `Confirmation #<ConfirmationCode code="K7RM2XQ4P" />`,
  props: [
    ['code', 'string', 'The text.'],
    ['active', 'boolean', 'Hidden until true.'],
    ['delay', 'number', 'Milliseconds before the first character. Default 300.'],
  ],
  Example: () => {
    const [run, setRun] = useState(0);
    return (
      <States>
        <State label="Characters arrive in sequence">
          <Text tone="subdued">Confirmation #<ConfirmationCode key={run} code="K7RM2XQ4P" delay={0} /></Text>
          <p style={{ marginTop: 12 }}><Link onClick={() => setRun(count => count + 1)}>Play again</Link></p>
        </State>
      </States>
    );
  },
};

export default demo;
