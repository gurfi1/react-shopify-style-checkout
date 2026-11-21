import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Text } from '../Text/Text';
import { ContentSwap } from './ContentSwap';

const box = { padding: 16, borderRadius: 12, background: 'var(--bg-subdued)' } as const;

const demo: Demo = {
  title: 'ContentSwap',
  group: 'Components',
  order: 16,
  summary: 'Swaps content in place. The new content fades in over 133ms with a 1% sideways nudge, and the container’s height animates over 300ms. Used between Ship and Pick up, and between the shipping method states.',
  usage: `<ContentSwap activeKey={delivery} from={delivery === 'pickup' ? 'end' : 'start'}>
  {delivery === 'ship' ? <AddressForm … /> : <PickupLocations … />}
</ContentSwap>`,
  props: [
    ['activeKey', 'string', 'Identifies what is showing. A change triggers the animation.'],
    ['from', "'start' | 'end'", 'Side the new content nudges in from.'],
    ['children', 'ReactNode', 'The content for the current key.'],
  ],
  Example: () => {
    const [view, setView] = useState('short');
    return (
      <States>
        <State label="Switch between a short and a tall block" width={420}>
          <SegmentedControl
            name="demo-swap"
            label="Content"
            value={view}
            onChange={setView}
            options={[{ value: 'short', label: 'Short' }, { value: 'tall', label: 'Tall' }]}
          />
          <ContentSwap activeKey={view} from={view === 'tall' ? 'end' : 'start'}>
            <div style={{ paddingTop: 10 }}>
              {view === 'short' ? (
                <div style={box}><Text>One line.</Text></div>
              ) : (
                <div style={{ ...box, height: 180 }}><Text>A taller block. The height animates to fit.</Text></div>
              )}
            </div>
          </ContentSwap>
          <Text tone="subdued" style={{ marginTop: 10 }}>Content below follows the height.</Text>
        </State>
      </States>
    );
  },
};

export default demo;
