import type { ReactNode } from 'react';
import { LockIcon } from '../../icons';
import { detectCardBrand, cardDigits, formatCardNumber, formatExpiry, formatSecurityCode, type CardBrand } from '../../lib/card';
import { CARD_FIELD_IDS } from '../../lib/ids';
import { FieldGrid, Stack } from '../../primitives/Layout/Layout';
import { TextField } from '../../primitives/TextField/TextField';
import { InfoButton, Tooltip } from '../../primitives/Tooltip/Tooltip';
import { cx } from '../../utils';
import type { CardValue } from '../../types';
import { useLabels } from '../CheckoutProvider';
import amex from './brands/amex.svg';
import diners from './brands/diners.svg';
import discover from './brands/discover.svg';
import jcb from './brands/jcb.svg';
import mastercard from './brands/mastercard.svg';
import unionpay from './brands/unionpay.svg';
import visa from './brands/visa.svg';
import styles from './CardFields.module.css';

export type CardFieldsProps = {
  value: CardValue;
  /** Called with the whole next value, already formatted, and the field that changed. */
  onChange: (next: CardValue, field: keyof CardValue) => void;
  errors?: Partial<Record<keyof CardValue, string>>;
  /** Called when a field loses focus. */
  onBlurField?: (field: keyof CardValue) => void;
  /** Extra rows under the name field, in the same 10px rhythm: the billing address choice, for example. */
  children?: ReactNode;
  className?: string;
};

/**
 * Card number, expiry, security code and name, formatted as they are typed.
 * These are design placeholders: on a real site the first three are the payment provider's hosted
 * fields, so card data never passes through your code. Keep this component's layout and swap them in.
 */
export function CardFields({ value, onChange, errors = {}, onBlurField, children, className }: CardFieldsProps) {
  const labels = useLabels();
  const set = (field: keyof CardValue, text: string) => onChange({ ...value, [field]: text }, field);
  return (
    <Stack className={className}>
      <TextField
        id={CARD_FIELD_IDS.number}
        name="cc"
        label={labels.cardNumber}
        value={value.number}
        error={errors.number}
        inputMode="numeric"
        autoComplete="off"
        accessory={<LockIcon />}
        onChange={event => set('number', formatCardNumber(event.target.value))}
        onBlur={() => onBlurField?.('number')}
      />
      <FieldGrid columns={2}>
        <TextField
          id={CARD_FIELD_IDS.expiry}
          name="exp"
          label={labels.expiry}
          value={value.expiry}
          error={errors.expiry}
          inputMode="numeric"
          autoComplete="off"
          onChange={event => {
            const deleting = ((event.nativeEvent as InputEvent).inputType ?? '').startsWith('delete');
            set('expiry', formatExpiry(event.target.value, value.expiry, deleting));
          }}
          onBlur={() => onBlurField?.('expiry')}
        />
        <TextField
          id={CARD_FIELD_IDS.cvc}
          name="cvc"
          label={labels.securityCode}
          value={value.cvc}
          error={errors.cvc}
          inputMode="numeric"
          autoComplete="off"
          accessory={
            <Tooltip content={labels.securityCodeTooltip}>
              <InfoButton label={labels.moreInformation} />
            </Tooltip>
          }
          onChange={event => set('cvc', formatSecurityCode(event.target.value))}
          onBlur={() => onBlurField?.('cvc')}
        />
      </FieldGrid>
      <TextField
        id={CARD_FIELD_IDS.name}
        name="ccname"
        label={labels.nameOnCard}
        value={value.name}
        error={errors.name}
        autoComplete="off"
        onChange={event => set('name', event.target.value)}
        onBlur={() => onBlurField?.('name')}
      />
      {children}
    </Stack>
  );
}

export type CardBrandBadgesProps = {
  /** The brand detected from the number typed so far. The other badges dim. Pass a card number's brand or ''. */
  brand?: CardBrand;
  className?: string;
};

const SHOWN: { brand: Exclude<CardBrand, ''>; name: string; src: string }[] = [
  { brand: 'visa', name: 'Visa', src: visa },
  { brand: 'mastercard', name: 'Mastercard', src: mastercard },
  { brand: 'amex', name: 'American Express', src: amex },
];
const MORE: { name: string; src: string }[] = [
  { name: 'Discover', src: discover },
  { name: 'Diners Club', src: diners },
  { name: 'JCB', src: jcb },
  { name: 'UnionPay', src: unionpay },
];

/**
 * Badges for the accepted cards, 38×24 each, with a "+4" badge whose tooltip shows the rest.
 * The artwork is in the `brands` folder beside this file; see its LICENSE.txt.
 */
export function CardBrandBadges({ brand = '', className }: CardBrandBadgesProps) {
  const labels = useLabels();
  return (
    <span className={cx(styles.badges, className)}>
      {SHOWN.map(card => (
        <img key={card.brand} className={styles.logo} src={card.src} alt={card.name} title={card.name} width={38} height={24} data-dim={brand && brand !== card.brand ? '' : undefined} />
      ))}
      <Tooltip
        content={
          <span className={styles.more}>
            {MORE.map(card => (
              <img key={card.name} src={card.src} alt={card.name} title={card.name} width={38} height={24} />
            ))}
          </span>
        }
      >
        <button type="button" className={cx(styles.badge, styles.moreButton)}>
          {labels.moreCardsCount}
        </button>
      </Tooltip>
    </span>
  );
}

/** The brand of a card number as typed, for `CardBrandBadges`. */
export const cardBrandOf = (number: string): CardBrand => detectCardBrand(cardDigits(number));
