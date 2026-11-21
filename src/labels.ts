/**
 * Every piece of wording the checkout shows, in English.
 * Pass a partial object as `labels` to `Checkout` (or to `CheckoutProvider`) to translate or reword.
 */
export const defaultLabels = {
  // Header and layout
  checkout: 'Checkout',
  backToCart: 'Back to cart',
  orderSummary: 'Order summary',
  close: 'Close',
  moreInformation: 'More information',

  // Express checkout
  expressCheckout: 'Express checkout',
  or: 'OR',

  // Contact
  contact: 'Contact',
  signIn: 'Sign in',
  contactField: 'Email or mobile phone number',
  contactTooltip: 'We use this to send your order confirmation and updates',
  didYouMean: (suggestion: string) => ['Did you mean ', suggestion, '?'] as [before: string, suggestion: string, after: string],
  marketing: 'Email me with news and offers',

  // Delivery
  delivery: 'Delivery',
  deliveryMethod: 'Delivery method',
  ship: 'Ship',
  pickUp: 'Pick up',
  country: 'Country/Region',
  firstName: 'First name (optional)',
  lastName: 'Last name',
  address: 'Address',
  apartment: 'Apartment, suite, etc. (optional)',
  city: 'City',
  suggestions: 'Suggestions',
  closeSuggestions: 'Close suggestions',
  addressSuggestions: 'Address suggestions',
  saveInfo: 'Save this information for next time',
  shippingMethod: 'Shipping method',
  shippingEmpty: 'Add your shipping address to see the shipping options.',
  shippingNone: 'Shipping is not available for this address. Check the address or choose pick up.',
  free: 'FREE',
  pickupLocations: 'Pickup locations',
  pickupCount: (count: number) => (count === 1 ? 'There is 1 location with stock close to you' : `There are ${count} locations with stock close to you`),
  pickupLocation: 'Pickup location',

  // Payment
  payment: 'Payment',
  paymentNote: 'Your payment details are encrypted and processed securely.',
  paymentMethod: 'Payment method',
  paymentFailedTitle: 'Your payment didn’t go through.',
  paymentFailedBody: 'Try again or use a different payment method.',
  cardNumber: 'Card number',
  expiry: 'Expiration date (MM / YY)',
  securityCode: 'Security code',
  securityCodeTooltip: 'The 3-digit code on the back of your card. American Express uses a 4-digit code on the front.',
  nameOnCard: 'Name on card',
  moreCards: 'Discover, Diners Club, JCB and UnionPay',
  moreCardsCount: '+4',
  billingSame: 'Use shipping address as billing address',
  billingAddress: 'Billing address',
  payNow: 'Pay now',
  completeOrder: 'Complete order',

  // Order summary
  discountField: 'Discount code or gift card',
  apply: 'Apply',
  removeDiscount: 'Remove discount',
  subtotal: (items: number) => `Subtotal · ${items} ${items === 1 ? 'item' : 'items'}`,
  discount: 'Discount',
  shipping: 'Shipping',
  pickup: 'Pickup',
  enterShippingAddress: 'Enter shipping address',
  total: 'Total',
  totalSavings: 'Total savings',

  // Field errors
  errorContactRequired: 'Enter an email or phone number',
  errorEmail: 'Enter a valid email',
  errorPhone: 'Enter a valid phone number',
  errorLastName: 'Enter a last name',
  errorAddress: 'Enter an address',
  errorCity: 'Enter a city',
  errorRegion: (regionLabel: string) => `Select a ${regionLabel.toLowerCase()}`,
  errorPostalRequired: (postalWord: string) => `Enter a ${postalWord}`,
  errorPostalInvalid: (postalWord: string) => `Enter a valid ${postalWord}`,
  errorCardRequired: 'Enter a card number',
  errorCardInvalid: 'Enter a valid card number',
  errorExpiry: 'Enter a valid expiration date',
  errorSecurityCode: 'Enter the CVV or security code on your card',
  errorNameOnCard: 'Enter your name exactly as it’s written on your card',

  // Thank-you page
  confirmation: 'Confirmation',
  thankYou: (firstName: string) => (firstName ? `Thank you, ${firstName}!` : 'Thank you!'),
  orderConfirmed: 'Your order is confirmed',
  orderConfirmedBody: 'We’ve emailed you a confirmation with your order number.',
  orderDetails: 'Order details',
  contactInformation: 'Contact information',
  shippingAddress: 'Shipping address',
  pickupInStore: 'Pick up in store',
  cardEnding: (brand: string, last4: string) => `${brand} ending with ${last4}`,
  card: 'Card',
  needHelp: 'Need help?',
  contactUs: 'Contact us',
  continueShopping: 'Continue shopping',
};

export type Labels = typeof defaultLabels;
