import { Fragment } from 'react';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { cx } from '../../utils';
import styles from './CheckoutSkeleton.module.css';

export type CheckoutSkeletonProps = {
  /** Show the express-checkout row: a short label and three button shapes. */
  express?: boolean;
  /** How many heading-and-two-lines sections to show. */
  sections?: number;
  className?: string;
};

/**
 * The form column while the checkout loads: grey shapes where the express buttons and the first
 * sections will be. It fades in 160ms after it mounts, so a fast load never flashes it, and pulses while it waits.
 */
export function CheckoutSkeleton({ express = true, sections = 2, className }: CheckoutSkeletonProps) {
  return (
    <div className={cx(styles.skeleton, className)} aria-hidden>
      {express && (
        <>
          <Skeleton className={styles.label} />
          <div className={styles.buttons}>
            <Skeleton className={styles.button} />
            <Skeleton className={styles.button} />
            <Skeleton className={styles.button} />
          </div>
        </>
      )}
      {Array.from({ length: sections }, (_, index) => (
        <Fragment key={index}>
          {(express || index > 0) && <div className={styles.rule} />}
          <div className={styles.section}>
            <Skeleton className={styles.heading} />
            <Skeleton className={styles.line} />
            <Skeleton className={styles.line} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export type OrderSummarySkeletonProps = {
  /** How many product shapes to show. */
  items?: number;
  className?: string;
};

/** The order summary while the checkout loads: a product shape, three rows and the total. */
export function OrderSummarySkeleton({ items = 1, className }: OrderSummarySkeletonProps) {
  return (
    <div className={cx(styles.summary, className)} aria-hidden>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className={styles.item}>
          <Skeleton className={styles.thumb} />
          <div className={styles.itemText}>
            <Skeleton className={styles.title} />
            <Skeleton className={styles.variant} />
          </div>
          <Skeleton className={styles.price} />
        </div>
      ))}
      <div className={styles.rows}>
        {[0, 1, 2].map(row => (
          <div key={row} className={styles.row}>
            <Skeleton className={styles.cell} />
            <Skeleton className={styles.cell} />
          </div>
        ))}
        <div className={cx(styles.row, styles.total)}>
          <Skeleton className={styles.totalCell} />
          <Skeleton className={styles.totalCell} />
        </div>
      </div>
    </div>
  );
}
