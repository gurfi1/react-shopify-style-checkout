import { useState } from 'react';
import { ChevronDownIcon } from '../../icons';
import { isContact, looksLikePhone, suggestEmailFix } from '../../lib/email';
import { CONTACT_FIELD_ID } from '../../lib/ids';
import { Collapsible } from '../../primitives/Collapsible/Collapsible';
import { Link } from '../../primitives/Text/Text';
import { TextField } from '../../primitives/TextField/TextField';
import { InfoButton, Tooltip } from '../../primitives/Tooltip/Tooltip';
import { useLabels } from '../CheckoutProvider';
import styles from './ContactField.module.css';

export type ContactFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  /** Called when the field loses focus, before the typo check. Validate here. */
  onBlur?: () => void;
  /** Emoji flag shown once a phone number is being typed. */
  flag?: string;
  /** Known domain typos and their corrections. Defaults to a short built-in list. */
  typos?: Record<string, string>;
  id?: string;
  className?: string;
};

/**
 * One field for an email address or a mobile number. Typing digits slides a country flag in at the end.
 * Leaving the field with a mistyped email domain ("gmial.com") offers the correction underneath.
 */
export function ContactField({ value, onChange, error, onBlur, flag = '🇺🇸', typos, id = CONTACT_FIELD_ID, className }: ContactFieldProps) {
  const labels = useLabels();
  const [suggestion, setSuggestion] = useState('');
  const [hintOpen, setHintOpen] = useState(false);
  const [before, , after] = labels.didYouMean(suggestion);

  return (
    <TextField
      id={id}
      name="email"
      className={className}
      label={labels.contactField}
      value={value}
      error={error}
      inputMode="email"
      autoComplete="email"
      autoCapitalize="off"
      spellCheck={false}
      onChange={event => {
        onChange(event.target.value);
        setHintOpen(false);
      }}
      onBlur={() => {
        onBlur?.();
        if (!value.trim() || !isContact(value)) return;
        const better = suggestEmailFix(value, typos);
        if (better) {
          setSuggestion(better);
          setHintOpen(true);
        }
      }}
      accessory={
        <>
          <span className={styles.flagChip} aria-hidden data-shown={looksLikePhone(value) ? '' : undefined}>
            <span>{flag}</span>
            <ChevronDownIcon size={10} />
          </span>
          <Tooltip content={labels.contactTooltip}>
            <InfoButton label={labels.moreInformation} />
          </Tooltip>
        </>
      }
      below={
        <Collapsible open={hintOpen}>
          <p className={styles.hint}>
            {before}
            <Link
              onClick={() => {
                onChange(suggestion);
                setHintOpen(false);
              }}
            >
              {suggestion}
            </Link>
            {after}
          </p>
        </Collapsible>
      }
    />
  );
}
