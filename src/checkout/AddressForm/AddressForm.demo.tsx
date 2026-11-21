import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { COUNTRIES, emptyAddress, findCountry } from '../../lib/address';
import { addressErrors } from '../../lib/validate';
import { Button } from '../../primitives/Button/Button';
import type { Address } from '../../types';
import { demoSuggest } from '../demoData';
import { AddressForm } from './AddressForm';

const demo: Demo = {
  title: 'AddressForm',
  group: 'Checkout blocks',
  order: 4,
  summary: 'Address fields that follow the country. Switch to Canada and “State” becomes “Province” and “ZIP code” becomes “Postal code”; switch to the United Kingdom and the region field goes, leaving two columns. It holds no state, so the same component serves shipping and billing.',
  usage: `const [address, setAddress] = useState(() => emptyAddress('US'));

<AddressForm
  value={address}
  onChange={(next, field) => setAddress(next)}
  errors={errors}
  countries={COUNTRIES}
  suggest={(query, country) => api.suggestAddresses(query, country)}
/>`,
  props: [
    ['value', 'Address', '{ country, firstName, lastName, line1, line2, city, region, postal }. Region is the state or province code.'],
    ['onChange', '(next, field) => void', 'The whole next address and which field changed. A new country clears the region.'],
    ['countries', 'Country[]', 'Each with its region list, labels and postal pattern. Defaults to US, Canada, UK, Israel.'],
    ['errors', 'Partial<Record<keyof Address, string>>', 'Messages by field.'],
    ['onBlurField', '(field) => void', 'Validate the postal code here.'],
    ['suggest', '(query, country) => Promise<AddressSuggestion[]>', 'Turns the address line into a combobox.'],
    ['onSuggestion', '(next) => void', 'Called instead of onChange when a suggestion fills the form.'],
    ['idPrefix', 'string', 'Prefix for ids and names, so two forms can share a page.'],
  ],
  Example: () => {
    const [address, setAddress] = useState<Address>(() => emptyAddress('US'));
    const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
    return (
      <States>
        <State label="Change the country; press Check to see the errors" width={500}>
          <AddressForm
            idPrefix="demo-address-"
            value={address}
            errors={errors}
            suggest={demoSuggest}
            onChange={(next, field) => { setAddress(next); setErrors(current => ({ ...current, [field]: undefined })); }}
          />
          <Button style={{ marginTop: 14 }} onClick={() => setErrors(addressErrors(address, findCountry(COUNTRIES, address.country)))}>Check</Button>
        </State>
      </States>
    );
  },
};

export default demo;
