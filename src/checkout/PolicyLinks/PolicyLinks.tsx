import { useState } from 'react';
import { Modal } from '../../primitives/Modal/Modal';
import { Link } from '../../primitives/Text/Text';
import { cx } from '../../utils';
import type { Policy } from '../../types';
import { useLabels } from '../CheckoutProvider';
import styles from './PolicyLinks.module.css';

export type PolicyLinksProps = {
  policies: Policy[];
  className?: string;
};

/** The footer's row of policy links. Each opens its text in a modal, so the shopper never leaves the checkout. */
export function PolicyLinks({ policies, className }: PolicyLinksProps) {
  const labels = useLabels();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Policy | null>(null);
  return (
    <div className={cx(styles.policies, className)}>
      {policies.map(policy => (
        <Link
          key={policy.id}
          onClick={() => {
            setCurrent(policy);
            setOpen(true);
          }}
        >
          {policy.label}
        </Link>
      ))}
      <Modal open={open} onClose={() => setOpen(false)} title={current?.title ?? current?.label ?? ''} closeLabel={labels.close}>
        {current?.content}
      </Modal>
    </div>
  );
}
