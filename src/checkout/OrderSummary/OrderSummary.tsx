import type { ReactNode } from 'react';
import { ChevronDownIcon } from '../../icons';
import { Collapsible } from '../../primitives/Collapsible/Collapsible';
import { cx } from '../../utils';
import type { Discount, LineItemData } from '../../types';
import { useCheckoutSettings, useLabels } from '../CheckoutProvider';
import { DiscountField } from './DiscountField';
import { LineItem } from './LineItem';
import styles from './OrderSummary.module.css';
import { Totals, type ShippingDisplay } from './Totals';

export type OrderSummaryProps = {
  items: LineItemData[];
  subtotal: number;
  discount?: Discount | null;
  shipping: ShippingDisplay;
  shippingAmount?: number | null;
  shippingLabel?: string;
  total: number;
  /** Shows the discount field. Leave out for a read-only summary. */
  onApplyDiscount?: (code: string) => Promise<void>;
  onRemoveDiscount?: () => void;
  /** Set to false to fold the discount field away, as the thank-you page does. */
  discountOpen?: boolean;
  className?: string;
};

/** The order summary: the products, the discount code field and the totals. */
export function OrderSummary({ items, subtotal, discount = null, shipping, shippingAmount, shippingLabel, total, onApplyDiscount, onRemoveDiscount, discountOpen = true, className }: OrderSummaryProps) {
  const { money } = useCheckoutSettings();
  return (
    <div className={className}>
      <div>
        {items.map(item => (
          <LineItem key={item.id} title={item.title} variant={item.variant} quantity={item.quantity} price={money(item.price)} image={item.image} />
        ))}
      </div>
      {onApplyDiscount && (
        <Collapsible open={discountOpen}>
          <DiscountField onApply={onApplyDiscount} applied={discount?.code ?? null} onRemove={onRemoveDiscount} />
        </Collapsible>
      )}
      <Totals
        subtotal={subtotal}
        itemCount={items.reduce((count, item) => count + item.quantity, 0)}
        discount={discount}
        shipping={shipping}
        shippingAmount={shippingAmount}
        shippingLabel={shippingLabel}
        total={total}
      />
    </div>
  );
}

export type OrderSummaryToggleProps = {
  open: boolean;
  onToggle: () => void;
  /** Already formatted, or a placeholder while it loads. */
  total: ReactNode;
  /** Id of the element it opens, for `aria-controls`. */
  controls?: string;
  className?: string;
};

/** The bar shown on small screens in place of the summary: its label, a chevron that flips, and the total. */
export function OrderSummaryToggle({ open, onToggle, total, controls, className }: OrderSummaryToggleProps) {
  const labels = useLabels();
  return (
    <button type="button" className={cx(styles.toggle, className)} aria-expanded={open} aria-controls={controls} onClick={onToggle}>
      <span className={styles.toggleLabel}>
        {labels.orderSummary}
        <ChevronDownIcon />
      </span>
      <strong><bdi>{total}</bdi></strong>
    </button>
  );
}
