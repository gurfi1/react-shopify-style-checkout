import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { contactError } from '../../lib/validate';
import { ContactField } from './ContactField';

const demo: Demo = {
  title: 'ContactField',
  group: 'Checkout blocks',
  order: 3,
  summary: 'One field for an email or a mobile number. Start typing digits and a country flag slides in. Leave the field with a mistyped domain such as `gmial.com` and the fix is offered underneath; clicking it applies it.',
  usage: `<ContactField
  value={contact}
  onChange={setContact}
  error={error}
  onBlur={() => setError(contactError(contact, false))}
  flag="🇺🇸"
/>`,
  props: [
    ['value / onChange', 'string / (value) => void', 'What was typed.'],
    ['error', 'string | null', 'Message under the field.'],
    ['onBlur', '() => void', 'Runs before the typo check. Validate here.'],
    ['flag', 'string', 'Emoji shown once a phone number is being typed.'],
    ['typos', 'Record<string, string>', 'Domain typos and corrections. Defaults to a short built-in list.'],
  ],
  Example: () => {
    const [typo, setTypo] = useState('ada@gmial.com');
    const [phone, setPhone] = useState('+1 415 555');
    const [bad, setBad] = useState('ada@');
    const [error, setError] = useState<string | null>('Enter a valid email');
    return (
      <States>
        <State label="Click in, then out: a fix is offered" width={300}>
          <ContactField id="demo-contact-typo" value={typo} onChange={setTypo} />
        </State>
        <State label="A phone number: the flag chip" width={300}>
          <ContactField id="demo-contact-phone" value={phone} onChange={setPhone} />
        </State>
        <State label="Validated on blur" width={300}>
          <ContactField id="demo-contact-bad" value={bad} onChange={value => { setBad(value); setError(null); }} error={error} onBlur={() => setError(contactError(bad, false))} />
        </State>
      </States>
    );
  },
};

export default demo;
