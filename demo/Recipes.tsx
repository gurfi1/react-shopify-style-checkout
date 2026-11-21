import { useMemo, useState, type ComponentType } from 'react';
import {
  AddressForm, Button, Card, CardBody, CheckoutProvider, ContactField, COUNTRIES, emptyAddress, findCountry, Heading, isAddressComplete, Link,
  OrderSummary, postalBlurError, ShippingMethods, Stack, Surface, Text, ThankYou, Totals, useCheckout, type Address, type Discount,
} from '../src';
import { createFakeApi } from './fakeApi';
import { Entry, PageHead, Prose } from './Gallery';
import { ITEMS } from './store';

const SUBTOTAL = ITEMS.reduce((sum, item) => sum + item.price, 0);

function AddressOnly() {
  const api = useMemo(() => createFakeApi(SUBTOTAL), []);
  const [address, setAddress] = useState<Address>(() => emptyAddress('US'));
  const [postalError, setPostalError] = useState<string | null>(null);
  const country = findCountry(COUNTRIES, address.country);
  return (
    <div style={{ maxWidth: 500 }}>
      <AddressForm
        idPrefix="recipe-a-"
        value={address}
        onChange={(next, field) => {
          setAddress(next);
          if (field === 'postal' || field === 'country') setPostalError(null);
        }}
        errors={{ postal: postalError ?? undefined }}
        onBlurField={field => { if (field === 'postal') setPostalError(postalBlurError(address.postal, country)); }}
        suggest={api.suggestAddresses}
      />
      <Text tone="subdued" style={{ marginTop: 12 }}>
        {isAddressComplete(address, country) ? 'The address is complete enough to ask for shipping rates.' : 'Type three letters in Address for suggestions, or switch country to see the form change.'}
      </Text>
    </div>
  );
}

function SummaryOnly() {
  const api = useMemo(() => createFakeApi(SUBTOTAL), []);
  const [discount, setDiscount] = useState<Discount | null>(null);
  return (
    <Surface style={{ maxWidth: 480, padding: 40, borderRadius: 12 }}>
      <OrderSummary
        items={ITEMS}
        subtotal={SUBTOTAL}
        discount={discount}
        shipping="amount"
        shippingAmount={6.9}
        total={SUBTOTAL - (discount?.amount ?? 0) + 6.9}
        onApplyDiscount={async code => setDiscount(await api.applyDiscount(code))}
        onRemoveDiscount={() => setDiscount(null)}
      />
    </Surface>
  );
}

function ThanksOnly() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ maxWidth: 500 }}>
      <p style={{ marginBottom: 16 }}>
        <Link onClick={() => setRun(count => count + 1)}>Play the entrance again</Link>
      </p>
      <ThankYou
        key={run}
        confirmation="K7RM2XQ4P"
        firstName="Ada"
        mapLabel="Shipping address"
        mapPlace="San Francisco CA"
        details={[
          [
            { title: 'Contact information', lines: ['ada@example.com'] },
            { title: 'Shipping address', lines: ['Ada Lovelace', '12 Market St', 'San Francisco CA 94103', 'United States'] },
            { title: 'Shipping method', lines: ['Standard'] },
          ],
          [
            { title: 'Payment method', lines: ['Visa ending with 4242 · $126.90'] },
            { title: 'Billing address', lines: ['Ada Lovelace', '12 Market St', 'San Francisco CA 94103', 'United States'] },
          ],
        ]}
      />
    </div>
  );
}

function CustomLayout() {
  const api = useMemo(() => createFakeApi(SUBTOTAL), []);
  // No card method here, so the hook asks for no card fields: this one is cash on delivery only.
  const checkout = useCheckout({ api, subtotal: SUBTOTAL, paymentMethods: [{ id: 'cod', title: 'Cash on delivery', kind: 'manual' }] });
  const [result, setResult] = useState('');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
      <Card>
        <CardBody>
          <Stack gap={14}>
            <Heading level={3}>Your details</Heading>
            <ContactField id="recipe-email" value={checkout.contact} onChange={checkout.setContact} error={checkout.errors.contact} onBlur={checkout.blurContact} />
            <AddressForm
              idPrefix="recipe-c-"
              value={checkout.shipping}
              onChange={checkout.setShipping}
              errors={checkout.errors.shipping}
              onBlurField={field => { if (field === 'postal') checkout.blurPostal('shipping'); }}
              suggest={api.suggestAddresses}
              onSuggestion={checkout.fillShipping}
            />
          </Stack>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Stack gap={14}>
            <Heading level={3}>Delivery and total</Heading>
            <ShippingMethods name="recipe-shipping" status={checkout.rates.status} rates={checkout.rates.rates} value={checkout.rates.selected} onChange={checkout.rates.select} />
            <Totals subtotal={checkout.totals.subtotal} itemCount={3} shipping={checkout.shippingDisplay} shippingAmount={checkout.totals.shipping} total={checkout.totals.total} />
            <Button
              fullWidth
              loading={checkout.busy && !result}
              onClick={async () => {
                const outcome = await checkout.submit();
                setResult(outcome.status === 'placed' ? `Placed. Confirmation ${outcome.confirmation}` : outcome.status === 'invalid' ? 'Some fields need attention.' : outcome.status === 'no-rates' ? 'No shipping rate yet.' : 'The order failed.');
              }}
            >
              Place order
            </Button>
            {result && <Text tone="subdued">{result}</Text>}
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}

