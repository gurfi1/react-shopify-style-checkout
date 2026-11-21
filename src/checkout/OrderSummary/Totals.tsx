import { useState } from 'react';
import { TagIcon } from '../../icons';
import { Collapsible } from '../../primitives/Collapsible/Collapsible';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { cx } from '../../utils';
import type { Discount } from '../../types';
import { useCheckoutSettings } from '../CheckoutProvider';
import styles from './OrderSummary.module.css';

/** pending: no address yet. loading: rates are being fetched. free: nothing to pay. amount: a price. */
export type ShippingDisplay = 'pending' | 'loading' | 'free' | 'amount';

export type TotalsProps = {
  subtotal: number;
  /** Number of items, for "Subtotal · 3 items". */
  itemCount: number;
  /** The applied discount, or null. Its row and the savings line open and close. */
  discount?: Discount | null;
  /** What the shipping row shows. */
  shipping: ShippingDisplay;
  /** The shipping price, when `shipping` is "amount". */
  shippingAmount?: number | null;
  /** Label of the shipping row. Defaults to "Shipping"; the checkout passes "Pickup" for pick-up. */
  shippingLabel?: string;
  total: number;
  className?: string;
};

/** The summary's rows: subtotal, discount, shipping and the total with its currency code. */
export function Totals({ subtotal, itemCount, discount = null, shipping, shippingAmount, shippingLabel, total, className }: TotalsProps) {
  const { labels, money, currency } = useCheckoutSettings();
  // Keep the last discount on screen while its rows close.
  const [shown, setShown] = useState(discount);
  if (discount && discount !== shown) setShown(discount);
  return (
    <div className={cx(styles.totals, className)}>
      <div className={styles.row}>
        <span>{labels.subtotal(itemCount)}</span>
        <span>{money(subtotal)}</span>
      </div>
      <Collapsible open={discount != null} className={styles.collapsible}>
        <div className={styles.rowPad}>
          <span>
            {labels.discount}
            <span className={styles.code}>
              <TagIcon size={12} />
              <span>{shown?.code}</span>
            </span>
          </span>
          <span>−{money(shown?.amount ?? 0)}</span>
        </div>
      </Collapsible>
      <div className={styles.row}>
        <span>{shippingLabel ?? labels.shipping}</span>
        <span>
          {shipping === 'loading' && <Skeleton shape="pill" />}
          {shipping === 'pending' && <span className={styles.pending}>{labels.enterShippingAddress}</span>}
          {shipping === 'free' && labels.free}
          {shipping === 'amount' && money(shippingAmount ?? 0)}
        </span>
      </div>
      <div className={cx(styles.row, styles.total)}>
        <strong>{labels.total}</strong>
        <span>
          <small>{currency}</small>
          <strong>{money(total)}</strong>
        </span>
      </div>
      <Collapsible open={discount != null} className={styles.collapsible}>
        <div className={styles.savings}>
          <TagIcon />
          {labels.totalSavings} <span>{money(shown?.amount ?? 0)}</span>
        </div>
      </Collapsible>
    </div>
  );
}
