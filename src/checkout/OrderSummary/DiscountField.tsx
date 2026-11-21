import { useState, type FormEvent } from 'react';
import { Button } from '../../primitives/Button/Button';
import { Collapsible } from '../../primitives/Collapsible/Collapsible';
import { Tag } from '../../primitives/Tag/Tag';
import { TextField } from '../../primitives/TextField/TextField';
import { useLabels } from '../CheckoutProvider';
import styles from './OrderSummary.module.css';

export type DiscountFieldProps = {
  /**
   * Applies a code (already trimmed and upper-cased). Resolve when it is accepted;
   * reject with an Error whose message is shown under the field.
   */
  onApply: (code: string) => Promise<void>;
  /** The code currently applied, shown as a removable tag. */
  applied?: string | null;
  onRemove?: () => void;
  id?: string;
  className?: string;
};

/**
 * The discount code field. Apply stays grey until something is typed, shows a spinner while the code
 * is checked, and the accepted code appears underneath as a tag that pops in.
 */
export function DiscountField({ onApply, applied = null, onRemove, id = 'discount', className }: DiscountFieldProps) {
  const labels = useLabels();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Keep the last code on screen while the tag row closes, and count applications so the tag pops in each time.
  const [previous, setPrevious] = useState(applied);
  const [shown, setShown] = useState(applied);
  const [applications, setApplications] = useState(0);
  if (applied !== previous) {
    setPrevious(applied);
    if (applied) {
      setShown(applied);
      setApplications(count => count + 1);
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const entered = code.trim().toUpperCase();
    if (!entered || loading) return;
    setLoading(true);
    try {
      await onApply(entered);
      setCode('');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <form className={styles.discount} noValidate onSubmit={submit}>
        <TextField
          id={id}
          name="discount"
          className={styles.discountField}
          label={labels.discountField}
          value={code}
          error={error}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          onChange={event => {
            setCode(event.target.value);
            setError(null);
          }}
        />
        <Button type="submit" variant="quiet" disabled={code.trim() === ''} loading={loading}>
          {labels.apply}
        </Button>
      </form>
      <Collapsible open={applied != null}>
        <div className={styles.tags}>
          {shown != null && (
            <Tag key={applications} onRemove={onRemove} removeLabel={labels.removeDiscount}>
              {shown}
            </Tag>
          )}
        </div>
      </Collapsible>
    </div>
  );
}
