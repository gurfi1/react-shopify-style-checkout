import { State, States, type Demo } from '../../demo';
import { Divider } from './Divider';

const demo: Demo = {
  title: 'Divider',
  group: 'Components',
  order: 21,
  summary: 'A 1px line in the border colour, optionally with grey text centred on it. The checkout puts “OR” between express checkout and the form.',
  usage: `<Divider>OR</Divider>
<Divider />`,
  props: [['children', 'ReactNode', 'Label centred on the line. Leave out for a plain line.']],
  Example: () => (
    <States stacked>
      <State label="With a label" width={420}>
        <Divider>OR</Divider>
      </State>
      <State label="Plain" width={420}>
        <Divider />
      </State>
    </States>
  ),
};

export default demo;
