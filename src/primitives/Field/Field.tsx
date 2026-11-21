import type { ReactNode } from 'react';
import { cx } from '../../utils';
import { FieldError } from '../FieldError/FieldError';
import styles from './Field.module.css';

export type FieldProps = {
  /** The error message. Turns the border red and opens the message underneath. */
  error?: string | null;
  /** Id for the error message, to point `aria-describedby` at. */
  errorId?: string;
  /** Icon or tooltip button shown at the end of the field. */
  accessory?: ReactNode;
  /** Content placed under the field, inside the same wrapper: a hint, a suggestion list. */
  below?: ReactNode;
  className?: string;
  fieldClassName?: string;
  /** The control and its label: `<input>` or `<select>` followed by `<label>`. */
  children: ReactNode;
};

/**
 * The bordered box shared by `TextField`, `SelectField` and `Combobox`: border, focus ring, error state.
 * Put an `<input>` (with a placeholder) or `<select>` and then a `<label>` inside it.
 */
export function Field({ error, errorId, accessory, below, className, fieldClassName, children }: FieldProps) {
  return (
    <div className={cx(styles.wrap, className)} data-error={error ? '' : undefined}>
      <div className={cx(styles.field, fieldClassName)}>
        {children}
        {accessory != null && <span className={styles.accessory}>{accessory}</span>}
      </div>
      {below}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

/** Class for a chevron placed inside a `Field` holding a select. */
export const fieldChevronClass = styles.chevron;
