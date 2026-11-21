import type { CSSProperties } from 'react';
import { cx } from '../../utils';
import styles from './ConfirmationCode.module.css';

export type ConfirmationCodeProps = {
  code: string;
  /** Hidden until true, then the characters appear. */
  active?: boolean;
  /** Milliseconds before the first character. */
  delay?: number;
  className?: string;
};

/** A code whose characters appear one at a time, 13ms apart, each rising and settling with a slight overshoot. */
export function ConfirmationCode({ code, active = true, delay = 300, className }: ConfirmationCodeProps) {
  return (
    <span className={cx(styles.code, className)} data-active={active ? '' : undefined} style={{ '--delay': delay + 'ms' } as CSSProperties}>
      <span className={styles.srOnly}>{code}</span>
      {[...code].map((character, index) => (
        <span key={index} aria-hidden style={{ '--i': index } as CSSProperties}>
          {character}
        </span>
      ))}
    </span>
  );
}
