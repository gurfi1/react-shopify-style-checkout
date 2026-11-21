import { useEffect, useId, useRef, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { useSuggestions } from '../../hooks/useSuggestions';
import { CloseIcon } from '../../icons';
import { Field } from '../Field/Field';
import styles from './Combobox.module.css';

export type ComboboxProps<T> = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onSelect' | 'placeholder'> & {
  /** Placeholder while empty, small label once filled. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Looks up suggestions for the typed text. Resolve to [] to show none. */
  search: (query: string) => Promise<T[]>;
  /** Called when a suggestion is chosen with the pointer or Enter. */
  onSelect: (option: T) => void;
  /** One row of the list. Wrap the leading part in `<strong>` to make it stand out. */
  renderOption: (option: T) => ReactNode;
  /** How many characters to type before looking up. */
  minChars?: number;
  /** Small uppercase heading above the list. */
  heading?: string;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Accessible name of the list. */
  listLabel?: string;
  error?: string | null;
  accessory?: ReactNode;
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

/**
 * A text field with a suggestion list underneath. Arrow keys move through the list, Enter chooses,
 * Escape or leaving the field closes it. If lookups overlap, only the latest one's results are shown.
 */
export function Combobox<T>({
  label, value, onChange, search, onSelect, renderOption, minChars = 3,
  heading = 'Suggestions', closeLabel = 'Close suggestions', listLabel = 'Suggestions',
  error, accessory, className, id, onBlur, onKeyDown, ref, ...input
}: ComboboxProps<T>) {
  const generated = useId();
  const fieldId = id ?? generated;
  const listId = fieldId + '-list';
  const errorId = 'err-' + fieldId;
  const { options, open, active, setActive, query, close, move } = useSuggestions(search, minChars);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(blurTimer.current), []);

  const choose = (index: number) => {
    const option = options[index];
    if (option === undefined) return;
    close();
    onSelect(option);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (!open) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); move(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
    else if (event.key === 'Enter') { event.preventDefault(); if (active < 0) close(); else choose(active); }
    else if (event.key === 'Escape') close();
  };

  return (
    <Field
      error={error}
      errorId={errorId}
      accessory={accessory}
      className={className}
      below={
        open && (
          // Keep focus in the field while the list is clicked.
          <div className={styles.pop} onMouseDown={event => event.preventDefault()}>
            <div className={styles.head}>
              <span>{heading}</span>
              <button type="button" className={styles.close} aria-label={closeLabel} onClick={close}>
                <CloseIcon size={12} strokeWidth={1.3} />
              </button>
            </div>
            <ul className={styles.list} id={listId} role="listbox" aria-label={listLabel}>
              {options.map((option, index) => (
                <li
                  key={index}
                  id={`${fieldId}-option-${index}`}
                  role="option"
                  aria-selected={index === active}
                  data-active={index === active ? '' : undefined}
                  onMouseOver={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  {/* Each suggestion keeps its own direction, whatever the page's. */}
                  <bdi>{renderOption(option)}</bdi>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    >
      <input
        autoComplete="off"
        {...input}
        ref={ref}
        id={fieldId}
        type="text"
        dir={input.dir ?? (value !== '' ? 'auto' : undefined)}
        placeholder={label}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${fieldId}-option-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={event => {
          onChange(event.target.value);
          query(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={event => {
          onBlur?.(event);
          blurTimer.current = setTimeout(close, 150);
        }}
      />
      <label htmlFor={fieldId}>{label}</label>
    </Field>
  );
}
