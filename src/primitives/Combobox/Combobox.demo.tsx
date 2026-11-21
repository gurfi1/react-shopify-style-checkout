import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { SearchIcon } from '../../icons';
import { Text } from '../Text/Text';
import { Combobox } from './Combobox';

const CITIES = ['Portland, Oregon', 'Portland, Maine', 'Porto, Portugal', 'Port Louis, Mauritius', 'San Francisco, California', 'Santiago, Chile', 'Seattle, Washington'];

// Stands in for a lookup service: answers after a moment, like a network call.
const searchCities = (query: string) =>
  new Promise<string[]>(resolve => setTimeout(() => resolve(CITIES.filter(city => city.toLowerCase().includes(query.toLowerCase())).slice(0, 5)), 150));

const demo: Demo = {
  title: 'Combobox',
  group: 'Components',
  order: 12,
  summary: 'A text field with an async suggestion list. The list drops in 8px below the field. Arrow keys move, Enter chooses, Escape or leaving the field closes. When lookups overlap, only the latest answer is shown.',
  usage: `<Combobox
  label="City"
  value={text}
  onChange={setText}
  search={query => fetch('/cities?q=' + query).then(r => r.json())}
  renderOption={city => <><strong>{city.name}</strong>, {city.country}</>}
  onSelect={city => setText(city.name)}
/>`,
  props: [
    ['label', 'string', 'Placeholder while empty, small label once filled.'],
    ['value / onChange', 'string / (value) => void', 'The typed text.'],
    ['search', '(query) => Promise<T[]>', 'Looks up suggestions. Resolve to [] to show none.'],
    ['renderOption', '(option) => ReactNode', 'One row. <strong> parts are black; the rest is grey.'],
    ['onSelect', '(option) => void', 'A suggestion was chosen.'],
    ['minChars', 'number', 'Characters to type before the first lookup. Default 3.'],
    ['heading, closeLabel, listLabel', 'string', 'Wording of the list’s heading and accessible names.'],
  ],
  Example: () => {
    const [text, setText] = useState('');
    const [chosen, setChosen] = useState('');
    return (
      <States>
        <State label="Type “por” or “san”" width={360}>
          <div style={{ minHeight: 280 }}>
            <Combobox
              label="City"
              value={text}
              onChange={setText}
              search={searchCities}
              accessory={<SearchIcon />}
              renderOption={city => {
                const [name, rest] = city.split(', ');
                return <><strong>{name}</strong>, {rest}</>;
              }}
              onSelect={city => { setText(city); setChosen(city); }}
            />
            {chosen && <Text tone="subdued" style={{ marginTop: 10 }}>Chosen: {chosen}</Text>}
          </div>
        </State>
      </States>
    );
  },
};

export default demo;
