import { useCallback, useEffect, useRef, useState } from 'react';
import { addressKey, isAddressComplete } from '../lib/address';
import type { Address, Country, ShippingRate } from '../types';

/** empty: no complete address yet. loading: asking. none: the address cannot be shipped to. ready: rates to choose from. */
export type RatesStatus = 'empty' | 'loading' | 'none' | 'ready';

export type UseShippingRatesOptions = {
  address: Address;
  /** The address's country, for knowing whether a region is required. */
  country: Country;
  /** Fetches the rates. Resolve to [] when the address cannot be shipped to. A rejection is treated the same. */
  load: (address: Address) => Promise<ShippingRate[]>;
  /** How long to wait after the address stops changing. */
  delay?: number;
};

export type ShippingRates = {
  status: RatesStatus;
  rates: ShippingRate[];
  /** Id of the chosen rate, or null. */
  selected: string | null;
  select: (id: string) => void;
  /**
   * Loads rates for the current address right away if that has not happened, and resolves once the
   * status is final. Use it before placing an order so a rate is chosen for exactly this address.
   */
  settle: () => Promise<{ status: RatesStatus; selected: string | null }>;
  /** Makes the next address change load at once instead of after the delay, for a chosen suggestion. */
  expedite: () => void;
};

/**
 * Shipping rates that follow an address. They load once the address is complete and again whenever it
 * changes, after a short typing pause. A slow answer for an old address is ignored.
 */
export function useShippingRates({ address, country, load, delay = 500 }: UseShippingRatesOptions): ShippingRates {
  const [status, setStatus] = useState<RatesStatus>('empty');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selected, setSelectedState] = useState<string | null>(null);

  const latest = useRef({ address, country, load, delay });
  const statusRef = useRef<RatesStatus>('empty');
  const selectedRef = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const run = useRef(0);
  const started = useRef<{ key: string; promise: Promise<RatesStatus> } | null>(null);
  const settled = useRef<Promise<RatesStatus>>(Promise.resolve('empty'));
  const immediateNext = useRef(false);

  const apply = (next: RatesStatus) => {
    statusRef.current = next;
    setStatus(next);
  };
  // The ref lets `settle` report the choice as it is now, not as it was when the caller last rendered.
  const select = useCallback((id: string) => {
    selectedRef.current = id;
    setSelectedState(id);
  }, []);

  const check = useCallback((immediate: boolean) => {
    clearTimeout(timer.current);
    const { address: current, country: currentCountry, load: currentLoad, delay: currentDelay } = latest.current;
    if (!isAddressComplete(current, currentCountry)) {
      run.current++;
      started.current = null;
      settled.current = Promise.resolve('empty');
      apply('empty');
      return;
    }
    const key = addressKey(current);
    if (started.current?.key === key) {
      settled.current = started.current.promise;
      return;
    }
    settled.current = new Promise(resolve => {
      timer.current = setTimeout(() => {
        const mine = ++run.current;
        apply('loading');
        const promise = currentLoad(current)
          .catch(() => [] as ShippingRate[])
          .then(list => {
            if (mine !== run.current) return statusRef.current; // the address changed again meanwhile
            if (list.length) {
              setRates(list);
              select(list.some(rate => rate.id === selectedRef.current) ? (selectedRef.current as string) : list[0].id);
            }
            const next: RatesStatus = list.length ? 'ready' : 'none';
            apply(next);
            return next;
          });
        started.current = { key, promise };
        resolve(promise);
      }, immediate ? 0 : currentDelay);
    });
  }, [select]);

  const key = addressKey(address);
  const complete = isAddressComplete(address, country);
  useEffect(() => {
    latest.current = { address, country, load, delay };
  });
  useEffect(() => {
    check(immediateNext.current);
    immediateNext.current = false;
    return () => clearTimeout(timer.current);
  }, [key, complete, check]);

  const settle = useCallback(() => {
    check(true);
    return settled.current.then(final => ({ status: final, selected: selectedRef.current }));
  }, [check]);

  const expedite = useCallback(() => {
    immediateNext.current = true;
  }, []);

  return { status, rates, selected, select, settle, expedite };
}
