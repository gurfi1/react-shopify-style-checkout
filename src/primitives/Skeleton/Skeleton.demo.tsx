import { State, States, type Demo } from '../../demo';
import { Surface } from '../../theme/Theme';
import { Skeleton } from './Skeleton';

const demo: Demo = {
  title: 'Skeleton',
  group: 'Components',
  order: 18,
  summary: 'A grey placeholder with 6px corners that pulses to half opacity on a 1.35s loop. On a grey surface it switches to a darker grey so it stays visible.',
  usage: `<Skeleton width="38%" height={12} />
<Skeleton shape="pill" />
<Skeleton shape="circle" />`,
  props: [
    ['shape', "'block' | 'pill' | 'circle'", 'Block is sized by you. Pill is 46×12 and sits inline. Circle is 18px.'],
    ['width / height', 'number | string', 'Size of a block.'],
  ],
  Example: () => (
    <States>
      <State label="Block" width={220}>
        <Skeleton width="38%" height={12} />
      </State>
      <State label="Pill, inline with text">
        <span>Shipping <Skeleton shape="pill" /></span>
      </State>
      <State label="Circle">
        <Skeleton shape="circle" />
      </State>
      <State label="On a grey surface" width={220}>
        <Surface style={{ padding: 16, borderRadius: 12 }}>
          <Skeleton width="60%" height={12} />
        </Surface>
      </State>
    </States>
  ),
};

export default demo;
