import { useId, type ReactNode, type Ref, type SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '../../icons';
import { Field, fieldChevronClass } from '../Field/Field';

export type SelectOption = { value: string; label: string };

export type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'children'> & {
  /** Small label above the value once one is chosen. */
  label: string;
  /** The chosen value; '' means nothing chosen yet. */
  value: string;
  options: SelectOption[];
  /** Text of the empty first option, shown in grey until something is chosen. Leave out when a value is always set. */
  placeholder?: string;
  error?: string | null;
  below?: ReactNode;
  className?: string;
  ref?: Ref<HTMLSelectElement>;
};

/** A select styled as a `TextField`, with a chevron and the same floating label. */
export function SelectField({ label, value, options, placeholder, error, below, className, id, ref, ...select }: SelectFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const errorId = 'err-' + fieldId;
  return (
    <Field error={error} errorId={errorId} below={below} className={className}>
      <select
        {...select}
        ref={ref}
        id={fieldId}
        value={value}
        data-has-value={value !== '' ? '' : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : select['aria-describedby']}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor={fieldId}>{label}</label>
      <ChevronDownIcon className={fieldChevronClass} />
    </Field>
  );
}
