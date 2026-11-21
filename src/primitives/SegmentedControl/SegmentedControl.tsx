import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './SegmentedControl.module.css';

export type SegmentedOption = { value: string; label: ReactNode; icon?: ReactNode };

export type SegmentedControlProps = {
  /** Shared `name` of the radios. */
  name: string;
  value: string;
  onChange: (value: string, index: number) => void;
  options: SegmentedOption[];
  /** Accessible name of the group. */
  label: string;
  className?: string;
  id?: string;
};

/** A switch between a few options. A white pill slides under the selected one. Built on native radios. */
export function SegmentedControl({ name, value, onChange, options, label, className, id }: SegmentedControlProps) {
  const index = Math.max(0, options.findIndex(option => option.value === value));
  return (
    <div
      className={cx(styles.segmented, className)}
      id={id}
      role="radiogroup"
      aria-label={label}
      style={{ '--index': index, '--count': options.length } as CSSProperties}
    >
      <span className={styles.pill} aria-hidden />
      {options.map((option, position) => (
        <label key={option.value}>
          <input type="radio" name={name} value={option.value} checked={option.value === value} onChange={() => onChange(option.value, position)} />
          <span>
            {option.icon}
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
