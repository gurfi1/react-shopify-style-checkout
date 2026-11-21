import type { CSSProperties, ReactNode, Ref } from 'react';
import { BagIcon } from '../../icons';
import { subduedScheme } from '../../theme/Theme';
import { cx } from '../../utils';
import styles from './CheckoutLayout.module.css';

/** Steps of the order-confirmed entrance. See `Checkout` for how they are sequenced. */
export type CheckoutStage = 'exit' | 'intro' | 'settle' | 'done';

export type CheckoutLayoutProps = {
  /** Contents of the header row, usually a `CheckoutHeader`. */
  header?: ReactNode;
  /** The order summary column. */
  summary: ReactNode;
  /** Shown above the summary below 1000px, usually an `OrderSummaryToggle`. Hidden on wide screens. */
  summaryBar?: ReactNode;
  /** Whether the summary is expanded below 1000px. On wide screens it is always shown. */
  summaryOpen?: boolean;
  /** Accessible name of the summary column. */
  summaryLabel?: string;
  /** Id of the summary column, for the toggle's `aria-controls`. */
  summaryId?: string;
  /** Drives the order-confirmed entrance. Leave out for a plain layout. */
  stage?: CheckoutStage | null;
  /** How far, in pixels, the main column shifts to sit centred during the `intro` stage. */
  stageOffset?: number;
  mainRef?: Ref<HTMLElement>;
  /** Set to false to skip the summary's fade-in on load, when its content brings its own entrance. */
  entrance?: boolean;
  className?: string;
  /** The form column. */
  children: ReactNode;
};

/**
 * The checkout page's shell. From 1000px: a full-width header, the form column right-aligned to a divider
 * that sits 50px right of centre, and a sticky grey summary column. Below that: one column, with the
 * summary collapsed behind its bar.
 */
export function CheckoutLayout({ header, summary, summaryBar, summaryOpen = false, summaryLabel = 'Order summary', summaryId, stage, stageOffset = 0, mainRef, entrance = true, className, children }: CheckoutLayoutProps) {
  return (
    <div className={cx(styles.shell, className)} data-stage={stage ?? undefined} data-plain={entrance ? undefined : ''} style={{ '--stage-offset': stageOffset + 'px' } as CSSProperties}>
      {header != null && (
        <header className={styles.header}>
          <div className={styles.headerInner}>{header}</div>
        </header>
      )}
      {summaryBar != null && <div className={styles.bar}>{summaryBar}</div>}
      <aside className={cx(styles.summaryColumn, subduedScheme)} id={summaryId} aria-label={summaryLabel} data-open={summaryOpen ? '' : undefined}>
        <div className={styles.summaryClip}>
          <div className={styles.summary}>{summary}</div>
        </div>
      </aside>
      <div className={styles.mainColumn}>
        <main ref={mainRef} className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

export type CheckoutHeaderProps = {
  storeName: string;
  /** Replaces the spaced-out store name, for example an `<img>`. */
  logo?: ReactNode;
  /** Where the logo links. */
  homeHref?: string;
  /** Where the bag icon links. */
  cartHref?: string;
  /** Accessible name of the bag link. */
  cartLabel?: string;
};

/** The header's contents: the store's name or logo on one side, a link back to the cart on the other. */
export function CheckoutHeader({ storeName, logo, homeHref = '/', cartHref = '/cart', cartLabel = 'Back to cart' }: CheckoutHeaderProps) {
  return (
    <>
      <a className={styles.logo} href={homeHref} aria-label={logo != null ? storeName : undefined}>
        {logo ?? storeName}
      </a>
      <a className={styles.bag} href={cartHref} aria-label={cartLabel}>
        <BagIcon />
      </a>
    </>
  );
}
