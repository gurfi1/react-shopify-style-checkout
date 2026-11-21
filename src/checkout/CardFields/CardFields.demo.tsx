import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { cardNumberBlurError, expiryBlurError } from '../../lib/validate';
import type { CardValue } from '../../types';
import { CardBrandBadges, cardBrandOf, CardFields } from './CardFields';

const demo: Demo = {
  title: 'CardFields, CardBrandBadges',
  group: 'Checkout blocks',
  order: 9,
  summary: 'Card number, expiry, security code and name, formatted as typed: groups of four (4-6-5 for American Express), `MM / YY` with a leading zero added, digits only. The badges dim to the brand detected from the first digits. These inputs are placeholders: a real site swaps the first three for its payment provider’s hosted fields, so card data never passes through its code.',
  usage: `const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });

<CardBrandBadges brand={cardBrandOf(card.number)} />
<CardFields value={card} onChange={next => setCard(next)} errors={errors} />`,
  props: [
    ['value', 'CardValue', '{ number, expiry, cvc, name }'],
    ['onChange', '(next, field) => void', 'The next value, already formatted, and which field changed.'],
    ['errors', 'Partial<Record<keyof CardValue, string>>', 'Messages by field.'],
    ['onBlurField', '(field) => void', 'Validate on blur here.'],
    ['children', 'ReactNode', 'Extra rows under the name field.'],
    ['CardBrandBadges brand', "'visa' | 'mastercard' | 'amex' | ''", 'The detected brand; the others dim.'],
  ],
  Example: () => {
    const [card, setCard] = useState<CardValue>({ number: '', expiry: '', cvc: '', name: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof CardValue, string>>>({});
    return (
      <States>
        <State label="Type 4242…, 5555… or 3782… and watch the badges" width={460}>
          <div style={{ marginBottom: 12 }}>
            <CardBrandBadges brand={cardBrandOf(card.number)} />
          </div>
          <CardFields
            value={card}
            errors={errors}
            onChange={(next, field) => { setCard(next); setErrors(current => ({ ...current, [field]: undefined })); }}
            onBlurField={field => {
              const message = field === 'number' ? cardNumberBlurError(card.number) : field === 'expiry' ? expiryBlurError(card.expiry) : null;
              if (message) setErrors(current => ({ ...current, [field]: message }));
            }}
          />
        </State>
      </States>
    );
  },
};

export default demo;
