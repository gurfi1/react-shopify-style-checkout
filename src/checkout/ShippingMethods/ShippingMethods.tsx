import type { RatesStatus } from '../../hooks/useShippingRates';
import { ChoiceList } from '../../primitives/ChoiceList/ChoiceList';
import { ContentSwap } from '../../primitives/ContentSwap/ContentSwap';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import type { ShippingRate } from '../../types';
import { useLabels, useMoney } from '../CheckoutProvider';
import styles from './ShippingMethods.module.css';

export type ShippingMethodsProps = {
  /** empty: ask for the address. loading: skeleton. none: cannot ship there. ready: the list. */
  status: RatesStatus;
  rates: ShippingRate[];
  /** Id of the chosen rate. */
  value: string | null;
  onChange: (id: string) => void;
  /** Shared `name` of the radios. */
  name?: string;
  id?: string;
  className?: string;
};

/**
 * The shipping method block in its four states. Moving between them fades the new state in
 * and animates the block's height.
 */
export function ShippingMethods({ status, rates, value, onChange, name = 'shipping', id, className }: ShippingMethodsProps) {
  const labels = useLabels();
  const money = useMoney();
  return (
    <ContentSwap activeKey={status} id={id} className={className}>
      {status === 'empty' && <div className={styles.empty}>{labels.shippingEmpty}</div>}
      {status === 'none' && <div className={styles.empty}>{labels.shippingNone}</div>}
      {status === 'loading' && (
        <div className={styles.skeleton} aria-hidden>
          {[0, 1].map(row => (
            <div key={row}>
              <Skeleton shape="circle" />
              <Skeleton className={styles.name} />
              <Skeleton className={styles.price} />
            </div>
          ))}
        </div>
      )}
      {status === 'ready' && (
        <ChoiceList
          name={name}
          label={labels.shippingMethod}
          value={value ?? ''}
          onChange={onChange}
          options={rates.map(rate => ({
            value: rate.id,
            title: <bdi>{rate.name}</bdi>,
            description: <bdi>{rate.eta}</bdi>,
            end: <b>{rate.price ? <bdi>{money(rate.price)}</bdi> : labels.free}</b>,
          }))}
        />
      )}
    </ContentSwap>
  );
}
