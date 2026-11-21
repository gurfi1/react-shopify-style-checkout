import type { ReactNode } from 'react';
import { cx } from '../../utils';
import { Collapsible } from '../Collapsible/Collapsible';
import { Radio } from '../Radio/Radio';
import styles from './ChoiceList.module.css';

export type ChoiceOption = {
  value: string;
  /** Bold first line. */
  title: ReactNode;
  /** Second line, in normal text. */
  description?: ReactNode;
  /** Third line, in grey. */
  detail?: ReactNode;
  /** Content at the end of the row: a price, badges. Use `ChoiceEnd` for a price with a note under it. */
  end?: ReactNode;
  /** Content that opens under the row while it is selected. */
  panel?: ReactNode;
  /** Extra class for this option's panel. */
  panelClassName?: string;
};

export type ChoiceListProps = {
  /** Shared `name` of the radios. */
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ChoiceOption[];
  /** Accessible name of the group. */
  label: string;
  className?: string;
  id?: string;
};

/**
 * Radio rows joined into one bordered box. The selected row gets an accent border and a tint.
 * Options with a `panel` open it underneath while selected.
 */
export function ChoiceList({ name, value, onChange, options, label, className, id }: ChoiceListProps) {
  const hasPanels = options.some(option => option.panel != null);
  return (
    <div className={cx(styles.list, className)} id={id} role="radiogroup" aria-label={label}>
      {options.map(option => {
        const selected = option.value === value;
        const row = (
          <label
            key={option.value}
            className={styles.choice}
            data-selected={selected ? '' : undefined}
            data-one-line={option.description == null && option.detail == null ? '' : undefined}
          >
            <Radio name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} />
            <span className={styles.main}>
              <b>{option.title}</b>
              {option.description != null && <span>{option.description}</span>}
              {option.detail != null && <span className={styles.subdued}>{option.detail}</span>}
            </span>
            {option.end}
          </label>
        );
        if (!hasPanels) return row;
        const open = selected && option.panel != null;
        return (
          <div key={option.value} className={styles.item} data-panel-open={open ? '' : undefined}>
            {row}
            {option.panel != null && (
              <Collapsible open={open}>
                <div className={cx(styles.panel, option.panelClassName)}>{option.panel}</div>
              </Collapsible>
            )}
          </div>
        );
      })}
    </div>
  );
}

export type ChoiceEndProps = {
  /** Bold line, usually a price. */
  title: ReactNode;
  /** Grey line underneath. */
  detail?: ReactNode;
};

/** A right-aligned price with an optional grey note under it, for a choice row's `end`. */
export function ChoiceEnd({ title, detail }: ChoiceEndProps) {
  return (
    <span className={styles.end}>
      <b>{title}</b>
      {detail != null && <span className={styles.subdued}>{detail}</span>}
    </span>
  );
}
