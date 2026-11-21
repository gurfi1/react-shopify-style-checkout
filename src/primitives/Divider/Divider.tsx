import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Divider.module.css';

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  /** Text centred on the line, for example "OR". Leave out for a plain line. */
  children?: ReactNode;
};

/** A hairline across the container, optionally with a centred label. */
export function Divider({ className, children, ...rest }: DividerProps) {
  return (
    <div className={cx(styles.divider, className)} role={children == null ? 'separator' : undefined} {...rest}>
      {children}
    </div>
  );
}
