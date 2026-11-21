/** Durations and curves measured on the reference checkout, for use from JavaScript. The CSS tokens hold the same values. */
export const DURATION = { faster: 89, fast: 133, base: 200, slow: 300, slower: 450, slowest: 675 } as const;
export const EASE = { default: 'ease-in-out', out: 'cubic-bezier(.3,.5,.5,1)', spring: 'cubic-bezier(.3,0,0,1)' } as const;

export const prefersReducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Resolves after `ms`, or at once when the visitor asked for reduced motion. */
export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, prefersReducedMotion() ? 0 : ms));

/** Forces layout so a following style change animates from the current state. */
export const reflow = (element: HTMLElement) => void element.offsetHeight;
