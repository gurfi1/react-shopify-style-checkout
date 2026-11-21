import { State, States, type Demo } from '../../demo';
import { Link, Text } from '../../primitives/Text/Text';

const demo: Demo = {
  title: 'Checkout',
  group: 'Checkout blocks',
  order: 17,
  summary: 'Everything assembled into the page: layout, form, order summary, and the thank-you page it turns into. It brings its own `Theme` and `CheckoutProvider`. The wiring between blocks lives here: billing follows the delivery mode, the pay button’s label follows the payment method, the name on the card follows the shipping name, paying waits for shipping rates, and the first invalid field takes focus.',
  usage: `<Checkout
  api={{ suggestAddresses, shippingRates, applyDiscount, placeOrder }}
  items={cart.lines}
  storeName="Northfield"
  accent="#334fb4"
  currency="USD"
  pickupLocations={stores}
  paymentMethods={methods}
  policies={policies}
  onComplete={(order, confirmation) => track(order)}
  onContinueShopping={() => navigate('/')}
/>`,
  props: [
    ['api', 'CheckoutApi', 'The four calls to your back end. Required, so a pretend placeOrder cannot ship by accident.'],
    ['items', 'LineItemData[]', 'The cart.'],
    ['subtotal', 'number', 'Defaults to the sum of the item prices.'],
    ['storeName, logo, homeHref, cartHref', 'string, ReactNode, string, string', 'The header.'],
    ['accent', 'string', 'Brand colour.'],
    ['locale, currency', 'string', 'For prices. Default en-US and USD.'],
    ['labels', 'Partial<Labels>', 'Wording to replace; the rest stays English.'],
    ['countries, defaultCountry', 'Country[], string', 'Where you ship, with address formats.'],
    ['pickupLocations', 'PickupLocation[]', 'Leave out to offer shipping only; the Ship / Pick up switch goes too.'],
    ['paymentMethods', 'PaymentMethod[]', 'Defaults to one credit card method.'],
    ['expressButtons', 'ExpressButton[]', 'Leave out for no express row.'],
    ['policies', 'Policy[]', 'Footer links.'],
    ['onComplete', '(order, confirmation) => void', 'The order was placed.'],
    ['onContinueShopping', '() => void', 'The thank-you page’s button.'],
  ],
  Example: () => (
    <States>
      <State label="It needs the whole window">
        <Text>
          <Link href="#/">Open the full checkout</Link>. Discount code WELCOME10; a card number ending in 0002 is declined.
        </Text>
      </State>
    </States>
  ),
};

export default demo;
