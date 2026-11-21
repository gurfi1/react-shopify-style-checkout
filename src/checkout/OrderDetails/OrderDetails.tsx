import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './OrderDetails.module.css';

export type OrderDetail = {
  title: string;
  /** One entry per line. */
  lines: ReactNode[];
};

export type OrderDetailsProps = {
  /** The left and the right column, each a list of titled blocks. */
  columns: [OrderDetail[], OrderDetail[]];
  className?: string;
  style?: CSSProperties;
};

/** Titled blocks of order facts in two columns, one column below 480px. */
export function OrderDetails({ columns, className, style }: OrderDetailsProps) {
  return (
    <div className={cx(styles.details, className)} style={style}>
      {columns.map((column, index) => (
        <div key={index} className={styles.column}>
          {column.map(detail => (
            <div key={detail.title}>
              <h4>{detail.title}</h4>
              <p>
                {detail.lines.map((line, position) => (
                  <Fragment key={position}>
                    {position > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
