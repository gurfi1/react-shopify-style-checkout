import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Reveal.module.css';

export type RevealProps = HTMLAttributes<HTMLDivElement> & {
  /** Position in the sequence, from 0. Each step starts 90ms after the one before. */
  index?: number;
  /** Hidden until true, then it rises in. */
  active?: boolean;
  children: ReactNode;
};

/** Content that rises 10px into place and fades in. Give siblings rising `index` values to stagger them. */
export function Reveal({ index = 0, active = true, className, style, children, ...rest }: RevealProps) {
  return (
    <div className={cx(styles.reveal, className)} data-active={active ? '' : undefined} style={{ '--r': index, ...style } as CSSProperties} {...rest}>
      {children}
    </div>
  );
}
