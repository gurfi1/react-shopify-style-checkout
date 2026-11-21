import { useState } from 'react';
import { State, States, type Demo } from '../../demo';
import { Link } from '../Text/Text';
import { Modal } from './Modal';

const demo: Demo = {
  title: 'Modal',
  group: 'Components',
  order: 22,
  summary: 'A dialog up to 600px wide over a 60% black backdrop. It scales in from 98% with the spring curve over 450ms and leaves in 200ms. Focus moves to the close button, Tab stays inside, and Escape, the button or the backdrop close it and send focus back.',
  usage: `<Modal open={open} onClose={() => setOpen(false)} title="Refund policy">
  <p>We have a 30-day return policy…</p>
</Modal>`,
  props: [
    ['open', 'boolean', 'Whether it is shown. It stays mounted for 200ms after closing to finish the exit.'],
    ['onClose', '() => void', 'Close button, Escape or backdrop.'],
    ['title', 'ReactNode', 'Heading; also labels the dialog for screen readers.'],
    ['children', 'ReactNode', 'Scrolls if taller than 80% of the window.'],
    ['closeLabel', 'string', 'Accessible name of the close button.'],
  ],
  Example: () => {
    const [open, setOpen] = useState(false);
    return (
      <States>
        <State label="Open it, then try Escape, Tab and the backdrop">
          <Link onClick={() => setOpen(true)}>Refund policy</Link>
          <Modal open={open} onClose={() => setOpen(false)} title="Refund policy">
            <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>
            <p>To be eligible, your item must be in the same condition that you received it, unused, and in its original packaging.</p>
          </Modal>
        </State>
      </States>
    );
  },
};

export default demo;
