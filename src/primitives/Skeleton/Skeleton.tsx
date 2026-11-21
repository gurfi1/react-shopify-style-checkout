import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils';
import styles from './Skeleton.module.css';

export type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  /** `block`: a bar you size yourself. `pill`: the 46×12 inline placeholder for a price. `circle`: an 18px dot for a radio. */
  shape?: 'block' | 'pill' | 'circle';
  width?: number | string;
  height?: number | string;
};

/** A grey placeholder that pulses while content loads. */
export function Skeleton({ shape = 'block', width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      className={cx(styles.skeleton, shape !== 'block' && styles[shape], className)}
      style={{ width, height, ...style } as CSSProperties}
      aria-hidden
      {...rest}
    />
  );
}
