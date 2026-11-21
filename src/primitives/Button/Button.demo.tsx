import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Button } from './Button';

const demo: Demo = {
  title: 'Button',
  group: 'Components',
  order: 9,
  summary: 'Two styles, both from the checkout: the 50px primary button, and the quiet apply button that stays grey until it has something to do. Loading keeps the button’s size and cross-fades the label to a spinner.',
  usage: `<Button type="submit" fullWidth loading={busy}>Pay now</Button>

<Button variant="quiet" disabled={!code} loading={applying}>Apply</Button>`,
  props: [
    ['variant', "'primary' | 'quiet'", 'Primary is accent on white text. Quiet is grey while disabled, accent once enabled.'],
    ['loading', 'boolean', 'Label fades to a spinner; clicks are ignored; aria-busy is set.'],
    ['fullWidth', 'boolean', 'Stretch to the container.'],
    ['children', 'ReactNode', 'A plain string label animates when it changes.'],
    ['…button', 'ButtonHTMLAttributes', 'type, disabled, onClick and the rest.'],
  ],
  Example: () => {
    const [loading, setLoading] = useState(false);
    const [cash, setCash] = useState(false);
    const [applying, setApplying] = useState(false);
    const run = (set: (value: boolean) => void) => { set(true); setTimeout(() => set(false), 1600); };
    return (
      <States>
        <State label="Primary: click to load for 1.6s" width={240}>
          <Button fullWidth loading={loading} onClick={() => run(setLoading)}>Pay now</Button>
        </State>
        <State label="Label change: click to switch" width={240}>
          <Button fullWidth onClick={() => setCash(value => !value)}>{cash ? 'Complete order' : 'Pay now'}</Button>
        </State>
        <State label="Quiet, disabled">
          <Button variant="quiet" disabled>Apply</Button>
        </State>
        <State label="Quiet, enabled: click to load">
          <Button variant="quiet" loading={applying} onClick={() => run(setApplying)}>Apply</Button>
        </State>
      </States>
    );
  },
};

export default demo;
