import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './OrderDetails.module.css';

export type OrderDetail = {
  title: string;
  /** One entry per line. A plain string is isolated so it keeps its own text direction. */
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
                    {/* Plain text is data (a name, an address) and keeps its own direction. Anything richer is left to the caller. */}
                    {typeof line === 'string' ? <bdi>{line}</bdi> : line}
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
