import type { InputHTMLAttributes, Ref } from 'react';
import { cx } from '../../utils';
import styles from './Radio.module.css';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { ref?: Ref<HTMLInputElement> };

/** An 18px radio. Selecting it thickens the border from 1px grey to 6px accent, leaving a white centre. */
export function Radio({ className, ref, ...input }: RadioProps) {
  return <input ref={ref} type="radio" className={cx(styles.radio, className)} {...input} />;
}
