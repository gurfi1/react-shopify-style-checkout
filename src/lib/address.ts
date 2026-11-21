import type { Address, Country } from '../types';

const pairs = (list: string) => list.split('|').map(item => item.split(':') as [string, string]);

/** Address formats for the countries the demo ships to. Pass your own list to cover more. */
export const COUNTRIES: Country[] = [
  {
    code: 'US', name: 'United States', flag: '🇺🇸', regionLabel: 'State', postalLabel: 'ZIP code', postalPattern: /^\d{5}(-\d{4})?$/,
    regions: pairs('AL:Alabama|AK:Alaska|AZ:Arizona|AR:Arkansas|CA:California|CO:Colorado|CT:Connecticut|DE:Delaware|DC:District of Columbia|FL:Florida|GA:Georgia|HI:Hawaii|ID:Idaho|IL:Illinois|IN:Indiana|IA:Iowa|KS:Kansas|KY:Kentucky|LA:Louisiana|ME:Maine|MD:Maryland|MA:Massachusetts|MI:Michigan|MN:Minnesota|MS:Mississippi|MO:Missouri|MT:Montana|NE:Nebraska|NV:Nevada|NH:New Hampshire|NJ:New Jersey|NM:New Mexico|NY:New York|NC:North Carolina|ND:North Dakota|OH:Ohio|OK:Oklahoma|OR:Oregon|PA:Pennsylvania|RI:Rhode Island|SC:South Carolina|SD:South Dakota|TN:Tennessee|TX:Texas|UT:Utah|VT:Vermont|VA:Virginia|WA:Washington|WV:West Virginia|WI:Wisconsin|WY:Wyoming'),
  },
  {
    code: 'CA', name: 'Canada', flag: '🇨🇦', regionLabel: 'Province', postalLabel: 'Postal code', postalPattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    regions: pairs('AB:Alberta|BC:British Columbia|MB:Manitoba|NB:New Brunswick|NL:Newfoundland and Labrador|NT:Northwest Territories|NS:Nova Scotia|NU:Nunavut|ON:Ontario|PE:Prince Edward Island|QC:Quebec|SK:Saskatchewan|YT:Yukon'),
  },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', postalLabel: 'Postcode', postalPattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/ },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', postalLabel: 'Postal code', postalPattern: /^\d{5}(\d{2})?$/ },
];

export function findCountry(countries: Country[], code: string): Country {
  return countries.find(country => country.code === code) ?? countries[0];
}

export const hasRegions = (country: Country) => Boolean(country.regionLabel && country.regions?.length);

/** The postal label as it reads mid-sentence: "ZIP code" stays, "Postcode" becomes "postcode". */
export const postalWord = (country: Country) => (country.postalLabel === 'ZIP code' ? country.postalLabel : country.postalLabel.toLowerCase());

export const isPostalValid = (country: Country, postal: string) => country.postalPattern.test(postal.trim());

export const emptyAddress = (country: string): Address => ({ country, firstName: '', lastName: '', line1: '', line2: '', city: '', region: '', postal: '' });

/** Enough of the address is filled in to ask for shipping rates. */
export function isAddressComplete(address: Address, country: Country): boolean {
  return Boolean(address.line1.trim() && address.city.trim() && (!hasRegions(country) || address.region) && address.postal.trim());
}

/** The parts of an address that change its shipping rates, as one comparable string. */
export const addressKey = (address: Address) => [address.country, address.line1, address.city, address.region, address.postal].map(part => part.trim()).join('|');

export const regionName = (country: Country, code: string) => country.regions?.find(region => region[0] === code)?.[1] ?? '';

/** An address as display lines: name, street, apartment, "City ST 12345", country. Empty lines are dropped. */
export function addressLines(address: Address, country: Country): string[] {
  return [
    [address.firstName, address.lastName].map(part => part.trim()).filter(Boolean).join(' '),
    address.line1.trim(),
    address.line2.trim(),
    [address.city.trim(), hasRegions(country) ? address.region : '', address.postal.trim()].filter(Boolean).join(' '),
    country.name,
  ].filter(Boolean);
}
