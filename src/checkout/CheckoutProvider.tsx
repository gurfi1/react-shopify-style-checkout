import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { defaultLabels, type Labels } from '../labels';
import { formatMoney } from '../lib/money';

type Settings = { labels: Labels; locale: string; currency: string; money: (amount: number) => string };

const defaults: Settings = { labels: defaultLabels, locale: 'en-US', currency: 'USD', money: amount => formatMoney(amount) };
const SettingsContext = createContext<Settings>(defaults);

export type CheckoutProviderProps = {
  /** Wording to replace. Anything left out stays English. */
  labels?: Partial<Labels>;
  /** BCP 47 locale for number formatting, for example "en-GB". */
  locale?: string;
  /** ISO 4217 currency code, for example "GBP". */
  currency?: string;
  children: ReactNode;
};

/**
 * Wording and money formatting for the checkout blocks inside it. `Checkout` sets this up itself;
 * use it directly when composing blocks by hand. Without it, blocks use English and US dollars.
 */
export function CheckoutProvider({ labels, locale = 'en-US', currency = 'USD', children }: CheckoutProviderProps) {
  const value = useMemo<Settings>(
    () => ({ labels: { ...defaultLabels, ...labels }, locale, currency, money: amount => formatMoney(amount, locale, currency) }),
    [labels, locale, currency],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useCheckoutSettings = () => useContext(SettingsContext);
export const useLabels = () => useContext(SettingsContext).labels;
export const useMoney = () => useContext(SettingsContext).money;
