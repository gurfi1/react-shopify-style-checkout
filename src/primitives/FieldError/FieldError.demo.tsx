import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../Text/Text';
import { FieldError } from './FieldError';

const demo: Demo = {
  title: 'FieldError',
  group: 'Components',
  order: 4,
  summary: 'The message that opens under a field. `TextField`, `SelectField` and `Combobox` include it; use it directly under a control of your own.',
  usage: `<FieldError id="err-email" message={error} />`,
  props: [
    ['message', 'string | null', 'The text. Empty closes the row; the last message stays visible while it closes.'],
    ['id', 'string', 'Point the control’s aria-describedby at it.'],
  ],
  Example: () => {
    const [on, setOn] = useState(true);
    return (
      <States stacked>
        <State label="Opens and closes in 200ms" width={320}>
          <Link onClick={() => setOn(value => !value)}>{on ? 'Clear the error' : 'Show the error'}</Link>
          <FieldError message={on ? 'Enter a valid email' : null} />
        </State>
      </States>
    );
  },
};

export default demo;
