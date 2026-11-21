import { COUNTRIES, findCountry, type AddressSuggestion, type Country, type LineItemData, type PaymentMethod, type PickupLocation, type Policy, type ShippingRate } from '../src';
import { ITEMS } from './store';

/** The demo store in Hebrew, for the right-to-left mode (`?lang=he`). Prices are in shekels. */

export const ITEMS_HE: LineItemData[] = [
  { ...ITEMS[0], title: 'תיק בד מצופה שעווה', variant: 'חום בהיר / גדול', price: 320 },
  { ...ITEMS[1], title: 'ספל קרמיקה', variant: 'ירוק מרווה', price: 140 },
];

export const COUNTRIES_HE: Country[] = [
  { code: 'IL', name: 'ישראל', flag: '🇮🇱', postalLabel: 'מיקוד', postalPattern: /^\d{5}(\d{2})?$/ },
  { ...findCountry(COUNTRIES, 'US'), name: 'ארצות הברית', regionLabel: 'מדינה', postalLabel: 'מיקוד' },
];

export const PICKUP_LOCATIONS_HE: PickupLocation[] = [
  { id: 'tlv', name: 'Northfield דיזנגוף', address: 'דיזנגוף 118, תל אביב', ready: 'מוכן בדרך כלל תוך 24 שעות', distance: '1.2 ק״מ' },
  { id: 'jlm', name: 'Northfield המושבה הגרמנית', address: 'עמק רפאים 40, ירושלים', ready: 'מוכן בדרך כלל תוך 2 עד 4 ימים', distance: '58 ק״מ' },
];

export const PAYMENT_METHODS_HE: PaymentMethod[] = [
  { id: 'card', title: 'כרטיס אשראי', kind: 'card' },
  { id: 'wallet', title: 'ארנק דיגיטלי', kind: 'redirect', note: 'בלחיצה על "לתשלום" תועברו לארנק שלכם כדי להשלים את התשלום באופן מאובטח.' },
  { id: 'cod', title: 'מזומן לשליח', kind: 'manual', note: 'התשלום במזומן בעת קבלת ההזמנה. נא להכין סכום מדויק.' },
];

export const POLICIES_HE: Policy[] = [
  { id: 'refund', label: 'מדיניות החזרות', content: <><p>אפשר להחזיר מוצר בתוך 30 יום מיום קבלתו.</p><p>המוצר צריך להיות במצב שבו קיבלתם אותו, ללא שימוש ובאריזתו המקורית. לאחר בדיקת ההחזרה, הזיכוי יועבר לאמצעי התשלום המקורי בתוך 10 ימי עסקים.</p></> },
  { id: 'shipping', label: 'משלוחים', content: <><p>הזמנות מטופלות בתוך יום עד שני ימי עסקים. עם יציאת המשלוח תקבלו הודעה עם פרטי מעקב.</p></> },
  { id: 'privacy', label: 'מדיניות פרטיות', content: <><p>אנחנו אוספים את הפרטים שמסרתם בקופה כדי לטפל בהזמנה ולעדכן אתכם לגביה.</p><p>אנחנו לא מוכרים את המידע האישי שלכם.</p></> },
  { id: 'terms', label: 'תנאי שימוש', content: <><p>ביצוע הזמנה מהווה הסכמה לתנאים האלה. מחירים וזמינות עשויים להשתנות עד לאישור ההזמנה.</p></> },
  { id: 'contact', label: 'יצירת קשר', content: <><p>Northfield Goods<br />דיזנגוף 118, תל אביב<br /><bdi>hello@northfield.example</bdi></p><p>אנחנו עונים להודעות בתוך יום עסקים אחד.</p></> },
];

/** Street, city, postal code. Israeli addresses put the house number after the street. */
export const ADDRESSES_HE: Record<string, [street: string, city: string, region: string, postal: string][]> = {
  IL: [['שדרות רוטשילד', 'תל אביב-יפו', '', '6688101'], ['רחוב יפו', 'ירושלים', '', '9414109'], ['שדרות הנשיא', 'חיפה', '', '3463406'], ['רחוב הרצל', 'ראשון לציון', '', '7526701'], ['שדרות רגר', 'באר שבע', '', '8489312']],
};

export const RATES_HE: ShippingRate[] = [
  { id: 'economy', name: 'חסכוני', eta: '5 עד 8 ימי עסקים', price: 0 },
  { id: 'standard', name: 'רגיל', eta: '3 עד 4 ימי עסקים', price: 25 },
  { id: 'express', name: 'אקספרס', eta: 'יום עד שני ימי עסקים', price: 49 },
];

export const formatSuggestionHe = (number: string, street: string): AddressSuggestion['line1'] => `${street} ${number}`;
