import type { ReactNode } from 'react';
import { Thumbnail } from '../../primitives/Thumbnail/Thumbnail';
import { cx } from '../../utils';
import styles from './OrderSummary.module.css';

export type LineItemProps = {
  title: ReactNode;
  /** Grey second line: "Tan / Large". */
  variant?: ReactNode;
  quantity?: number;
  /** Already formatted. */
  price: ReactNode;
  /** An `<img>` or `<svg>` for the thumbnail. */
  image?: ReactNode;
  className?: string;
};

/** One product in the order summary: thumbnail with a quantity badge, title and variant, price on the right. */
export function LineItem({ title, variant, quantity, price, image, className }: LineItemProps) {
  return (
    <div className={cx(styles.item, className)}>
      <Thumbnail quantity={quantity}>{image}</Thumbnail>
      <div className={styles.itemInfo}>
        <p><bdi>{title}</bdi></p>
        {variant != null && <p className={styles.variant}><bdi>{variant}</bdi></p>}
      </div>
      <bdi>{price}</bdi>
    </div>
  );
}
