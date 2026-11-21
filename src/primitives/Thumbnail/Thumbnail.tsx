import type { ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Thumbnail.module.css';

export type ThumbnailProps = {
  /** An `<img>` or `<svg>`. It fills the frame. */
  children?: ReactNode;
  /** Shown in the black badge on the top corner. Leave out for no badge. */
  quantity?: number;
  className?: string;
};

/** A 64px product image frame with a white border, and a quantity badge hanging off its top corner. */
export function Thumbnail({ children, quantity, className }: ThumbnailProps) {
  return (
    <div className={cx(styles.thumb, className)}>
      {children}
      {quantity !== undefined && <span className={styles.quantity}>{quantity}</span>}
    </div>
  );
}
