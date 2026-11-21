import { State, States, type Demo } from '../../demo';
import { TextField } from '../TextField/TextField';
import { FieldGrid, Stack } from './Layout';

const demo: Demo = {
  title: 'Stack, FieldGrid',
  group: 'Components',
  order: 25,
  summary: 'The form’s spacing. Stack puts 10px between rows. FieldGrid puts two or three fields side by side; a three-column row stacks when the form itself, not the window, is narrower than 420px.',
  usage: `<Stack>
  <TextField label="Address" … />
  <FieldGrid columns={3}>
    <TextField label="City" … />
    <SelectField label="State" … />
    <TextField label="ZIP code" … />
  </FieldGrid>
</Stack>`,
  props: [
    ['Stack gap', 'number', 'Pixels between children. Default 10.'],
    ['FieldGrid columns', '2 | 3', 'Fields per row.'],
  ],
  Example: () => (
    <States>
      <State label="500px wide: three columns" width={500}>
        <Stack>
          <TextField label="Address" defaultValue="" />
          <FieldGrid columns={2}>
            <TextField label="First name (optional)" defaultValue="" />
            <TextField label="Last name" defaultValue="" />
          </FieldGrid>
          <FieldGrid columns={3}>
            <TextField label="City" defaultValue="" />
            <TextField label="State" defaultValue="" />
            <TextField label="ZIP code" defaultValue="" />
          </FieldGrid>
        </Stack>
      </State>
      <State label="350px wide: the three-column row stacks" width={350}>
        <Stack>
          <FieldGrid columns={2}>
            <TextField label="First name (optional)" defaultValue="" />
            <TextField label="Last name" defaultValue="" />
          </FieldGrid>
          <FieldGrid columns={3}>
            <TextField label="City" defaultValue="" />
            <TextField label="State" defaultValue="" />
            <TextField label="ZIP code" defaultValue="" />
          </FieldGrid>
        </Stack>
      </State>
    </States>
  ),
};

export default demo;
