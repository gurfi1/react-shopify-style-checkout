import { createContext, useContext, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Theme.module.css';

type ThemeContextValue = { portal: HTMLElement | null };
const ThemeContext = createContext<ThemeContextValue>({ portal: null });

/** Where overlays such as `Modal` render, so they keep the theme's tokens. Falls back to `document.body`. */
export function usePortalTarget(): HTMLElement | null {
  const { portal } = useContext(ThemeContext);
  return portal ?? (typeof document === 'undefined' ? null : document.body);
}

export type ThemeProps = HTMLAttributes<HTMLDivElement> & {
  /** Brand colour for buttons, links, focus rings and selected rows. Hover and tint shades are derived from it. */
  accent?: string;
  children: ReactNode;
};

/** Sets the design tokens and base type for everything inside it. Every other component expects a Theme above it. */
export function Theme({ accent, className, style, children, ...rest }: ThemeProps) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const tokens = accent ? ({ '--accent': accent, ...style } as CSSProperties) : style;
  return (
    <ThemeContext.Provider value={{ portal }}>
      <div className={[styles.theme, className].filter(Boolean).join(' ')} style={tokens} {...rest}>
        {children}
        <div ref={setPortal} />
      </div>
    </ThemeContext.Provider>
  );
}

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

/** A grey area. Fields, borders and helper text inside it switch to the slightly darker scheme the order summary uses. */
export function Surface({ className, style, children, ...rest }: SurfaceProps) {
  return (
    <div className={[styles.subdued, className].filter(Boolean).join(' ')} style={{ background: 'var(--summary-bg)', ...style }} {...rest}>
      {children}
    </div>
  );
}

/** Class that switches an element's contents to the grey-surface scheme, for components that own their element. */
export const subduedScheme = styles.subdued;
