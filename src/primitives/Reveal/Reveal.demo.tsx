import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Card, CardBody } from '../Card/Card';
import { Link } from '../Text/Text';
import { Reveal } from './Reveal';

const demo: Demo = {
  title: 'Reveal',
  group: 'Components',
  order: 17,
  summary: 'Content that rises 10px and fades in over 400ms. Siblings with rising index values start 90ms apart. The thank-you page’s cards arrive this way.',
  usage: `<Reveal index={0} active={ready}>…</Reveal>
<Reveal index={1} active={ready}>…</Reveal>`,
  props: [
    ['index', 'number', 'Position in the sequence. Delay is index × 90ms + 120ms.'],
    ['active', 'boolean', 'Hidden until true.'],
  ],
  Example: () => {
    const [run, setRun] = useState(0);
    return (
      <States>
        <State label="Three in sequence" width={360}>
          <Link onClick={() => setRun(count => count + 1)}>Play again</Link>
          <div key={run} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {['First', 'Second', 'Third'].map((label, index) => (
              <Reveal key={label} index={index}>
                <Card><CardBody>{label}</CardBody></Card>
              </Reveal>
            ))}
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
