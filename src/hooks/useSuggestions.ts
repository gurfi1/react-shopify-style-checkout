import { useCallback, useEffect, useRef, useState } from 'react';

export type Suggestions<T> = {
  options: T[];
  open: boolean;
  /** Index of the highlighted option, or -1. */
  active: number;
  setActive: (index: number) => void;
  /** Look up suggestions for the text. Shorter than `minChars` closes the list. */
  query: (text: string) => void;
  close: () => void;
  /** Move the highlight down (1) or up (-1), wrapping at the ends. */
  move: (step: 1 | -1) => void;
};

/**
 * Suggestion-list state with the race handled: when lookups overlap, only the latest one's
 * results are shown, and closing the list discards a lookup still in flight.
 */
export function useSuggestions<T>(search: (query: string) => Promise<T[]>, minChars = 3): Suggestions<T> {
  const [options, setOptions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const run = useRef(0);
  const latestSearch = useRef(search);
  useEffect(() => {
    latestSearch.current = search;
  });

  const close = useCallback(() => {
    run.current++;
    setOpen(false);
    setActive(-1);
  }, []);

  const query = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < minChars) return close();
      const mine = ++run.current;
      latestSearch
        .current(trimmed)
        .catch(() => [] as T[])
        .then(found => {
          if (mine !== run.current) return; // a newer keystroke, or a close, won
          if (!found.length) return close();
          setOptions(found);
          setActive(-1);
          setOpen(true);
        });
    },
    [minChars, close],
  );

  const move = useCallback(
    (step: 1 | -1) => {
      setActive(current => {
        if (!options.length) return -1;
        const next = step === 1 ? current + 1 : current < 0 ? options.length - 1 : current - 1;
        return (next + options.length) % options.length;
      });
    },
    [options.length],
  );

  return { options, open, active, setActive, query, close, move };
}
