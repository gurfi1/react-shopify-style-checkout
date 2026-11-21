import { prefersReducedMotion, type CheckoutApi } from '../src';

/**
 * A pretend back end for the demo. Nothing here talks to a network: it answers from canned data
 * after a short pause, so the loading states can be seen. A real shop replaces each function with
 * a call to its own server and keeps the same shapes.
 *
 * Try: discount code WELCOME10; a card number ending 0002 is declined.
 */

const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, prefersReducedMotion() ? 0 : ms));

// Street, city, region, postal code.
const ADDRESSES: Record<string, [string, string, string, string][]> = {
  US: [['Market St', 'San Francisco', 'CA', '94103'], ['Main St', 'Portland', 'OR', '97204'], ['Broadway', 'New York', 'NY', '10012'], ['Congress Ave', 'Austin', 'TX', '78701'], ['Pike St', 'Seattle', 'WA', '98101'], ['Michigan Ave', 'Chicago', 'IL', '60611']],
  CA: [['Elgin St', 'Ottawa', 'ON', 'K2P 1L4'], ['Queen St W', 'Toronto', 'ON', 'M5H 2M9'], ['Granville St', 'Vancouver', 'BC', 'V6C 1T2'], ['Jasper Ave', 'Edmonton', 'AB', 'T5J 1N9'], ['Portage Ave', 'Winnipeg', 'MB', 'R3B 2B9']],
  GB: [['Baker St', 'London', '', 'NW1 6XE'], ['Deansgate', 'Manchester', '', 'M3 2BW'], ['Princes St', 'Edinburgh', '', 'EH2 2ER'], ['Park St', 'Bristol', '', 'BS1 5NT'], ['Bold St', 'Liverpool', '', 'L1 4DS']],
  IL: [['Rothschild Blvd', 'Tel Aviv-Yafo', '', '6688101'], ['Jaffa St', 'Jerusalem', '', '9414109'], ['HaNassi Blvd', 'Haifa', '', '3463406'], ['Herzl St', 'Rishon LeZion', '', '7526701'], ['Rager Blvd', 'Beersheba', '', '8489312']],
};

export function createFakeApi(subtotal: number): CheckoutApi {
  return {
    async suggestAddresses(query, country) {
      await pause(120);
      const book = ADDRESSES[country] ?? [];
      const match = query.match(/^(\d+[a-z]?)?\s*(.*)$/i);
      const number = match?.[1] || '12';
      const typed = (match?.[2] ?? '').trim();
      const hit = typed ? book.find(entry => entry[0].toLowerCase().includes(typed.toLowerCase())) : undefined;
      // Like a real lookup, the same street name turns up in several towns.
      const street = hit ? hit[0] : typed.length > 2 ? typed.replace(/\b[a-z]/g, letter => letter.toUpperCase()) : '';
      const towns = hit ? [hit, ...book.filter(entry => entry !== hit)] : book;
      return towns.slice(0, 5).map(entry => ({ line1: `${number} ${street || entry[0]}`, city: entry[1], region: entry[2], postal: entry[3] }));
    },

    async shippingRates() {
      await pause(1000);
      return [
        { id: 'economy', name: 'Economy', eta: '5 to 8 business days', price: 0 },
        { id: 'standard', name: 'Standard', eta: '3 to 4 business days', price: 6.9 },
        { id: 'express', name: 'Express', eta: '1 to 2 business days', price: 14.9 },
      ];
    },

    async applyDiscount(code) {
      await pause(700);
      if (code !== 'WELCOME10') throw new Error('Enter a valid discount code or gift card');
      return { code, amount: Math.round(subtotal * 10) / 100 };
    },

    async placeOrder(order) {
      await pause(1600);
      if (order.payment.method === 'card' && order.payment.last4 === '0002') throw new Error('Payment declined');
      const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      return { confirmation: Array.from({ length: 9 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('') };
    },
  };
}
