import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Text } from '../../primitives/Text/Text';
import { demoSuggest } from '../demoData';
import { AddressAutocomplete } from './AddressAutocomplete';

const demo: Demo = {
  title: 'AddressAutocomplete',
  group: 'Checkout blocks',
  order: 5,
  summary: 'The address line with lookup. It is `Combobox` set up for addresses: the magnifier icon, the street in black and the rest in grey. `AddressForm` uses it when given a `suggest` function.',
  usage: `<AddressAutocomplete
  value={line1}
  onChange={setLine1}
  countryName="United States"
  suggest={query => api.suggestAddresses(query, 'US')}
  onSelect={suggestion => fillAddress(suggestion)}
/>`,
  props: [
    ['value / onChange', 'string / (value) => void', 'The street line as typed.'],
    ['suggest', '(query) => Promise<AddressSuggestion[]>', 'The lookup. Up to five results read best.'],
    ['onSelect', '(suggestion) => void', 'Fill street, city, region and postal code from it.'],
    ['countryName', 'string', 'Shown at the end of each row.'],
    ['error', 'string | null', 'Message under the field.'],
  ],
  Example: () => {
    const [line, setLine] = useState('');
    const [picked, setPicked] = useState('');
    return (
      <States>
        <State label="Type any three characters, for example “12 m”" width={460}>
          <div style={{ minHeight: 250 }}>
            <AddressAutocomplete
              id="demo-autocomplete"
              value={line}
              onChange={setLine}
              countryName="United States"
              suggest={demoSuggest}
              onSelect={suggestion => { setLine(suggestion.line1); setPicked(`${suggestion.city} ${suggestion.region} ${suggestion.postal}`); }}
            />
            {picked && <Text tone="subdued" style={{ marginTop: 10 }}>Would fill: {picked}</Text>}
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
