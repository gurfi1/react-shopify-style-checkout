import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { prefersReducedMotion } from '../../lib/motion';
import { cx } from '../../utils';
import { Spinner } from '../Spinner/Spinner';
import styles from './Button.module.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** `primary`: the 50px accent button. `quiet`: the 49px apply button, grey while disabled and accent once enabled. */
  variant?: 'primary' | 'quiet';
  /** Swaps the label for a spinner and ignores clicks. */
  loading?: boolean;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

/**
 * The checkout's button. While `loading`, the label cross-fades to a spinner without the button changing size.
 * When a text label changes ("Pay now" to "Complete order") it fades out and back in.
 */
export function Button({ variant = 'primary', loading = false, fullWidth = false, className, type = 'button', children, ref, ...rest }: ButtonProps) {
  const text = typeof children === 'string' ? children : null;
  const [shown, setShown] = useState(text);
  const swapping = text !== null && shown !== null && text !== shown;

  useEffect(() => {
    if (text === shown) return;
    if (text === null || shown === null) { setShown(text); return; }
    const timer = setTimeout(() => setShown(text), prefersReducedMotion() ? 0 : 100);
    return () => clearTimeout(timer);
  }, [text, shown]);

  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      data-loading={loading ? '' : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className={styles.label} data-swapping={swapping ? '' : undefined}>
        {text !== null && shown !== null ? shown : children}
      </span>
      <Spinner className={styles.spinner} size={variant === 'quiet' ? 18 : 20} active={loading} />
    </button>
  );
}
