import type { ReactNode } from 'react';
import { RedirectIllustration } from '../../icons';
import type { CardBrand } from '../../lib/card';
import { ChoiceList } from '../../primitives/ChoiceList/ChoiceList';
import type { PaymentMethod } from '../../types';
import { CardBrandBadges } from '../CardFields/CardFields';
import { useLabels } from '../CheckoutProvider';
import styles from './PaymentMethods.module.css';

export type PaymentMethodsProps = {
  methods: PaymentMethod[];
  /** Id of the chosen method. */
  value: string;
  onChange: (id: string) => void;
  /** What opens under a `card` method: usually `CardFields` and the billing address. */
  cardPanel?: ReactNode;
  /** Brand detected from the card number, to dim the other badges. */
  cardBrand?: CardBrand;
  /** Shared `name` of the radios. */
  name?: string;
  className?: string;
};

/**
 * Payment methods as a choice list. The chosen method's panel opens under its row: card fields for a card,
 * an illustration and a note for a redirect-style method, a plain note for a manual one.
 */
export function PaymentMethods({ methods, value, onChange, cardPanel, cardBrand, name = 'payment', className }: PaymentMethodsProps) {
  const labels = useLabels();
  return (
    <ChoiceList
      className={className}
      name={name}
      label={labels.paymentMethod}
      value={value}
      onChange={onChange}
      options={methods.map(method => {
        if (method.kind === 'card') return { value: method.id, title: method.title, end: <CardBrandBadges brand={cardBrand} />, panel: cardPanel ?? null };
        if (method.kind === 'redirect') {
          return {
            value: method.id,
            title: method.title,
            panelClassName: styles.redirect,
            panel: (
              <>
                <RedirectIllustration />
                {method.note}
              </>
            ),
          };
        }
        return { value: method.id, title: method.title, panel: method.note };
      })}
    />
  );
}
