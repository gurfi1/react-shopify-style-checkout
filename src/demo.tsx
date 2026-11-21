import type { ComponentType, CSSProperties, ReactNode } from 'react';

/** What each `*.demo.tsx` file exports. The local site collects these into its galleries. */
export type Demo = {
  title: string;
  group: 'Components' | 'Checkout blocks';
  /** Position within the group. */
  order: number;
  /** One or two sentences: what it is and when to use it. */
  summary: string;
  /** Code that uses the component. */
  usage: string;
  /** [name, type, description] rows. */
  props?: [name: string, type: string, description: string][];
  /** The live example, showing each state. */
  Example: ComponentType;
};

const caption: CSSProperties = { fontSize: 12, color: 'var(--text-subdued)', marginBottom: 8 };

/** One labelled state inside a demo. */
export function State({ label, width, children }: { label: string; width?: number | string; children: ReactNode }) {
  return (
    <div style={{ width, minWidth: 0 }}>
      <p style={caption}>{label}</p>
      {children}
    </div>
  );
}

/** Lays demo states out in a wrapping row, or a column when `stacked`. */
export function States({ stacked = false, children }: { stacked?: boolean; children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', flexWrap: 'wrap', gap: stacked ? 24 : '24px 32px', alignItems: 'flex-start' }}>{children}</div>;
}
