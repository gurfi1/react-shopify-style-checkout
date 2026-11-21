import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Card.module.css';

type DivProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

/** A bordered, rounded container. Put media straight inside it and text inside a `CardBody`. */
export function Card({ className, children, ...rest }: DivProps) {
  return (
    <div className={cx(styles.card, className)} {...rest}>
      {children}
    </div>
  );
}

/** The padded part of a `Card`. A level-3 heading inside it sits 6px above what follows. */
export function CardBody({ className, children, ...rest }: DivProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}
