import { useEffect, useRef, useState } from 'react';
import {
  AlertIcon, BagIcon, ChevronDownIcon, CloseIcon, DURATION, EASE, Heading, InfoIcon, Link, LockIcon, SearchIcon, StoreIcon, Surface, TagIcon, Text, Theme, TickIcon, TruckIcon,
} from '../src';
import { Entry, PageHead } from './Gallery';

export const FOUNDATION_SECTIONS = ['Colour', 'Shape and shadow', 'Type', 'Motion', 'Icons'];

const COLOURS: [token: string, value: string, use: string][] = [
  ['--accent', '#334fb4', 'Buttons, links, focus, selected rows'],
  ['--accent-hover', 'accent 72% + black', 'Hover on buttons and links'],
  ['--accent-subdued', 'accent 5% on white', 'Selected choice row'],
  ['--ring', 'accent at 30%', '3px focus ring'],
  ['--bg', '#fff', 'Main column, fields'],
  ['--summary-bg', '#f5f5f5', 'Summary column'],
  ['--bg-subdued', '#f5f5f5', 'Tracks, panels, empty states'],
  ['--text', '#000', 'Body text'],
  ['--text-subdued', '#707070', 'Placeholders, labels, helper text'],
  ['--border', '#dedede', 'Fields, rows, dividers'],
  ['--critical', '#d91c1c', 'Errors and the payment banner'],
  ['--skeleton', '#e6e6e6', 'Loading placeholders'],
];

const DURATIONS: [token: string, ms: number, use: string][] = [
  ['--d-faster', DURATION.faster, 'Reserved for the smallest changes'],
  ['--d-fast', DURATION.fast, 'Rings, pills, radios, cross-fades'],
  ['--d-base', DURATION.base, 'Labels, collapsibles, hover'],
  ['--d-slow', DURATION.slow, 'Slides, height changes, tick drawing'],
  ['--d-slower', DURATION.slower, 'Modal entrance'],
  ['--d-slowest', DURATION.slowest, 'Reserved for the largest moves'],
];

const EASINGS: [token: string, value: string, use: string][] = [
  ['--ease', EASE.default, 'Default'],
  ['--ease-out', EASE.out, 'Rings, pills, small movements'],
  ['--ease-spring', EASE.spring, 'Things that appear: lists, modal, banner'],
];

