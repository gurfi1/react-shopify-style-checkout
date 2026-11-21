import { useEffect, useMemo, useState } from 'react';
import { Checkout } from '../src';
import { createFakeApi } from './fakeApi';
import { EXPRESS_BUTTONS, ITEMS, PAYMENT_METHODS, PICKUP_LOCATIONS, POLICIES, STORE_NAME } from './store';

/** The full checkout on canned data. */
export function CheckoutDemo() {
  const subtotal = ITEMS.reduce((sum, item) => sum + item.price, 0);
  const api = useMemo(() => createFakeApi(subtotal), [subtotal]);
  // Pretend the cart takes a moment to arrive, so the page-load skeleton can be seen.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Checkout
        api={api}
        items={ITEMS}
        loading={loading}
        storeName={STORE_NAME}
        homeHref="#/"
        cartHref="#/"
        signInHref="#/"
        helpHref="#/"
        expressButtons={EXPRESS_BUTTONS}
        pickupLocations={PICKUP_LOCATIONS}
        paymentMethods={PAYMENT_METHODS}
        policies={POLICIES}
        footerNote={<p className="site-demo-note">Demo. Nothing you type is sent anywhere. Discount code: WELCOME10. A card number ending in 0002 is declined.</p>}
        onComplete={() => { document.title = 'Thank you – Northfield Goods'; }}
        onContinueShopping={() => location.reload()}
      />
      <nav aria-label="Demo">
        <a className="site-pill" href="#/components">Browse components</a>
      </nav>
    </>
  );
}
