import { useEffect, useLayoutEffect, useRef } from 'react';
import { DURATION, EASE, prefersReducedMotion } from '../lib/motion';

/**
 * Animates an element's height whenever `dependency` changes, from the height it had before the change
 * to the height its new content needs. Returns the ref to attach.
 */
export function useAnimatedHeight<T extends HTMLElement>(dependency: unknown, duration: number = DURATION.slow, easing: string = EASE.out) {
  const ref = useRef<T>(null);
  const settled = useRef<number | null>(null);
  const running = useRef<Animation | null>(null);
  const previous = useRef(dependency);

  // Track the resting height, so growth caused by anything else (an error message opening) is not mistaken for a swap.
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    settled.current = element.offsetHeight;
    const observer = new ResizeObserver(() => {
      if (!running.current) settled.current = element.offsetHeight;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (previous.current === dependency) return;
    previous.current = dependency;
    const element = ref.current;
    if (!element) return;
    const from = running.current ? element.getBoundingClientRect().height : settled.current;
    running.current?.cancel();
    const to = element.offsetHeight;
    settled.current = to;
    if (from === null || Math.abs(from - to) < 0.5 || prefersReducedMotion()) return;
    element.style.overflow = 'hidden';
    const animation = element.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration, easing });
    running.current = animation;
    const done = () => {
      if (running.current !== animation) return;
      running.current = null;
      element.style.overflow = '';
    };
    animation.onfinish = done;
    animation.oncancel = done;
  }, [dependency, duration, easing]);

  return ref;
}