export const RECIPES: { title: string; summary: string; usage: string; Example: ComponentType }[] = [
  {
    title: 'An address form on its own',
    summary: 'For an account page or a shipping estimator. `AddressForm` holds no state: keep the address yourself, and decide when to validate. Give it a `suggest` function and the address line becomes a combobox.',
    usage: `const [address, setAddress] = useState(() => emptyAddress('US'));

<AddressForm
  value={address}
  onChange={next => setAddress(next)}
  suggest={(query, country) => api.suggestAddresses(query, country)}
/>`,
    Example: AddressOnly,
  },
  {
    title: 'An order summary on its own',
    summary: 'For a cart drawer or an order page. Put it on a `Surface` to get the grey scheme. Leave out `onApplyDiscount` and the code field disappears, leaving a read-only summary. Try code `WELCOME10`.',
    usage: `<Surface>
  <OrderSummary
    items={items}
    subtotal={120}
    discount={discount}
    shipping="amount"
    shippingAmount={6.9}
    total={126.9 - (discount?.amount ?? 0)}
    onApplyDiscount={async code => setDiscount(await api.applyDiscount(code))}
    onRemoveDiscount={() => setDiscount(null)}
  />
</Surface>`,
    Example: SummaryOnly,
  },
  {
    title: 'A thank-you page on its own',
    summary: 'For an order-status page reached from an email. Rendered by itself, `ThankYou` shows its tick at once and its parts rise in. Inside `Checkout` the same component is driven by the big tick that flies into place.',
    usage: `<ThankYou
  confirmation="K7RM2XQ4P"
  firstName="Ada"
  mapLabel="Shipping address"
  mapPlace="San Francisco CA"
  details={[leftColumn, rightColumn]}
  onContinue={() => navigate('/')}
/>`,
    Example: ThanksOnly,
  },
  {
    title: 'A custom layout driven by useCheckout',
    summary: '`useCheckout` holds the state and rules with no interface: what was typed, errors, shipping rates that follow the address, totals, validation and placing the order. Here it drives two plain cards in place of the two-column page. Fill in the address and press Place order.',
    usage: `const checkout = useCheckout({ api, subtotal: 120, paymentMethods });

<ContactField value={checkout.contact} onChange={checkout.setContact} error={checkout.errors.contact} onBlur={checkout.blurContact} />
<AddressForm value={checkout.shipping} onChange={checkout.setShipping} errors={checkout.errors.shipping} onSuggestion={checkout.fillShipping} suggest={api.suggestAddresses} />
<ShippingMethods status={checkout.rates.status} rates={checkout.rates.rates} value={checkout.rates.selected} onChange={checkout.rates.select} />
<Totals subtotal={checkout.totals.subtotal} itemCount={3} shipping={checkout.shippingDisplay} shippingAmount={checkout.totals.shipping} total={checkout.totals.total} />
<Button onClick={async () => { const outcome = await checkout.submit(); … }}>Place order</Button>`,
    Example: CustomLayout,
  },
];

export function Recipes() {
  return (
    <CheckoutProvider>
      <PageHead title="Recipes" lead="Blocks combined without the full page. Each example is the code beside it, running on the same canned data as the full checkout." />
      {RECIPES.map(recipe => (
        <Entry key={recipe.title} title={recipe.title} summary={<Prose>{recipe.summary}</Prose>} usage={recipe.usage}>
          <recipe.Example />
        </Entry>
      ))}
    </CheckoutProvider>
  );
}
