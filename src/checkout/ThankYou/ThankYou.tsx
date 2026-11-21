import type { Ref } from 'react';
import { Button } from '../../primitives/Button/Button';
import { Card, CardBody } from '../../primitives/Card/Card';
import { Reveal } from '../../primitives/Reveal/Reveal';
import { Heading, Link } from '../../primitives/Text/Text';
import { cx } from '../../utils';
import { useLabels } from '../CheckoutProvider';
import { ConfirmationCheck } from '../ConfirmationCheck/ConfirmationCheck';
import { ConfirmationCode } from '../ConfirmationCode/ConfirmationCode';
import { MapCard } from '../MapCard/MapCard';
import { OrderDetails, type OrderDetail } from '../OrderDetails/OrderDetails';
import styles from './ThankYou.module.css';

export type ThankYouProps = {
  /** The confirmation code. */
  confirmation: string;
  /** The shopper's first name, for "Thank you, Ada!". Leave out for "Thank you!". */
  firstName?: string;
  /** Small line in the map callout. */
  mapLabel: string;
  /** Bold line in the map callout. */
  mapPlace: string;
  /** Left and right columns of order details. */
  details: [OrderDetail[], OrderDetail[]];
  onContinue?: () => void;
  /** Where "Contact us" links. */
  helpHref?: string;
  /** Hold the entrance until true. `Checkout` flips it once the big tick has drawn. */
  revealing?: boolean;
  /** Whether the tick beside the heading is visible. `Checkout` hides it until the big tick lands there. */
  iconShown?: boolean;
  /** The slot the tick sits in, so a flying tick can be aimed at it. */
  iconRef?: Ref<HTMLSpanElement>;
  /** The heading, so focus can be moved to it. */
  titleRef?: Ref<HTMLHeadingElement>;
  className?: string;
};

/**
 * The order confirmation page: tick, confirmation code and heading, a map card, the order details,
 * and a way onward. Its parts rise in one after another.
 */
export function ThankYou({ confirmation, firstName = '', mapLabel, mapPlace, details, onContinue, helpHref = '#', revealing = true, iconShown = true, iconRef, titleRef, className }: ThankYouProps) {
  const labels = useLabels();
  return (
    <div className={className}>
      <div className={styles.head}>
        <span ref={iconRef} className={styles.iconSlot} data-shown={iconShown ? '' : undefined}>
          <ConfirmationCheck />
        </span>
        <Reveal index={0} active={revealing}>
          <p className={styles.subdued}>
            {labels.confirmation} #<ConfirmationCode code={confirmation} active={revealing} />
          </p>
          <h2 ref={titleRef} className={styles.title} tabIndex={-1} style={{ outline: 'none' }}>
            {labels.thankYou(firstName)}
          </h2>
        </Reveal>
      </div>
      <Reveal index={1} active={revealing} className={styles.card}>
        <Card>
          <MapCard label={mapLabel} place={mapPlace} active={revealing} />
          <CardBody>
            <Heading level={3}>{labels.orderConfirmed}</Heading>
            <p>{labels.orderConfirmedBody}</p>
          </CardBody>
        </Card>
      </Reveal>
      <Reveal index={2} active={revealing} className={styles.card}>
        <Card>
          <CardBody>
            <Heading level={3}>{labels.orderDetails}</Heading>
            <OrderDetails columns={details} style={{ marginTop: 14 }} />
          </CardBody>
        </Card>
      </Reveal>
      <Reveal index={3} active={revealing} className={cx(styles.foot)}>
        <p>
          {labels.needHelp} <Link href={helpHref}>{labels.contactUs}</Link>
        </p>
        <Button onClick={onContinue}>{labels.continueShopping}</Button>
      </Reveal>
    </div>
  );
}
