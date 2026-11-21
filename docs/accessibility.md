# Accessibility

What is built in, what was tested and how, and what is still missing. Last checked for version 0.1.0.

**On this page:** [What is built in](#what-is-built-in) · [What was tested](#what-was-tested) · [Known gaps](#known-gaps) · [Keyboard reference](#keyboard-reference)

## What is built in

| Area | How it works |
|---|---|
| Labels | Every input has a real `<label>`. The placeholder repeats it and the label stays visible once the field is filled |
| Errors | An invalid field gets `aria-invalid` and is linked to its message with `aria-describedby`. On submit, focus moves to the first invalid field and it scrolls into view |
| Radio groups | Shipping, pick-up, payment and the Ship / Pick up switch are native radios inside a labelled `radiogroup`, so arrow keys move between options |
| Address suggestions | The field is a `combobox` with `aria-expanded`, `aria-controls` and `aria-activedescendant`. The list is a `listbox` of `option`s |
| Tooltips | `role="tooltip"`, linked with `aria-describedby`, shown on keyboard focus as well as hover |
| Modal | `role="dialog"` with `aria-modal`, named by its title. Focus moves in when it opens, stays inside while it is open, and returns to the link that opened it. Escape closes it. Page scroll is locked |
| Payment failure | The banner is `role="alert"`, scrolls into view and takes focus |
| Processing | The pay button is `aria-busy` and the rest of the form is `inert` |
| Order confirmed | Focus moves to the thank-you heading |
| Page heading | A visually hidden level-one heading, "Checkout" |
| Focus | Every interactive element shows the same 3px ring on keyboard focus |
| Contrast | Body text is black on white. Subdued text is `#707070` on white and `#666` on `#f5f5f5`, both above 4.5:1 |
| Reduced motion | With the system setting on, every animation and transition runs in 1ms and scripted waits are skipped |
| Zoom on iOS | Field text is 16px on touch devices, so Safari does not zoom the page when a field is focused |
| Decorative graphics | Icons, the map and the skeletons are hidden from screen readers. The confirmation code is read as one string, not character by character |

## What was tested

| Check | How | Result |
|---|---|---|
| Automated scan | axe-core 4, on the checkout untouched, with field errors, filled in with rates loaded, with the payment declined, and on the thank-you page | No violations in any of the five states |
| Automated scan, demo site | axe-core 4 on the four gallery pages | Clean, except that the `CheckoutLayout` preview nests one `main` landmark inside the gallery's own. That is an artefact of previewing a page layout inside a page |
| Keyboard only | The whole flow with Tab, typing, arrow keys and Enter, in headless Chromium | Every control reached in a sensible order; an order placed; focus landed on the thank-you heading |
| Reduced motion | The whole flow with the setting emulated, including a declined card | Completed; all transitions measured at 1ms; final state correct |
| iOS Safari | iOS 26.2 in the Simulator, iPhone 17 Pro: typing, the typo suggestion, the summary toggle, pick-up, cash on delivery, placing an order | Completed. This pass found the zoom-on-focus problem, now fixed |

**Not tested:** a screen reader (VoiceOver, NVDA, JAWS), Firefox, desktop Safari, Android, and Windows high-contrast mode. Right-to-left layout was tested with Hebrew in Chromium only; see [wording-and-locale.md](wording-and-locale.md#right-to-left-languages).

## Known gaps

These are known and not yet fixed. Each would make a good pull request.

1. **Loading is silent.** When shipping rates load, or a discount is being checked, sighted users see a skeleton or spinner. Screen-reader users hear nothing until it finishes. A polite live region would fix this.
2. **Tab order on wide screens.** The order summary comes before the form in the page's source, which is right for small screens where it sits on top. On wide screens it is on the right, so the discount field is reached by Tab before the form's first field.
3. **No screen-reader pass.** The roles and names above are in place and the automated scan is clean, but nobody has listened to the whole flow.
4. **Server-side field errors.** A failed order always shows the payment banner. There is no way yet to show a server's message under a specific field.

## Keyboard reference

| Where | Keys |
|---|---|
| Anywhere | Tab and Shift+Tab move between controls |
| Radio groups (Ship / Pick up, shipping, pick-up, payment) | Arrow keys change the selection |
| Checkboxes | Space toggles |
| Address suggestions | Down and Up move through the list; Enter chooses; Escape closes |
| Selects | The browser's own behaviour: type to jump, arrows to move |
| Modal | Escape closes; Tab stays inside |
| Form | Enter in a field submits; the first invalid field takes focus |
