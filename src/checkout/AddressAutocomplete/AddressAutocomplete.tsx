import { SearchIcon } from '../../icons';
import { Combobox } from '../../primitives/Combobox/Combobox';
import type { AddressSuggestion } from '../../types';
import { useLabels } from '../CheckoutProvider';

export type AddressAutocompleteProps = {
  /** The street line as typed. */
  value: string;
  onChange: (value: string) => void;
  /** Looks up addresses for the typed text. */
  suggest: (query: string) => Promise<AddressSuggestion[]>;
  /** A suggestion was chosen. Fill the street, city, region and postal code from it. */
  onSelect: (suggestion: AddressSuggestion) => void;
  /** Shown after each suggestion, for example "United States". */
  countryName?: string;
  error?: string | null;
  onBlur?: () => void;
  id?: string;
  name?: string;
  className?: string;
};

/**
 * The address line with lookup: a `Combobox` with the magnifier icon, whose rows show the street in
 * black and the town, region, postal code and country in grey.
 */
export function AddressAutocomplete({ value, onChange, suggest, onSelect, countryName, error, onBlur, id, name, className }: AddressAutocompleteProps) {
  const labels = useLabels();
  return (
    <Combobox<AddressSuggestion>
      id={id}
      name={name}
      className={className}
      label={labels.address}
      value={value}
      error={error}
      accessory={<SearchIcon />}
      heading={labels.suggestions}
      closeLabel={labels.closeSuggestions}
      listLabel={labels.addressSuggestions}
      onChange={onChange}
      onBlur={onBlur}
      search={suggest}
      onSelect={onSelect}
      renderOption={option => (
        <>
          <strong>{option.line1}</strong>, {option.city}
          {option.region ? ' ' + option.region : ''} {option.postal}
          {countryName ? ', ' + countryName : ''}
        </>
      )}
    />
  );
}
