import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Collapsible.module.css';

export type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  children: ReactNode;
};

/**
 * Opens and closes its content by animating height, with no measuring.
 * Closed content stays in the page but is hidden from sight, the keyboard and screen readers.
 */
export function Collapsible({ open, className, children, ...rest }: CollapsibleProps) {
  return (
    <div className={cx(styles.collapsible, className)} data-open={open ? '' : undefined} {...rest}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
