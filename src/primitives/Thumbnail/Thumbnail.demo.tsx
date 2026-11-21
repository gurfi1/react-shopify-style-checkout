import { State, States, type Demo } from '../../demo';
import { Surface } from '../../theme/Theme';
import { Thumbnail } from './Thumbnail';

const Mug = () => (
  <svg viewBox="0 0 64 64" aria-hidden>
    <rect width="64" height="64" fill="#ededed" />
    <path d="M44 28h4.5a6.5 6.5 0 0 1 0 13H44" fill="none" stroke="#7f9a86" strokeWidth="3.4" />
    <path d="M17 21h28v22a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V21Z" fill="#9db5a2" />
    <ellipse cx="31" cy="21" rx="14" ry="3.4" fill="#86a08c" />
  </svg>
);

const demo: Demo = {
  title: 'Thumbnail',
  group: 'Components',
  order: 24,
  summary: 'A 64px frame for a product image: 16px corners, 2px white border, hairline shadow. The quantity sits in a black badge hanging 8px off the top corner.',
  usage: `<Thumbnail quantity={2}>
  <img src={product.image} alt="" />
</Thumbnail>`,
  props: [
    ['children', 'ReactNode', 'An <img> or <svg>. It fills the frame.'],
    ['quantity', 'number', 'Number in the badge. Leave out for no badge.'],
  ],
  Example: () => (
    <States>
      <State label="On the grey summary surface">
        <Surface style={{ padding: 20, borderRadius: 12, display: 'flex', gap: 24 }}>
          <Thumbnail quantity={2}><Mug /></Thumbnail>
          <Thumbnail quantity={12}><Mug /></Thumbnail>
          <Thumbnail><Mug /></Thumbnail>
        </Surface>
      </State>
    </States>
  ),
};

export default demo;
