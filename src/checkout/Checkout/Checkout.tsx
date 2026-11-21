import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useCheckout } from '../../hooks/useCheckout';
import { StoreIcon, TruckIcon } from '../../icons';
import type { Labels } from '../../labels';
import { hasRegions } from '../../lib/address';
import { CARD_BRAND_NAMES, cardDigits } from '../../lib/card';
import { DURATION, prefersReducedMotion, wait } from '../../lib/motion';
import { Banner } from '../../primitives/Banner/Banner';
import { Button } from '../../primitives/Button/Button';
import { Checkbox } from '../../primitives/Checkbox/Checkbox';
import { Collapsible } from '../../primitives/Collapsible/Collapsible';
import { ContentSwap } from '../../primitives/ContentSwap/ContentSwap';
import { SegmentedControl } from '../../primitives/SegmentedControl/SegmentedControl';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { Heading, Link } from '../../primitives/Text/Text';
import { subduedScheme, Theme } from '../../theme/Theme';
import type { CheckoutApi, Country, LineItemData, Order, PaymentMethod, PickupLocation, Policy } from '../../types';
import { cx } from '../../utils';
import { AddressForm } from '../AddressForm/AddressForm';
import { cardBrandOf, CardFields } from '../CardFields/CardFields';
import { CheckoutHeader, CheckoutLayout, type CheckoutStage } from '../CheckoutLayout/CheckoutLayout';
import { CheckoutProvider, useCheckoutSettings } from '../CheckoutProvider';
import { CheckoutSkeleton, OrderSummarySkeleton } from '../CheckoutSkeleton/CheckoutSkeleton';
import { ConfirmationCheck } from '../ConfirmationCheck/ConfirmationCheck';
import { ContactField } from '../ContactField/ContactField';
import { ExpressCheckout, type ExpressButton } from '../ExpressCheckout/ExpressCheckout';
import type { OrderDetail } from '../OrderDetails/OrderDetails';
import { OrderSummary, OrderSummaryToggle } from '../OrderSummary/OrderSummary';
import { PaymentMethods } from '../PaymentMethods/PaymentMethods';
import { PickupLocations } from '../PickupLocations/PickupLocations';
import { PolicyLinks } from '../PolicyLinks/PolicyLinks';
import { ShippingMethods } from '../ShippingMethods/ShippingMethods';
import { ThankYou } from '../ThankYou/ThankYou';
import styles from './Checkout.module.css';

export type CheckoutProps = {
  /** The four calls to your back end. */
  api: CheckoutApi;
  /** The cart. */
  items: LineItemData[];
  /**
   * Show the page-load skeleton in place of the form and the summary, for example while the cart is fetched.
   * When it turns false the skeleton fades out as the real page fades in.
   */
  loading?: boolean;
  /** Sum before discount and shipping. Defaults to the sum of the item prices. */
  subtotal?: number;
  storeName: string;
  /** Replaces the store name in the header. */
  logo?: ReactNode;
  homeHref?: string;
  cartHref?: string;
  /** Brand colour. Defaults to the reference blue. */
  accent?: string;
  /** BCP 47 locale for prices. */
  locale?: string;
  /** ISO 4217 currency code. */
  currency?: string;
  /** Wording to replace. Anything left out stays English. */
  labels?: Partial<Labels>;
  /** Countries to ship to, with their address formats. Defaults to US, Canada, UK and Israel. */
  countries?: Country[];
  defaultCountry?: string;
  /** Stores to collect from. Leave out to offer shipping only. */
  pickupLocations?: PickupLocation[];
  /** Defaults to a single credit card method. */
  paymentMethods?: PaymentMethod[];
  /** Wallet buttons above the form. Leave out for none. */
  expressButtons?: ExpressButton[];
  /** Footer links that open in a modal. */
  policies?: Policy[];
  /** Shows a "Sign in" link beside the Contact heading. */
  signInHref?: string;
  /** Where "Contact us" on the thank-you page links. */
  helpHref?: string;
  /** Extra content under the policy links. */
  footerNote?: ReactNode;
  /** Called once the order is placed, before the thank-you page plays. */
  onComplete?: (order: Order, confirmation: string) => void;
  /** The thank-you page's button. */
  onContinueShopping?: () => void;
};

