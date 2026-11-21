import { State, States, type Demo } from '../../demo';
import { InfoButton, Tooltip } from './Tooltip';

const demo: Demo = {
  title: 'Tooltip, InfoButton',
  group: 'Components',
  order: 11,
  summary: 'A near-black bubble with white 12px text, up to 190px wide, with a small arrow. It opens above its trigger on hover and on keyboard focus, and is linked with aria-describedby so screen readers read it.',
  usage: `<Tooltip content="We use this to send your order confirmation and updates">
  <InfoButton label="More information" />
</Tooltip>`,
  props: [
    ['Tooltip content', 'ReactNode', 'The bubble’s text.'],
    ['Tooltip children', 'ReactElement', 'One focusable element. It receives aria-describedby.'],
    ['InfoButton label', 'string', 'Accessible name of the round button.'],
    ['InfoButton icon', 'ReactNode', 'Replaces the question mark.'],
  ],
  Example: () => (
    <States>
      <State label="Hover it or tab to it">
        <div style={{ paddingTop: 44, paddingInlineStart: 150 }}>
          <Tooltip content="We use this to send your order confirmation and updates">
            <InfoButton label="More information" />
          </Tooltip>
        </div>
      </State>
      <State label="Long text wraps at 190px">
        <div style={{ paddingTop: 64, paddingInlineStart: 170 }}>
          <Tooltip content="The 3-digit code on the back of your card. American Express uses a 4-digit code on the front.">
            <InfoButton label="More information" />
          </Tooltip>
        </div>
      </State>
    </States>
  ),
};

export default demo;
