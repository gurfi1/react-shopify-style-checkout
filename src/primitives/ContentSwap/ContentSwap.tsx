import { useState, type ReactNode } from 'react';
import { useAnimatedHeight } from '../../hooks/useAnimatedHeight';
import styles from './ContentSwap.module.css';

export type ContentSwapProps = {
  /** Identifies what is showing. When it changes, the new content animates in. */
  activeKey: string;
  /** Which side the new content nudges in from. */
  from?: 'start' | 'end';
  className?: string;
  id?: string;
  /** The content for the current `activeKey`. */
  children: ReactNode;
};

/**
 * Replaces one piece of content with another in the same place: the new content fades in over 133ms
 * while sliding 1% sideways, and the container's height animates to fit over 300ms.
 */
export function ContentSwap({ activeKey, from = 'start', className, id, children }: ContentSwapProps) {
  const ref = useAnimatedHeight<HTMLDivElement>(activeKey);
  // The first content simply appears; only later swaps animate.
  const [first] = useState(activeKey);
  const [moved, setMoved] = useState(false);
  if (!moved && activeKey !== first) setMoved(true);
  return (
    <div ref={ref} className={className} id={id}>
      <div key={activeKey} className={moved ? (from === 'end' ? styles.inEnd : styles.in) : undefined}>
        {children}
      </div>
    </div>
  );
}
