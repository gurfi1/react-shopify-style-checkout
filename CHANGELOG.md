# Changelog

Notable changes to this project. Versions follow [semantic versioning](https://semver.org); while the version is below 1.0, any release may change props.

## 0.1.0

The first release.

### Included

- **`Checkout`**: the whole one-page checkout, with contact, delivery (ship or pick up), payment methods, order summary, discount codes, a page-load skeleton and an animated thank-you page.
- **18 checkout blocks** usable on their own: `CheckoutLayout`, `CheckoutSkeleton`, `ExpressCheckout`, `ContactField`, `AddressForm`, `AddressAutocomplete`, `ShippingMethods`, `PickupLocations`, `PaymentMethods`, `CardFields`, `OrderSummary` and its parts, `PolicyLinks`, `ConfirmationCheck`, `ConfirmationCode`, `MapCard`, `OrderDetails`, `ThankYou`.
- **23 building blocks**: `TextField`, `SelectField`, `Checkbox`, `Radio`, `ChoiceList`, `SegmentedControl`, `Button`, `Spinner`, `Tooltip`, `Combobox`, `Collapsible`, `ContentSwap`, `Reveal`, `Skeleton`, `Banner`, `Tag`, `Divider`, `Modal`, `Card`, `Thumbnail`, layout and text helpers, and an icon set.
- **Logic without interface**: `useCheckout`, `useShippingRates`, `useSuggestions`, `useAnimatedHeight`, `useReducedMotion`, and functions for card formatting, address formats, validation and totals, with unit tests.
- **`Theme`**: design tokens for colour, corners, shadows and motion; one `accent` value re-colours everything.
- **Wording and currency**: every label replaceable through `labels`; prices formatted from `locale` and `currency`.
- **A demo site** with the full checkout on canned data, galleries of every component in each state, recipes, and a foundations page.
- **Documentation**: a README beside every component, generated from its demo file, and eight topic pages in `docs/`.

### Known limits

- Card inputs are placeholders; real sites use a payment provider's hosted fields.
- Tested in Chromium and, once, in iOS Safari. Not tested in Firefox, desktop Safari or with a screen reader.
- Right-to-left layout is written for but not tested.
- Address formats ship for four countries; others are passed in.
- No component-level tests yet.
- A server cannot yet send an error for a specific field.
