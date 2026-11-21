import type { CSSProperties, ReactNode } from 'react';
import { Divider } from '../../primitives/Divider/Divider';
import { cx } from '../../utils';
import { useLabels } from '../CheckoutProvider';
import styles from './ExpressCheckout.module.css';

export type ExpressButton = {
  id: string;
  /** The button's text, and its accessible name when `content` replaces the text. */
  label: string;
  /** Shown in place of the text: a wallet's logo, for example. */
  content?: ReactNode;
  /** Button colour. Each wallet has its own. */
  background?: string;
  /** Text colour. Default white. */
  color?: string;
  onClick?: () => void;
};

export type ExpressCheckoutProps = {
  buttons: ExpressButton[];
  /** Show the buttons as grey pulsing placeholders while the wallets load. */
  loading?: boolean;
  /** Text above the buttons. Defaults to the "Express checkout" label. */
  label?: string;
  /** Text on the line underneath. Pass null for no line. Defaults to the "OR" label. */
  dividerLabel?: string | null;
  className?: string;
};

/**
 * A row of wallet buttons above the form. The buttons here are placeholders marking where a payment
 * provider's own wallet buttons go. While `loading` they pulse grey, then their colours fade in.
 */
export function ExpressCheckout({ buttons, loading = false, label, dividerLabel, className }: ExpressCheckoutProps) {
  const labels = useLabels();
  const divider = dividerLabel === undefined ? labels.or : dividerLabel;
  return (
    <>
      <div className={cx(styles.express, className)}>
        <p className={styles.label}>{label ?? labels.expressCheckout}</p>
        <div className={styles.buttons} data-loading={loading ? '' : undefined} style={{ '--count': buttons.length } as CSSProperties}>
          {buttons.map(button => (
            <button
              key={button.id}
              type="button"
              onClick={button.onClick}
              aria-label={button.content != null ? button.label : undefined}
              style={{ '--express-bg': button.background, '--express-fg': button.color } as CSSProperties}
            >
              {button.content != null ? <span className={styles.content}>{button.content}</span> : button.label}
            </button>
          ))}
        </div>
      </div>
      {divider !== null && <Divider className={styles.divider}>{divider}</Divider>}
    </>
  );
}
