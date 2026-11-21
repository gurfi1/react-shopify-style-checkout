import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { SelectField } from './SelectField';

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
];
const states = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'OR', label: 'Oregon' },
];

const demo: Demo = {
  title: 'SelectField',
  group: 'Components',
  order: 3,
  summary: 'A native select dressed as a text field. Until something is chosen it shows its placeholder option in grey; after, the small label appears above the value.',
  usage: `<SelectField
  label="State"
  placeholder="State"
  value={region}
  options={[{ value: 'CA', label: 'California' }]}
  onChange={event => setRegion(event.target.value)}
/>`,
  props: [
    ['label', 'string', 'Small label above the chosen value.'],
    ['value', 'string', "The chosen value. '' means nothing chosen."],
    ['options', '{ value, label }[]', 'The choices.'],
    ['placeholder', 'string', 'Text of the empty first option. Leave out when a value is always set.'],
    ['error', 'string | null', 'Red border and a message underneath.'],
  ],
  Example: () => {
    const [country, setCountry] = useState('US');
    const [region, setRegion] = useState('');
    const [missing, setMissing] = useState('');
    return (
      <States>
        <State label="Always has a value" width={240}>
          <SelectField label="Country/Region" value={country} options={countries} onChange={event => setCountry(event.target.value)} />
        </State>
        <State label="Nothing chosen yet" width={240}>
          <SelectField label="State" placeholder="State" value={region} options={states} onChange={event => setRegion(event.target.value)} />
        </State>
        <State label="Error" width={240}>
          <SelectField label="State" placeholder="State" value={missing} options={states} onChange={event => setMissing(event.target.value)} error={missing ? null : 'Select a state'} />
        </State>
      </States>
    );
  },
};

export default demo;
