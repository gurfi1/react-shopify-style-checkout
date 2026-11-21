import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../Text/Text';
import { Tag } from './Tag';

const demo: Demo = {
  title: 'Tag',
  group: 'Components',
  order: 20,
  summary: 'A grey chip with a price-tag icon, used for an applied discount code. It pops in from half size with a small overshoot over 400ms.',
  usage: `<Tag onRemove={removeDiscount} removeLabel="Remove discount">WELCOME10</Tag>`,
  props: [
    ['children', 'ReactNode', 'The code or text.'],
    ['onRemove', '() => void', 'Adds the round remove button.'],
    ['removeLabel', 'string', 'Accessible name of the remove button.'],
    ['icon', 'ReactNode', 'Replaces the price-tag icon; null for none.'],
  ],
  Example: () => {
    const [shown, setShown] = useState(true);
    return (
      <States>
        <State label="Removable. Remove it, then apply again to see it pop in.">
          <div style={{ minHeight: 30 }}>
            {shown ? <Tag onRemove={() => setShown(false)} removeLabel="Remove discount">WELCOME10</Tag> : <Link onClick={() => setShown(true)}>Apply again</Link>}
          </div>
        </State>
        <State label="Without a remove button">
          <Tag>FREESHIP</Tag>
        </State>
      </States>
    );
  },
};

export default demo;
