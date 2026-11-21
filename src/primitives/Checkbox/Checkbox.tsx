import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import styles from './Checkbox.module.css';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  /** The label text beside the box. */
  children: ReactNode;
  /** Class for the outer `<label>`. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

/** An 18px checkbox. When ticked it fills with the accent colour and the tick draws itself as a stroke. */
export function Checkbox({ children, className, hidden, style, ref, ...input }: CheckboxProps) {
  return (
    <label className={cx(styles.check, className)} hidden={hidden} style={style}>
      <input ref={ref} type="checkbox" {...input} />
      <span className={styles.box}>
        <svg viewBox="0 0 14 14" aria-hidden>
          <path d="M3 7.4l2.7 2.6L11 4.4" pathLength={1} />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}
