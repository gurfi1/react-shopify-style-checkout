import type { CSSProperties, Ref } from 'react';
import { cx } from '../../utils';
import styles from './ConfirmationCheck.module.css';

export type ConfirmationCheckProps = {
  /** Width and height in pixels. 96 while it draws at the centre of the screen, 50 beside the heading. */
  size?: number;
  /** Draw it: the circle over 540ms, then the tick over 380ms. Without it the finished icon simply shows. */
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLSpanElement>;
};

/** The order-confirmed icon: an accent circle with a tick. Remount it (change its `key`) to play the drawing again. */
export function ConfirmationCheck({ size = 50, animated = false, className, style, ref }: ConfirmationCheckProps) {
  return (
    <span ref={ref} className={cx(styles.wrap, className)} data-animated={animated ? '' : undefined} style={{ '--size': size + 'px', ...style } as CSSProperties}>
      <svg className={styles.icon} viewBox="0 0 50 50" aria-hidden>
        <circle cx="25" cy="25" r="23.5" pathLength={1} />
        <path d="M15.5 25.5l6.5 6.5 13-13.5" pathLength={1} />
      </svg>
    </span>
  );
}