function Track({ duration, easing, run }: { duration: number; easing: string; run: number }) {
  const dot = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = dot.current;
    if (!element || !run) return;
    const distance = (element.parentElement?.clientWidth ?? 0) - 28;
    element.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${distance}px)` }], { duration, easing, fill: 'forwards' });
  }, [run, duration, easing]);
  return (
    <div className="site-track">
      <i ref={dot} />
    </div>
  );
}

const ICONS = [
  ['BagIcon', <BagIcon key="i" />], ['ChevronDownIcon', <ChevronDownIcon key="i" size={18} />], ['TagIcon', <TagIcon key="i" size={18} dot />],
  ['CloseIcon', <CloseIcon key="i" size={16} />], ['InfoIcon', <InfoIcon key="i" />], ['LockIcon', <LockIcon key="i" />],
  ['SearchIcon', <SearchIcon key="i" />], ['TruckIcon', <TruckIcon key="i" />], ['StoreIcon', <StoreIcon key="i" />],
  ['AlertIcon', <AlertIcon key="i" />], ['TickIcon', <TickIcon key="i" size={18} />],
] as const;

export function Foundations() {
  const [run, setRun] = useState(0);
  const [accent, setAccent] = useState('#334fb4');
  return (
    <>
      <PageHead
        title="Foundations"
        lead="Every component reads its colours, corners, shadows and timings from tokens set by Theme. The values were measured on the reference checkout; change them in one place and everything follows."
      />

      <Entry
        title="Colour"
        summary="Twelve tokens. Three of them are derived from the accent, so one value re-colours buttons, links, focus rings and selected rows. On a grey Surface the subdued tokens shift a step darker."
        usage={`<Theme accent="#0a7c59">…</Theme>`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <label htmlFor="accent-pick">Try an accent:</label>
          <input id="accent-pick" type="color" value={accent} onChange={event => setAccent(event.target.value)} />
          <Link onClick={() => setAccent('#334fb4')}>Reset</Link>
        </div>
        <Theme accent={accent}>
          <div className="site-swatches">
            {COLOURS.map(([token, value, use]) => (
              <div key={token} className="site-swatch">
                <i style={{ background: `var(${token})` }} />
                <div>
                  <b>{token}</b>
                  <span>{token === '--accent' ? accent : value}<br />{use}</span>
                </div>
              </div>
            ))}
          </div>
          <Surface style={{ marginTop: 20, padding: 16, borderRadius: 12 }}>
            <Text>On a grey surface</Text>
            <Text tone="subdued">Subdued text is #666, borders #d6d6d6, panels #ededed.</Text>
          </Surface>
        </Theme>
      </Entry>

      <Entry title="Shape and shadow" summary="Three corner sizes and two shadows. Fields, buttons and lists use 12px; pills, tooltips and tags 8px; thumbnails and the modal 16px.">
        <div className="site-row">
          <div className="site-tile" style={{ borderRadius: 'var(--radius-sm)' }}>--radius-sm<br />8px</div>
          <div className="site-tile" style={{ borderRadius: 'var(--radius)' }}>--radius<br />12px</div>
          <div className="site-tile" style={{ borderRadius: 'var(--radius-lg)' }}>--radius-lg<br />16px</div>
          <div className="site-tile" style={{ borderRadius: 'var(--radius)', border: 0, boxShadow: 'var(--shadow-xs)' }}>--shadow-xs</div>
          <div className="site-tile" style={{ borderRadius: 'var(--radius)', border: 0, boxShadow: 'var(--shadow-pop)' }}>--shadow-pop</div>
        </div>
      </Entry>

      <Entry title="Type" summary="The system font at 14px with a 1.35 line height. Two weights, 400 and 600. Spacing follows a short scale: 10px between fields, 14px from a heading to its content, 32px between sections.">
        <div style={{ display: 'grid', gap: 14 }}>
          <Heading level={2}>Section title · 20 / 1.2 / 600</Heading>
          <Heading level={3}>Sub-section · 16 / 1.3 / 600</Heading>
          <Heading level={4}>Detail label · 14 / 600</Heading>
          <Text>Body · 14 / 1.35 / 400</Text>
          <Text size="small" tone="subdued">Small · 12 / 400, subdued</Text>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Total · 18 / 600</Text>
        </div>
      </Entry>

      <Entry
        title="Motion"
        summary="Six durations and three curves cover every transition. With reduced motion requested, everything runs in 1ms."
        usage={`transition: opacity var(--d-base) var(--ease);

import { DURATION, EASE } from './checkout';
element.animate(keyframes, { duration: DURATION.slow, easing: EASE.out });`}
      >
        <p style={{ marginBottom: 16 }}>
          <Link onClick={() => setRun(count => count + 1)}>Play all</Link>
        </p>
        <Heading level={3} style={{ marginBottom: 10 }}>Durations, with the default curve</Heading>
        <div className="site-motion">
          {DURATIONS.map(([token, ms]) => (
            <div key={token} style={{ display: 'contents' }}>
              <code>{token} · {ms}ms</code>
              <Track duration={ms} easing={EASE.default} run={run} />
            </div>
          ))}
        </div>
        <Heading level={3} style={{ margin: '24px 0 10px' }}>Curves, at 675ms so the difference shows</Heading>
        <div className="site-motion">
          {EASINGS.map(([token, value]) => (
            <div key={token} style={{ display: 'contents' }}>
              <code title={value}>{token}</code>
              <Track duration={675} easing={value} run={run} />
            </div>
          ))}
        </div>
      </Entry>

      <Entry
        title="Icons"
        summary="Eleven icons drawn for this project as stroked paths. They take the current text colour and a size."
        usage={`import { LockIcon, TruckIcon } from './checkout';

<LockIcon />
<TruckIcon size={24} />`}
      >
        <div className="site-icons">
          {ICONS.map(([name, icon]) => (
            <div key={name} className="site-icon">
              {icon}
              {name}
            </div>
          ))}
        </div>
      </Entry>
    </>
  );
}
