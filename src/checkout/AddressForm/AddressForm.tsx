import { COUNTRIES, findCountry, hasRegions } from '../../lib/address';
import { ADDRESS_FIELD_IDS } from '../../lib/ids';
import { FieldGrid, Stack } from '../../primitives/Layout/Layout';
import { SelectField } from '../../primitives/SelectField/SelectField';
import { TextField } from '../../primitives/TextField/TextField';
import type { Address, AddressSuggestion, Country } from '../../types';
import { AddressAutocomplete } from '../AddressAutocomplete/AddressAutocomplete';
import { useLabels } from '../CheckoutProvider';

export type AddressFormProps = {
  value: Address;
  /** Called with the whole next address and the field that changed. Changing the country clears the region. */
  onChange: (next: Address, field: keyof Address) => void;
  /** Countries to offer, each with its own address format. Defaults to the four built-in ones. */
  countries?: Country[];
  /** Error messages by field. */
  errors?: Partial<Record<keyof Address, string>>;
  /** Called when a field loses focus. Validate the postal code here. */
  onBlurField?: (field: keyof Address) => void;
  /** Address lookup. When given, the address line becomes a combobox with suggestions. */
  suggest?: (query: string, country: string) => Promise<AddressSuggestion[]>;
  /** Called instead of `onChange` when a suggestion is chosen, with the address filled in. */
  onSuggestion?: (next: Address) => void;
  /** Prefix for field ids and names, so two forms can share a page. The billing form uses "b-". */
  idPrefix?: string;
  className?: string;
};

/**
 * Address fields that follow the chosen country: the region select and its label ("State", "Province"),
 * the postal label ("ZIP code", "Postcode"), and a row that drops to two columns where there are no regions.
 */
export function AddressForm({ value, onChange, countries = COUNTRIES, errors = {}, onBlurField, suggest, onSuggestion, idPrefix = '', className }: AddressFormProps) {
  const labels = useLabels();
  const country = findCountry(countries, value.country);
  const regions = hasRegions(country);
  const id = (field: keyof Address) => idPrefix + ADDRESS_FIELD_IDS[field];
  const set = (field: keyof Address, text: string) => onChange(field === 'country' ? { ...value, country: text, region: '' } : { ...value, [field]: text }, field);

  const text = (field: keyof Address, label: string, autoComplete: string, extra?: { autoCapitalize?: string }) => (
    <TextField
      id={id(field)}
      name={id(field)}
      label={label}
      value={value[field]}
      error={errors[field]}
      autoComplete={autoComplete}
      onChange={event => set(field, event.target.value)}
      onBlur={() => onBlurField?.(field)}
      {...extra}
    />
  );

  const choose = (suggestion: AddressSuggestion) => {
    const next: Address = {
      ...value,
      line1: suggestion.line1,
      city: suggestion.city,
      region: country.regions?.some(region => region[0] === suggestion.region) ? suggestion.region : '',
      postal: suggestion.postal,
    };
    if (onSuggestion) onSuggestion(next);
    else onChange(next, 'line1');
  };

  return (
    <Stack className={className}>
      <SelectField
        id={id('country')}
        name={id('country')}
        label={labels.country}
        value={country.code}
        options={countries.map(item => ({ value: item.code, label: item.name }))}
        autoComplete="country"
        onChange={event => set('country', event.target.value)}
      />
      <FieldGrid columns={2}>
        {text('firstName', labels.firstName, 'given-name')}
        {text('lastName', labels.lastName, 'family-name')}
      </FieldGrid>
      {suggest ? (
        <AddressAutocomplete
          id={id('line1')}
          name={id('line1')}
          value={value.line1}
          error={errors.line1}
          countryName={country.name}
          onChange={line1 => set('line1', line1)}
          onBlur={() => onBlurField?.('line1')}
          suggest={query => suggest(query, country.code)}
          onSelect={choose}
        />
      ) : (
        text('line1', labels.address, 'address-line1')
      )}
      {text('line2', labels.apartment, 'address-line2')}
      <FieldGrid columns={regions ? 3 : 2}>
        {text('city', labels.city, 'address-level2')}
        {regions && (
          <SelectField
            id={id('region')}
            name={id('region')}
            label={country.regionLabel ?? ''}
            placeholder={country.regionLabel ?? ''}
            value={value.region}
            error={errors.region}
            options={(country.regions ?? []).map(([code, name]) => ({ value: code, label: name }))}
            autoComplete="address-level1"
            onChange={event => set('region', event.target.value)}
          />
        )}
        {text('postal', country.postalLabel, 'postal-code', { autoCapitalize: 'characters' })}
      </FieldGrid>
    </Stack>
  );
}
