import googlePay from './assets/google-pay.svg';
import payPal from './assets/paypal.svg';

/**
 * The wallet logos on the demo's express buttons. See demo/assets/README.txt for where the artwork
 * comes from. A real site shows each provider's own button, usually rendered by that provider's script.
 */
const mark = (src: string, height: number) => <img src={src} alt="" height={height} style={{ display: 'block' }} />;

export const PayPalMark = () => mark(payPal, 21);
export const GooglePayMark = () => mark(googlePay, 20);
