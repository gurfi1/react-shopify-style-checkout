import { useEffect, useRef, type ReactNode } from 'react';
import { AlertIcon } from '../../icons';
import { prefersReducedMotion } from '../../lib/motion';
import { cx } from '../../utils';
import { Collapsible } from '../Collapsible/Collapsible';
import styles from './Banner.module.css';

export type BannerProps = {
  open: boolean;
  /** Bold lead-in. */
  title?: ReactNode;
  children?: ReactNode;
  /** Scroll the banner into view and move focus to it when it opens, so it is seen and announced. */
  focusOnOpen?: boolean;
  className?: string;
  id?: string;
};

/**
 * The critical banner: red tint, alert icon. It opens by pushing content down and dropping in 8px,
 * and by default takes focus so screen readers announce it.
 */
export function Banner({ open, title, children, focusOnOpen = true, className, id }: BannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || !focusOnOpen || !ref.current) return;
    ref.current.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    ref.current.focus({ preventScroll: true });
  }, [open, focusOnOpen]);
  return (
    <Collapsible open={open} id={id}>
      <div ref={ref} className={cx(styles.banner, className)} role="alert" tabIndex={-1} data-open={open ? '' : undefined}>
        <AlertIcon />
        <div>
          {title != null && <b>{title}</b>} {children}
        </div>
      </div>
    </Collapsible>
  );
}
