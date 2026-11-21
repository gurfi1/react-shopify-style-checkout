import type { SVGProps } from 'react';
import { cx } from '../../utils';
import styles from './Spinner.module.css';

export type SpinnerProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  /** Width and height in pixels. */
  size?: number;
  /** Set to false to hold it still, for example while it is faded out. */
  active?: boolean;
};

/** The loading arc. It takes the current text colour. */
export function Spinner({ size = 20, active = true, className, ...rest }: SpinnerProps) {
  return (
    <svg className={cx(styles.spinner, className)} width={size} height={size} viewBox="0 0 20 20" aria-hidden data-active={active ? '' : undefined} {...rest}>
      <circle cx="10" cy="10" r="8" pathLength={100} />
    </svg>
  );
}
