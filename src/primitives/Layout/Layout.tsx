import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Layout.module.css';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  /** Space between children in pixels. The form's rhythm is 10. */
  gap?: number;
  children: ReactNode;
};

/** Children stacked vertically with even space between them. */
export function Stack({ gap, className, style, children, ...rest }: StackProps) {
  return (
    <div className={cx(styles.stack, className)} style={gap === undefined ? style : ({ '--gap': gap + 'px', ...style } as CSSProperties)} {...rest}>
      {children}
    </div>
  );
}

export type FieldGridProps = HTMLAttributes<HTMLDivElement> & {
  /** Fields per row. A three-column row becomes one column when the form is narrower than 420px. */
  columns: 2 | 3;
  children: ReactNode;
};

/** A row of fields, 10px apart. */
export function FieldGrid({ columns, className, children, ...rest }: FieldGridProps) {
  return (
    <div className={cx(styles.container, className)} {...rest}>
      <div className={cx(styles.grid, columns === 3 ? styles.columns3 : styles.columns2)}>{children}</div>
    </div>
  );
}
