import type { Labels } from '../labels';

/**
 * Hebrew wording for every label. Pass it as `labels`, with `dir="rtl"`:
 * `<Checkout labels={he} dir="rtl" locale="he-IL" currency="ILS" … />`.
 * It addresses the shopper in the plural ("הזינו"), which reads as neutral in Hebrew.
 */
export const he: Labels = {
  // Header and layout
  checkout: 'קופה',
  backToCart: 'חזרה לעגלה',
  orderSummary: 'סיכום הזמנה',
  close: 'סגירה',
  moreInformation: 'מידע נוסף',

  // Express checkout
  expressCheckout: 'תשלום מהיר',
  or: 'או',

  // Contact
  contact: 'פרטי התקשרות',
  signIn: 'התחברות',
  contactField: 'אימייל או מספר טלפון נייד',
  contactTooltip: 'נשתמש בפרטים האלה כדי לשלוח אישור הזמנה ועדכונים',
  didYouMean: suggestion => ['האם התכוונתם ל-', suggestion, '?'],
  marketing: 'שלחו לי חדשות ומבצעים באימייל',

  // Delivery
  delivery: 'משלוח',
  deliveryMethod: 'אופן קבלת ההזמנה',
  ship: 'משלוח',
  pickUp: 'איסוף עצמי',
  country: 'מדינה/אזור',
  firstName: 'שם פרטי (לא חובה)',
  lastName: 'שם משפחה',
  address: 'כתובת',
  apartment: 'דירה, כניסה וכו׳ (לא חובה)',
  city: 'עיר',
  suggestions: 'הצעות',
  closeSuggestions: 'סגירת ההצעות',
  addressSuggestions: 'הצעות לכתובת',
  saveInfo: 'שמרו את הפרטים שלי לפעם הבאה',
  shippingMethod: 'שיטת משלוח',
  shippingEmpty: 'הזינו כתובת למשלוח כדי לראות את אפשרויות המשלוח.',
  shippingNone: 'אין משלוח לכתובת הזו. בדקו את הכתובת או בחרו באיסוף עצמי.',
  free: 'חינם',
  pickupLocations: 'נקודות איסוף',
  pickupCount: count => (count === 1 ? 'יש נקודת איסוף אחת עם מלאי בקרבתכם' : `יש ${count} נקודות איסוף עם מלאי בקרבתכם`),
  pickupLocation: 'נקודת איסוף',

  // Payment
  payment: 'תשלום',
  paymentNote: 'פרטי התשלום שלכם מוצפנים ומעובדים באופן מאובטח.',
  paymentMethod: 'אמצעי תשלום',
  paymentFailedTitle: 'התשלום לא עבר.',
  paymentFailedBody: 'נסו שוב או בחרו אמצעי תשלום אחר.',
  cardNumber: 'מספר כרטיס',
  expiry: 'תוקף (MM / YY)',
  securityCode: 'קוד אבטחה',
  securityCodeTooltip: '3 הספרות בגב הכרטיס. באמריקן אקספרס: 4 ספרות בחזית הכרטיס.',
  nameOnCard: 'שם בעל הכרטיס',
  moreCards: 'דיסקבר, דיינרס קלאב, JCB ויוניון פיי',
  moreCardsCount: '+4',
  billingSame: 'כתובת החיוב זהה לכתובת המשלוח',
  billingAddress: 'כתובת לחיוב',
  payNow: 'לתשלום',
  completeOrder: 'השלמת ההזמנה',

  // Order summary
  discountField: 'קוד הנחה או שובר מתנה',
  apply: 'החלה',
  removeDiscount: 'הסרת ההנחה',
  subtotal: items => `סכום ביניים · ${items === 1 ? 'פריט אחד' : items + ' פריטים'}`,
  discount: 'הנחה',
  shipping: 'משלוח',
  pickup: 'איסוף עצמי',
  enterShippingAddress: 'הזינו כתובת למשלוח',
  total: 'סה״כ',
  totalSavings: 'סך החיסכון',

  // Field errors
  errorContactRequired: 'הזינו אימייל או מספר טלפון',
  errorEmail: 'הזינו כתובת אימייל תקינה',
  errorPhone: 'הזינו מספר טלפון תקין',
  errorLastName: 'הזינו שם משפחה',
  errorAddress: 'הזינו כתובת',
  errorCity: 'הזינו עיר',
  errorRegion: regionLabel => `בחרו ${regionLabel}`,
  errorPostalRequired: postalWord => `הזינו ${postalWord}`,
  errorPostalInvalid: postalWord => `הזינו ${postalWord} תקין`,
  errorCardRequired: 'הזינו מספר כרטיס',
  errorCardInvalid: 'הזינו מספר כרטיס תקין',
  errorExpiry: 'הזינו תוקף תקין',
  errorSecurityCode: 'הזינו את קוד האבטחה של הכרטיס',
  errorNameOnCard: 'הזינו את השם בדיוק כפי שהוא מופיע על הכרטיס',

  // Thank-you page
  confirmation: 'אישור הזמנה',
  thankYou: firstName => (firstName ? `תודה, ${firstName}!` : 'תודה!'),
  orderConfirmed: 'ההזמנה שלכם אושרה',
  orderConfirmedBody: 'שלחנו לכם באימייל אישור עם מספר ההזמנה.',
  orderDetails: 'פרטי ההזמנה',
  contactInformation: 'פרטי התקשרות',
  shippingAddress: 'כתובת למשלוח',
  pickupInStore: 'איסוף מהחנות',
  cardEnding: (brand, last4) => `${brand} המסתיים ב-${last4}`,
  card: 'כרטיס',
  needHelp: 'צריכים עזרה?',
  contactUs: 'צרו קשר',
  continueShopping: 'המשך בקניות',
};
