import { ChoiceEnd, ChoiceList } from '../../primitives/ChoiceList/ChoiceList';
import type { PickupLocation } from '../../types';
import { useLabels } from '../CheckoutProvider';
import styles from './PickupLocations.module.css';

export type PickupLocationsProps = {
  locations: PickupLocation[];
  /** Id of the chosen location. */
  value: string;
  onChange: (id: string) => void;
  /** Shared `name` of the radios. */
  name?: string;
  className?: string;
};

/** A heading, a count, and the stores to collect from: name, address, how soon it is ready, and how far away. */
export function PickupLocations({ locations, value, onChange, name = 'pickup', className }: PickupLocationsProps) {
  const labels = useLabels();
  return (
    <div className={className}>
      <h3 className={styles.heading}>{labels.pickupLocations}</h3>
      <p className={styles.count}>{labels.pickupCount(locations.length)}</p>
      <ChoiceList
        name={name}
        label={labels.pickupLocation}
        value={value}
        onChange={onChange}
        options={locations.map(location => ({
          value: location.id,
          title: <bdi>{location.name}</bdi>,
          description: <bdi>{location.address}</bdi>,
          detail: location.ready,
          end: <ChoiceEnd title={labels.free} detail={location.distance != null ? <bdi>{location.distance}</bdi> : undefined} />,
        }))}
      />
    </div>
  );
}
