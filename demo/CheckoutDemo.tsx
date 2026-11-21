import { useEffect, useMemo, useState } from 'react';
import { Checkout, he } from '../src';
import { createFakeApi } from './fakeApi';
import { EXPRESS_BUTTONS, ITEMS, PAYMENT_METHODS, PICKUP_LOCATIONS, POLICIES, STORE_NAME } from './store';
import { ADDRESSES_HE, COUNTRIES_HE, formatSuggestionHe, ITEMS_HE, PAYMENT_METHODS_HE, PICKUP_LOCATIONS_HE, POLICIES_HE, RATES_HE } from './storeHe';

const sum = (items: { price: number }[]) => items.reduce((total, item) => total + item.price, 0);

/**
 * The full checkout on canned data.
 *
 *   /            English
 *   /?lang=he    Hebrew, right to left, in shekels
 *   /?dir=rtl    English wording in a mirrored layout, for testing the layout alone
 */
export function CheckoutDemo() {
  const params = new URLSearchParams(location.search);
  const hebrew = params.get('lang') === 'he';
  const dir = hebrew || params.get('dir') === 'rtl' ? 'rtl' : undefined;

  const items = hebrew ? ITEMS_HE : ITEMS;
  const subtotal = sum(items);
  const api = useMemo(
    () => (hebrew ? createFakeApi(subtotal, { addresses: ADDRESSES_HE, formatLine: formatSuggestionHe, rates: RATES_HE, invalidDiscount: 'הזינו קוד הנחה או שובר מתנה תקינים' }) : createFakeApi(subtotal)),
    [hebrew, subtotal],
  );

  // A Hebrew page is right to left as a whole, not just the checkout inside it.
  useEffect(() => {
    if (!hebrew) return;
    document.documentElement.lang = 'he';
    document.documentElement.dir = 'rtl';
    document.title = 'קופה – Northfield Goods';
    return () => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    };
  }, [hebrew]);

  // Pretend the cart takes a moment to arrive, so the page-load skeleton can be seen.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const base = location.pathname;
  return (
    <>
      <Checkout
        api={api}
        items={items}
        loading={loading}
        dir={dir}
        storeName={STORE_NAME}
        homeHref="#/"
        cartHref="#/"
        signInHref="#/"
        helpHref="#/"
        expressButtons={EXPRESS_BUTTONS}
        {...(hebrew
          ? { labels: he, locale: 'he-IL', currency: 'ILS', countries: COUNTRIES_HE, pickupLocations: PICKUP_LOCATIONS_HE, paymentMethods: PAYMENT_METHODS_HE, policies: POLICIES_HE }
          : { pickupLocations: PICKUP_LOCATIONS, paymentMethods: PAYMENT_METHODS, policies: POLICIES })}
        footerNote={
          <p className="site-demo-note">
            {hebrew
              ? 'הדגמה. שום דבר שתקלידו לא נשלח לשום מקום. קוד הנחה: WELCOME10. כרטיס שמסתיים ב-0002 יידחה. '
              : 'Demo. Nothing you type is sent anywhere. Discount code: WELCOME10. A card number ending in 0002 is declined. '}
            {hebrew ? <a href={base}>English</a> : <a href={base + '?lang=he'} lang="he">עברית</a>}
          </p>
        }
        onComplete={() => { document.title = hebrew ? 'תודה – Northfield Goods' : 'Thank you – Northfield Goods'; }}
        onContinueShopping={() => location.reload()}
      />
      <nav aria-label="Demo">
        <a className="site-pill" href="#/components">Browse components</a>
      </nav>
    </>
  );
}