/** The whole one-page checkout: form, order summary, and the thank-you page it turns into. */
export function Checkout({ accent, labels, locale, currency, ...page }: CheckoutProps) {
  return (
    <Theme accent={accent}>
      <CheckoutProvider labels={labels} locale={locale} currency={currency}>
        <CheckoutPage labels={labels} {...page} />
      </CheckoutProvider>
    </Theme>
  );
}

const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth') as ScrollBehavior;

function CheckoutPage({
  api, items, loading = false, subtotal: givenSubtotal, storeName, logo, homeHref, cartHref, labels: labelOverrides,
  countries, defaultCountry, pickupLocations = [], paymentMethods, expressButtons, policies,
  signInHref, helpHref, footerNote, onComplete, onContinueShopping,
}: Omit<CheckoutProps, 'accent' | 'locale' | 'currency'>) {
  const { labels, money } = useCheckoutSettings();
  const subtotal = givenSubtotal ?? items.reduce((sum, item) => sum + item.price, 0);
  const state = useCheckout({ api, subtotal, countries, defaultCountry, pickupLocations, paymentMethods, labels: labelOverrides });

  const [summaryOpen, setSummaryOpen] = useState(false);
  // The wallet buttons stay grey for a moment after the page itself has arrived.
  const [expressLoading, setExpressLoading] = useState(true);
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => setExpressLoading(false), prefersReducedMotion() ? 0 : 700);
    return () => clearTimeout(timer);
  }, [loading]);

  // ---- Page load: skeleton first, then a short cross-fade into the real page. ----
  const [wasLoading, setWasLoading] = useState(loading);
  const [everLoaded, setEverLoaded] = useState(loading);
  const [leaving, setLeaving] = useState(false);
  if (loading !== wasLoading) {
    setWasLoading(loading);
    if (loading) setEverLoaded(true);
    else setLeaving(true);
  }
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setLeaving(false), prefersReducedMotion() ? 0 : DURATION.fast);
    return () => clearTimeout(timer);
  }, [leaving]);
  const showSkeleton = loading || leaving;

  // ---- The thank-you entrance. It depends on this page's layout, so it lives here. ----
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [view, setView] = useState<'checkout' | 'thanks'>('checkout');
  const [stage, setStage] = useState<CheckoutStage | null>(null);
  const [stageOffset, setStageOffset] = useState(0);
  const [bigTick, setBigTick] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [iconShown, setIconShown] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const bigTickRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const celebrate = async (code: string) => {
    // 1. The checkout drifts down and blurs away; the summary fades with it.
    setConfirmation(code);
    setStage('exit');
    await wait(320);
    // 2. A single centred column: the big circle draws, then its tick.
    const box = mainRef.current?.getBoundingClientRect();
    const offset = box ? document.documentElement.clientWidth / 2 - (box.left + box.width / 2) : 0;
    flushSync(() => {
      setStageOffset(offset);
      setView('thanks');
      setSummaryOpen(false);
      setStage('intro');
      setBigTick(true);
    });
    window.scrollTo(0, 0);
    await wait(540 + 380 + 120);
    // 3. The tick shrinks and flies to its place beside the heading while the page content rises in.
    const from = bigTickRef.current?.getBoundingClientRect();
    const to = iconRef.current?.getBoundingClientRect();
    flushSync(() => setRevealing(true));
    titleRef.current?.focus({ preventScroll: true });
    if (bigTickRef.current && from && to) {
      const move = `translate(${to.left + to.width / 2 - from.left - from.width / 2}px,${to.top + to.height / 2 - from.top - from.height / 2}px) scale(${to.width / from.width})`;
      try {
        await bigTickRef.current.animate([{ transform: 'none' }, { transform: 'scale(1.08)', offset: 0.22 }, { transform: move }], {
          duration: prefersReducedMotion() ? 1 : 520,
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'forwards',
        }).finished;
      } catch {
        // The animation was cancelled; carry on to the final state.
      }
    }
    setIconShown(true);
    setBigTick(false);
    await wait(650);
    // 4. The column slides to its side and the order summary comes into focus.
    setStage('settle');
    await wait(600);
    setStage('done');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (state.busy) return;
    const result = await state.submit();
    if (result.status === 'invalid') {
      const field = document.getElementById(result.firstInvalid);
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
    } else if (result.status === 'no-rates') {
      shippingRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
    } else if (result.status === 'placed') {
      onComplete?.(result.order, result.confirmation);
      void celebrate(result.confirmation);
    }
  };

  // ---- Pieces used in more than one place ----
  const summary = (withDiscount: boolean) => (
    <OrderSummary
      items={items}
      subtotal={state.totals.subtotal}
      discount={state.discount}
      shipping={state.shippingDisplay}
      shippingAmount={state.totals.shipping}
      shippingLabel={state.isPickup ? labels.pickup : labels.shipping}
      total={state.totals.total}
      onApplyDiscount={withDiscount ? state.applyDiscount : undefined}
      onRemoveDiscount={state.removeDiscount}
      discountOpen={view === 'checkout'}
    />
  );

  const cardPanel = (
    <CardFields value={state.card} onChange={state.setCard} errors={state.errors.card} onBlurField={state.blurCard}>
      <Checkbox hidden={state.isPickup} checked={state.billingSame} onChange={event => state.setBillingSame(event.target.checked)}>
        {labels.billingSame}
      </Checkbox>
      <Collapsible open={state.isPickup || !state.billingSame}>
        <Heading level={3} className={styles.billingHeading}>{labels.billingAddress}</Heading>
        <AddressForm
          idPrefix="b-"
          value={state.billing}
          onChange={state.setBilling}
          countries={state.countries}
          errors={state.errors.billing}
          onBlurField={field => { if (field === 'postal') state.blurPostal('billing'); }}
        />
      </Collapsible>
    </CardFields>
  );

  // ---- What the thank-you page shows ----
  const location = pickupLocations.find(item => item.id === state.pickup);
  const last4 = cardDigits(state.card.number).slice(-4);
  const brand = cardBrandOf(state.card.number);
  const paidWith = state.isCard ? labels.cardEnding(brand ? CARD_BRAND_NAMES[brand] : labels.card, last4) : state.method.title;
  const left: OrderDetail[] = [
    { title: labels.contactInformation, lines: [state.contact.trim()] },
    state.isPickup
      ? { title: labels.pickupLocation, lines: [location?.name, location?.address] }
      : { title: labels.shippingAddress, lines: state.shippingLines },
    { title: state.isPickup ? labels.pickup : labels.shippingMethod, lines: [state.isPickup ? labels.pickupInStore : state.rate?.name] },
  ];
  const right: OrderDetail[] = [{ title: labels.paymentMethod, lines: [`${paidWith} · ${money(state.totals.total)}`] }];
  if (state.needsBilling) right.push({ title: labels.billingAddress, lines: state.billingLines });
  else if (!state.isPickup) right.push({ title: labels.billingAddress, lines: state.shippingLines });
  const mapPlace = state.isPickup
    ? (location?.name ?? '')
    : [state.shipping.city.trim(), hasRegions(state.shippingCountry) ? state.shipping.region : state.shippingCountry.name].filter(Boolean).join(' ');

  const summaryId = 'order-summary';
  return (
    <>
      <CheckoutLayout
        mainRef={mainRef}
        stage={stage}
        stageOffset={stageOffset}
        summaryId={summaryId}
        summaryLabel={labels.orderSummary}
        summaryOpen={summaryOpen}
        header={<CheckoutHeader storeName={storeName} logo={logo} homeHref={homeHref} cartHref={cartHref} cartLabel={labels.backToCart} />}
        entrance={!everLoaded}
        summaryBar={<OrderSummaryToggle open={summaryOpen} onToggle={() => setSummaryOpen(open => !open)} total={loading ? <Skeleton shape="pill" /> : money(state.totals.total)} controls={summaryId} />}
        summary={
          <div className={styles.swap}>
            {showSkeleton && <OrderSummarySkeleton items={Math.max(1, items.length)} className={leaving ? styles.leaving : undefined} />}
            {!loading && <div className={everLoaded ? styles.arriving : undefined}>{summary(true)}</div>}
          </div>
        }
      >
       <div className={styles.swap}>
        <h1 className={styles.srOnly}>{labels.checkout}</h1>
        {showSkeleton && <CheckoutSkeleton express={Boolean(expressButtons?.length)} className={leaving ? styles.leaving : undefined} />}
        {loading ? null : view === 'checkout' ? (
          <div className={styles.view} data-arriving={everLoaded ? '' : undefined} data-exiting={stage === 'exit' ? '' : undefined}>
            <form noValidate onSubmit={handleSubmit}>
              <div inert={state.busy}>
                {expressButtons && expressButtons.length > 0 && <ExpressCheckout buttons={expressButtons} loading={expressLoading} />}

                <section className={styles.section} data-tight={expressButtons?.length ? '' : undefined} data-first={expressButtons?.length ? undefined : ''}>
                  <div className={styles.sectionHead}>
                    <Heading level={2}>{labels.contact}</Heading>
                    {signInHref && <Link href={signInHref}>{labels.signIn}</Link>}
                  </div>
                  <ContactField value={state.contact} onChange={state.setContact} error={state.errors.contact} onBlur={state.blurContact} flag={state.shippingCountry.flag} />
                  <Checkbox className={styles.save} checked={state.marketing} onChange={event => state.setMarketing(event.target.checked)}>
                    {labels.marketing}
                  </Checkbox>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHead}>
                    <Heading level={2}>{labels.delivery}</Heading>
                  </div>
                  {pickupLocations.length > 0 && (
                    <SegmentedControl
                      name="delivery"
                      label={labels.deliveryMethod}
                      value={state.delivery}
                      onChange={value => state.setDelivery(value as 'ship' | 'pickup')}
                      options={[
                        { value: 'ship', label: labels.ship, icon: <TruckIcon /> },
                        { value: 'pickup', label: labels.pickUp, icon: <StoreIcon /> },
                      ]}
                    />
                  )}
                  <ContentSwap activeKey={state.delivery} from={state.isPickup ? 'end' : 'start'} className={pickupLocations.length > 0 ? styles.panes : undefined}>
                    {state.isPickup ? (
                      <PickupLocations locations={pickupLocations} value={state.pickup} onChange={state.setPickup} />
                    ) : (
                      <>
                        <AddressForm
                          value={state.shipping}
                          onChange={state.setShipping}
                          countries={state.countries}
                          errors={state.errors.shipping}
                          onBlurField={field => { if (field === 'postal') state.blurPostal('shipping'); }}
                          suggest={api.suggestAddresses}
                          onSuggestion={state.fillShipping}
                        />
                        <Checkbox className={styles.save} checked={state.saveInfo} onChange={event => state.setSaveInfo(event.target.checked)}>
                          {labels.saveInfo}
                        </Checkbox>
                        <div className={styles.sub}>
                          <Heading level={3}>{labels.shippingMethod}</Heading>
                          <div ref={shippingRef}>
                            <ShippingMethods status={state.rates.status} rates={state.rates.rates} value={state.rates.selected} onChange={state.rates.select} />
                          </div>
                        </div>
                      </>
                    )}
                  </ContentSwap>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHead}>
                    <Heading level={2}>{labels.payment}</Heading>
                  </div>
                  <p className={styles.sectionNote}>{labels.paymentNote}</p>
                  <Banner open={state.paymentFailed} title={labels.paymentFailedTitle}>
                    {labels.paymentFailedBody}
                  </Banner>
                  <PaymentMethods methods={state.paymentMethods} value={state.payment} onChange={state.setPayment} cardPanel={cardPanel} cardBrand={cardBrandOf(state.card.number)} />
                </section>

                <section className={cx(styles.section, styles.recap, subduedScheme)} aria-label={labels.orderSummary}>
                  <Heading level={2}>{labels.orderSummary}</Heading>
                  {summary(false)}
                </section>
              </div>

              <Button type="submit" fullWidth className={styles.pay} loading={state.busy}>
                {state.method.kind === 'manual' ? labels.completeOrder : labels.payNow}
              </Button>
            </form>

            {(policies?.length || footerNote != null) && (
              <footer className={styles.footer}>
                {policies && policies.length > 0 && <PolicyLinks policies={policies} />}
                {footerNote}
              </footer>
            )}
          </div>
        ) : (
          <ThankYou
            confirmation={confirmation ?? ''}
            firstName={state.shipping.firstName.trim() || (state.needsBilling ? state.billing.firstName.trim() : '')}
            mapLabel={state.isPickup ? labels.pickupLocation : labels.shippingAddress}
            mapPlace={mapPlace}
            details={[left, right]}
            helpHref={helpHref}
            onContinue={onContinueShopping}
            revealing={revealing}
            iconShown={iconShown}
            iconRef={iconRef}
            titleRef={titleRef}
          />
        )}
       </div>
      </CheckoutLayout>

      {bigTick && (
        <div className={styles.stage} aria-hidden>
          <ConfirmationCheck ref={bigTickRef} size={96} animated />
        </div>
      )}
    </>
  );
}
