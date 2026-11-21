import type { SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  /** Width and height in pixels. */
  size?: number;
};

const stroke = (width: number, join = true) => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  ...(join ? { strokeLinejoin: 'round' as const } : null),
});

const base = (size: number, box: number, props: IconProps) => ({
  width: size,
  height: size,
  viewBox: `0 0 ${box} ${box}`,
  'aria-hidden': true,
  ...props,
});

/** Shopping bag. The header's cart link. */
export function BagIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size, 24, props)} {...stroke(1.6)}>
      <path d="M6 8h12l-.8 10.2a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

/** Downward chevron. Selects and the summary toggle. */
export function ChevronDownIcon({ size = 12, ...props }: IconProps) {
  return (
    <svg {...base(size, 14, props)} {...stroke(1.5)}>
      <path d="m3 5.25 4 4 4-4" />
    </svg>
  );
}

/** Price tag. `dot` adds the punched hole. */
export function TagIcon({ size = 14, dot = false, ...props }: IconProps & { dot?: boolean }) {
  return (
    <svg {...base(size, 14, props)} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
      <path d="M2 6.9V3a1 1 0 0 1 1-1h3.9a1 1 0 0 1 .7.3l4.6 4.6a1 1 0 0 1 0 1.4l-3.9 3.9a1 1 0 0 1-1.4 0L2.3 7.6a1 1 0 0 1-.3-.7Z" />
      {dot && <circle cx="4.8" cy="4.8" r=".8" fill="currentColor" stroke="none" />}
    </svg>
  );
}

/** Small cross. Remove and close buttons. */
export function CloseIcon({ size = 10, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg {...base(size, 10, props)} {...stroke(Number(strokeWidth), false)}>
      <path d="m2 2 6 6M8 2 2 8" />
    </svg>
  );
}

/** Question mark in a circle. Tooltip trigger. */
export function InfoIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} {...stroke(1.4)}>
      <circle cx="9" cy="9" r="7" />
      <path d="M7.2 7.1a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.3" />
      <path d="M9 12.6v.1" />
    </svg>
  );
}

/** Padlock. Card number field. */
export function LockIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} {...stroke(1.4)}>
      <rect x="4" y="8" width="10" height="7" rx="1.6" />
      <path d="M6.2 8V6.3a2.8 2.8 0 0 1 5.6 0V8" />
    </svg>
  );
}

/** Magnifier. Address field. */
export function SearchIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} {...stroke(1.4, false)}>
      <circle cx="8" cy="8" r="5" />
      <path d="m15 15-3.4-3.4" />
    </svg>
  );
}

/** Delivery truck. "Ship". Mirrored in right-to-left pages, so it drives the way the text reads. */
export function TruckIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} {...stroke(1.4)} data-mirror-in-rtl="">
      <path d="M1.5 4.5h9v8h-9z" />
      <path d="M10.5 7h3.2l2.8 2.8v2.7h-6" />
      <circle cx="5" cy="13.2" r="1.6" fill="#fff" />
      <circle cx="13" cy="13.2" r="1.6" fill="#fff" />
    </svg>
  );
}

/** Shop front. "Pick up". */
export function StoreIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} {...stroke(1.4)}>
      <path d="M2.5 8v7h13V8" />
      <path d="M1.5 7 3 3h12l1.5 4a2.4 2.4 0 0 1-4.8 0 2.4 2.4 0 0 1-4.8 0 2.4 2.4 0 0 1-4.8 0" />
      <path d="M7 15v-4h4v4" />
    </svg>
  );
}

/** Exclamation mark in a circle. Error banner. */
export function AlertIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} {...stroke(1.5, false)}>
      <circle cx="9" cy="9" r="7" />
      <path d="M9 5.6v4" />
      <path d="M9 12.3v.1" />
    </svg>
  );
}

/** Tick. The same stroke the checkbox draws. */
export function TickIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size, 14, props)} {...stroke(2)}>
      <path d="M3 7.4l2.7 2.6L11 4.4" />
    </svg>
  );
}

/** Browser window with an arrow leaving it. Redirect-style payment methods. Mirrored in right-to-left pages. */
export function RedirectIllustration(props: Omit<SVGProps<SVGSVGElement>, 'children'>) {
  return (
    <svg width={132} height={56} viewBox="0 0 132 56" aria-hidden {...props} {...stroke(1.4)} data-mirror-in-rtl="">
      <rect x="16" y="6" width="80" height="44" rx="6" />
      <path d="M16 17h80" />
      <circle cx="23" cy="11.5" r="1" />
      <circle cx="28" cy="11.5" r="1" />
      <circle cx="33" cy="11.5" r="1" />
      <path d="M104 28h18m-6-6 6 6-6 6" />
    </svg>
  );
}
