const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{7,}$/;

/** Common slips in email domains and what was meant. */
export const DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com', 'icloud.con': 'icloud.com',
};

export const isEmail = (value: string) => EMAIL.test(value.trim());
export const isPhone = (value: string) => PHONE.test(value.trim());
export const isContact = (value: string) => isEmail(value) || isPhone(value);

/** True once the text reads as the start of a phone number, which is when the flag chip appears. */
export const looksLikePhone = (value: string) => /^\+?\d[\d\s().-]{2,}$/.test(value.trim());

/** True when the text starts like a phone number, used to pick the right error message. */
export const startsLikePhone = (value: string) => /^[+\d]/.test(value.trim());

/** The corrected address when the domain is a known typo, otherwise null. */
export function suggestEmailFix(value: string, typos: Record<string, string> = DOMAIN_TYPOS): string | null {
  const match = value.trim().match(/^(.+)@(.+)$/);
  const better = match && typos[match[2].toLowerCase()];
  return match && better ? match[1] + '@' + better : null;
}
