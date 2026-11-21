import { useState } from 'react';
import { cx } from '../../utils';
import styles from './FieldError.module.css';

export type FieldErrorProps = {
  /** The message. Empty or missing closes it. */
  message?: string | null;
  /** Id to point `aria-describedby` at. */
  id?: string;
  className?: string;
};

/** The red message that opens under a field and closes again when the error is cleared. */
export function FieldError({ message, id, className }: FieldErrorProps) {
  // Keep the last message on screen while the row closes.
  const [shown, setShown] = useState(message ?? '');
  if (message && message !== shown) setShown(message);
  return (
    <div className={cx(styles.error, className)} id={id} data-open={message ? '' : undefined}>
      <div>
        <span>{shown}</span>
      </div>
    </div>
  );
}
