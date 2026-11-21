import type { ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './MapCard.module.css';

export type MapCardProps = {
  /** Small grey line in the callout: "Shipping address". */
  label: ReactNode;
  /** Bold line in the callout: the town or the store. */
  place: ReactNode;
  /** Hold the entrance until true: the map settles from 112%, the pin pops, the callout rises. */
  active?: boolean;
  className?: string;
};

/**
 * A stylised map with a pin and a callout, for the top of the confirmation card.
 * The map is drawn in CSS and shows no real place; swap in a real map image if you have one.
 */
export function MapCard({ label, place, active = true, className }: MapCardProps) {
  return (
    <div className={cx(styles.map, className)} data-active={active ? '' : undefined} aria-hidden>
      <div className={styles.art} />
      <span className={styles.pin} />
      <div className={styles.callout}>
        <span className={styles.label}>{label}</span>
        <b>{place}</b>
      </div>
    </div>
  );
}
