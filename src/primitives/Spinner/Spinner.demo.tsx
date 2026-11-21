import { State, States, type Demo } from '../../demo';
import { Spinner } from './Spinner';

const demo: Demo = {
  title: 'Spinner',
  group: 'Components',
  order: 10,
  summary: 'A 2px round-capped arc on a 1.6s loop. It turns two full circles per cycle while the arc grows from 6% to 74% of the circle and shrinks again. Colour comes from the surrounding text.',
  usage: `<Spinner />
<Spinner size={18} style={{ color: 'var(--accent)' }} />`,
  props: [
    ['size', 'number', 'Width and height in pixels. 20 in the pay button, 18 in the apply button.'],
    ['active', 'boolean', 'False holds it still.'],
  ],
  Example: () => (
    <States>
      <State label="20px, text colour">
        <Spinner />
      </State>
      <State label="32px, accent">
        <Spinner size={32} style={{ color: 'var(--accent)' }} />
      </State>
      <State label="On the accent colour">
        <span style={{ display: 'inline-grid', placeItems: 'center', width: 50, height: 50, borderRadius: 12, background: 'var(--accent)', color: '#fff' }}>
          <Spinner />
        </span>
      </State>
    </States>
  ),
};

export default demo;
