# Design specification

The measurements and motion behind the components, and where each number came from.

**On this page:** [Where the numbers come from](#where-the-numbers-come-from) · [Layout](#layout) · [Type and spacing](#type-and-spacing) · [Fields](#fields) · [Motion](#motion) · [Page-load sequence](#page-load-sequence) · [Thank-you sequence](#thank-you-sequence) · [Responsive behaviour](#responsive-behaviour) · [Edge cases](#edge-cases)

Tokens (colours, corners, shadows, durations, curves) are listed in [theming.md](theming.md). Each component's own details are in the README beside it.

## Where the numbers come from

The design is modelled on Shopify's one-page checkout, as it appeared on a public Shopify demo store in late 2026. The code, the wording and the interface icons in this repository were written for this project. This is an independent project and is not affiliated with Shopify.

Not every number has the same standing:

| Standing | What |
|---|---|
| **Measured** from the rendered page | The layout grid and widths, type sizes, colours, corners, shadows, the six durations and three curves, the floating-label field, focus ring, error styling, radios and choice rows, the shipping skeleton and empty state, the suggestion list, tooltip, spinner, modal timings, the circle and tick timings |
| **Measured** from a screen recording | The page-load sequence: shell, skeleton shapes and their positions, the cross-fade |
| **Timings from the stylesheet, staging interpreted** | The Ship / Pick up switch and the thank-you sequence. The durations and curves were read from the page's stylesheet; how the pieces are choreographed is this project's interpretation |
| **Added from general knowledge, not verified** | The phone flag chip, the email typo suggestion, card badges dimming to the detected brand, the discount tag, the order summary repeated above the pay button on small screens, the pay button's label changing with the payment method |

The accent colour is the one that demo store used. Shopify takes it from each merchant's branding, so any brand colour is equally right.

## Layout

| Region | Measurements |
|---|---|
| Header | Full width, white, 1px bottom border. 20px vertical padding around a 40px row (81px in all). Inner row up to 980px wide, centred |
| Two columns, from 1000px | A grid of `calc(50% + 50px)` and the remainder, so the divider sits 50px right of centre |
| Form column | White. Content box up to 580px with 40px padding (500px usable), right-aligned to the divider |
| Summary column | `#f5f5f5` with a 1px border on its inner edge. Content box up to 480px with 40px padding (400px usable), sticky to the top |
| One column, below 1000px | Header, summary bar, collapsible summary, form. 20px padding, up to 580px wide, centred |

## Type and spacing

The system font stack, 14px with a 1.35 line height, in weights 400 and 600 only.

| Text | Size / weight |
|---|---|
| Section title (Contact, Delivery, Payment) | 20px / 600, line height 1.2 |
| Sub-section (Shipping method) | 16px / 600, line height 1.3 |
| Body | 14px / 400 |
| Small and helper text | 12px / 400 |
| Total | 18px / 600 |
| Thank-you title | 22px / 600 |

| Space | Size |
|---|---|
| Between sections | 32px |
| Section title to its content | 14px |
| Between fields, in rows and between rows | 10px |
| Sub-section title | 24px above, 12px below |
| Inside a choice row | 14px padding, 10px between radio and text |

## Fields

| Part | Measurement |
|---|---|
| Height | 49px (47px input, 1px border each side) |
| Padding, empty | 13.5px top and bottom, 10px sides |
| Padding, filled | 21px top, 6px bottom, to make room for the label |
| Label | 12px, 6px from the top, 11px from the side. Hidden (transparent, 3px low) until the field has a value |
| Focus | Border turns accent, a 0.5px accent hairline appears, and a 3px ring at 30% accent grows around the field |
| Error | Border and hairline turn `#d91c1c`; a 14px message opens 6px below |
| Text size on touch devices | 16px, because iOS Safari zooms the page on any focused field under 16px |

## Motion

Durations and curves are the tokens from [theming.md](theming.md).

| Element | Trigger | What moves | Duration | Curve |
|---|---|---|---|---|
| Field label | Value entered or cleared | Fades, rises 3px; the input's padding shifts | 200ms | ease-in-out |
| Focus ring | Focus | Border colour; outline grows 0 to 3px | 200ms; 133ms | ease-in-out; ease-out |
| Error message | Shown or cleared | Height and opacity | 200ms | ease-in-out |
| Checkbox | Ticked | Box fills, then the tick draws as a stroke | 133ms; 300ms after 5ms | ease-out; linear |
| Radio | Selected | Border thickens from 1px to 6px | 133ms | ease-out |
| Choice row | Selected | Background and border colour | 133ms | ease-in-out |
| Segmented pill | Switched | Slides one slot | 133ms | ease-out |
| Swapped content | Ship / Pick up, shipping states | Fades in; nudges in from 1% to the side; container height follows | 133ms; 300ms; 300ms | linear; ease-out; ease-out |
| Collapsible | Panels, billing form, discount rows, banner | Grid row from `0fr` to `1fr`, clipped only while moving | 200ms | ease-in-out |
| Skeleton | While loading | Opacity 1 to 0.5 and back | 1350ms loop | ease-in-out |
| Suggestion list | Opens | Fades in, drops 8px | 200ms | spring |
| Tooltip | Hover or focus | Fades in, rises 4px | 133ms | ease-in-out |
| Button | Hover | Background colour | 200ms | ease-in-out |
| Button | Loading | Label and spinner cross-fade | 133ms | ease-out |
| Spinner | While loading | Two full turns per cycle while the arc grows from 6% to 74% of the circle and back | 1600ms loop | per-keyframe curves |
| Discount tag | Applied | Scale 0.5 to 1.1 to 1, fading in | 400ms | ease |
| Payment banner | Shown | Fades in, drops 8px | 200ms | spring |
| Modal backdrop | Open / close | Opacity | 300ms / 200ms | ease-out / ease-in |
| Modal dialog | Open / close | Scale 0.98 to 1, opacity | 450ms / 200ms | spring / ease-in |
| Summary, small screens | Toggled | Height; chevron turns 180° | 200ms | ease-in-out |
| Wallet buttons | After the page arrives | Grey pulsing placeholders, then colour and logo fade in | 700ms wait, then 300ms | ease |

With reduced motion requested, all of these run in 1ms and the scripted waits are skipped.

## Page-load sequence

Shown while `Checkout`'s `loading` prop is true.

| At | What happens | Duration |
|---|---|---|
| 0ms | The shell: header, white form column, grey summary column, all empty | |
| 160ms | Skeleton shapes fade in. Form column: a 140×10 label, three 48px-tall button shapes, then sections of a 90×14 heading and two 10px lines. Summary: a 64px product square with two bars, three rows, the total | 133ms, linear |
| while waiting | The shapes pulse | 1350ms loop |
| when loading ends | The skeleton fades out while the real page fades in on top of it | 133ms out; 200ms in |
| +700ms | The wallet buttons take their colours | 300ms |

The 160ms delay means a load that finishes quickly never flashes a skeleton.

## Thank-you sequence

Runs in `Checkout` once `placeOrder` resolves. Times are from that moment.

| At | What happens | Duration | Curve |
|---|---|---|---|
| 0ms | The form sinks 28px, blurs and fades. The summary fades; its column turns white | 300ms | ease-in |
| 320ms | The page becomes one centred column. A 96px circle draws at the centre of the screen: it grows from 30%, turns 175°, and its stroke thins from 9 to 2 | 540ms | `cubic-bezier(.4, 0, .8, .6)` |
| 860ms | The tick draws inside the circle | 380ms | `cubic-bezier(0, 0, .3, 1)` |
| 1240ms | Hold | 120ms | |
| 1360ms | The icon swells to 108%, then shrinks to 50px and flies to its place beside the heading. The page's parts rise in beneath it, 90ms apart | 520ms; 400ms each | `cubic-bezier(.16, 1, .3, 1)` |
| 1660ms | The confirmation code appears one character at a time, 13ms apart, with a slight overshoot | 520ms each | `cubic-bezier(.34, 1.42, .64, 1)` |
| 1660ms | The map settles from 112%; the pin pops; the callout rises | 700ms; 450ms; 300ms | see `MapCard.module.css` |
| 2530ms | The column slides to its normal place. The summary column regains its grey and its content slides in from 85% scale, sharpening from a blur | 400ms | `cubic-bezier(.2, .8, 0, 1)` |

Below 1000px the column steps are skipped; the rest is the same. Focus moves to the heading when the content appears, so screen readers announce it.

## Responsive behaviour

| Width | What changes |
|---|---|
| 1000px and up | Two columns, sticky summary. The summary bar and the repeated summary are hidden |
| Below 1000px | One column. The summary collapses behind a bar that shows the total. The summary is repeated above the pay button |
| Form narrower than 420px | City / State / ZIP stack into one column. This follows the form's own width, not the window's |
| Below 480px | Wallet buttons stack; order details on the thank-you page become one column |

## Edge cases

- **Pay pressed before rates finish:** the order waits for the rates, then goes ahead. If none come back it stops and scrolls to the shipping section.
- **Address edited after rates loaded:** rates reload; a slow answer for the old address is ignored.
- **Address changed and changed back quickly:** the rates already loaded for that address are reused.
- **Fast typing in the address field:** only the latest lookup's results are shown.
- **Long field labels:** truncate with an ellipsis. Long values scroll inside the field.
- **Long product names:** wrap; the price stays right-aligned.
- **Browser autofill:** the floating label still moves out of the way.
- **Not built:** a scrolling product list for very large carts; tax lines; gift cards as a separate row; saved addresses for signed-in customers.
