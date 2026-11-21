# Theming

Every colour, corner, shadow and timing is a token set by `Theme`. This page lists them and shows how to change them.

**On this page:** [Change the brand colour](#change-the-brand-colour) · [Change any token](#change-any-token) · [All tokens](#all-tokens) · [Grey surfaces](#grey-surfaces) · [Using the tokens yourself](#using-the-tokens-yourself)

## Change the brand colour

```tsx
<Checkout accent="#0a7c59" … />

// or, around your own components
<Theme accent="#0a7c59">…</Theme>
```

That one value re-colours buttons, links, focus rings, radios, checkboxes and selected rows. The hover shade, the selected-row tint and the focus ring are derived from it, so you do not set them.

Pick an accent that white text is readable on. The reference blue, `#334fb4`, has a contrast of about 7:1 against white.

## Change any token

Tokens are CSS custom properties on the element `Theme` renders. Override them with `style`:

```tsx
<Theme style={{ '--radius': '6px', '--radius-sm': '4px', '--radius-lg': '8px' } as React.CSSProperties}>
  …
</Theme>
```

or in your own stylesheet, by giving `Theme` a class:

```tsx
<Theme className="brand">…</Theme>
```

```css
.brand { --text-subdued: #5f6368; --border: #cfd4dc; }
```

To change the defaults for good, edit [`src/theme/Theme.module.css`](../src/theme/Theme.module.css).

## All tokens

### Colour

| Token | Default | Used for |
|---|---|---|
| `--accent` | `#334fb4` | Buttons, links, focus, selected rows, radio and checkbox fill |
| `--accent-hover` | accent mixed 72% with black | Hover on buttons and links |
| `--accent-subdued` | accent at 5% on white | Background of a selected choice row |
| `--ring` | accent at 30% opacity | The 3px focus ring |
| `--bg` | `#fff` | The form column, fields |
| `--summary-bg` | `#f5f5f5` | The summary column |
| `--bg-subdued` | `#f5f5f5` | Segmented track, payment panels, empty states |
| `--text` | `#000` | Body text |
| `--text-subdued` | `#707070` | Placeholders, small labels, helper text |
| `--border` | `#dedede` | Fields, rows, dividers |
| `--critical` | `#d91c1c` | Error borders, error text, the payment banner |
| `--skeleton` | `#e6e6e6` | Loading placeholders |

### Shape

| Token | Default | Used for |
|---|---|---|
| `--radius` | `12px` | Fields, buttons, choice lists, cards |
| `--radius-sm` | `8px` | Tooltip, segmented pill, tag |
| `--radius-lg` | `16px` | Thumbnails, modal |
| `--shadow-xs` | hairline + `0 1px 3px` at 4% | Thumbnails, segmented pill |
| `--shadow-pop` | hairline + `0 2px 5px` at 4% + `0 4px 18px` at 10% | Suggestion list, modal, map callout |

### Motion

| Token | Default | Used for |
|---|---|---|
| `--d-faster` | `89ms` | Reserved for the smallest changes |
| `--d-fast` | `133ms` | Focus rings, pills, radios, cross-fades |
| `--d-base` | `200ms` | Floating labels, collapsibles, hover |
| `--d-slow` | `300ms` | Slides, height changes, the tick drawing |
| `--d-slower` | `450ms` | Modal entrance |
| `--d-slowest` | `675ms` | Reserved for the largest moves |
| `--ease` | `ease-in-out` | Default |
| `--ease-out` | `cubic-bezier(.3, .5, .5, 1)` | Rings, pills, small movements |
| `--ease-spring` | `cubic-bezier(.3, 0, 0, 1)` | Things that appear: suggestion list, modal, banner |

When the visitor has asked their system for reduced motion, every animation and transition inside a `Theme` runs in 1ms.

### Type

Type is not tokenised. It is the system font at 14px with a 1.35 line height, in two weights, 400 and 600. `Heading` gives 20, 16 and 14px; `Text` gives 14 and 12px.

## Grey surfaces

On the grey summary column, the same greys that work on white would be too faint. Inside a `Surface` four tokens shift one step darker:

| Token | On white | On a `Surface` |
|---|---|---|
| `--bg-subdued` | `#f5f5f5` | `#ededed` |
| `--text-subdued` | `#707070` | `#666` |
| `--border` | `#dedede` | `#d6d6d6` |
| `--skeleton` | `#e6e6e6` | `#d6d6d6` |

```tsx
<Surface style={{ padding: 40 }}>
  <OrderSummary … />
</Surface>
```

Both pairs of subdued text meet the 4.5:1 contrast minimum on their background.

## Using the tokens yourself

In CSS, inside a `Theme`:

```css
.my-card { border: 1px solid var(--border); border-radius: var(--radius); transition: opacity var(--d-base) var(--ease); }
```

In JavaScript, the durations and curves are exported with the same values:

```ts
import { DURATION, EASE } from './checkout-kit';

element.animate(keyframes, { duration: DURATION.slow, easing: EASE.out });
```

The Foundations page of the demo site shows every token, with a section where each duration and curve can be played.
