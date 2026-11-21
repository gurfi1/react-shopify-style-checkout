import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../../primitives/Text/Text';
import { ConfirmationCheck } from './ConfirmationCheck';

const demo: Demo = {
  title: 'ConfirmationCheck',
  group: 'Checkout blocks',
  order: 13,
  summary: 'The order-confirmed icon. Animated, the circle draws over 540ms while it grows from 30%, turns 175° and its stroke thins from 9 to 2; then the tick draws over 380ms. Static, it is the finished icon. In `Checkout` the 96px animated one flies to where the 50px static one sits.',
  usage: `<ConfirmationCheck size={96} animated />
<ConfirmationCheck />`,
  props: [
    ['size', 'number', 'Pixels. 96 at the centre of the screen, 50 beside the heading.'],
    ['animated', 'boolean', 'Draw it. Change its key to play again.'],
  ],
  Example: () => {
    const [run, setRun] = useState(0);
    return (
      <States>
        <State label="Animated, 96px">
          <ConfirmationCheck key={run} size={96} animated />
          <p style={{ marginTop: 12 }}><Link onClick={() => setRun(count => count + 1)}>Play again</Link></p>
        </State>
        <State label="Static, 50px">
          <ConfirmationCheck />
        </State>
      </States>
    );
  },
};

export default demo;
