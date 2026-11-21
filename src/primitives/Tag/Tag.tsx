import type { ReactNode } from 'react';
import { CloseIcon, TagIcon } from '../../icons';
import { cx } from '../../utils';
import styles from './Tag.module.css';

export type TagProps = {
  children: ReactNode;
  /** Shows a remove button and is called when it is pressed. */
  onRemove?: () => void;
  /** Accessible name of the remove button. */
  removeLabel?: string;
  /** Replaces the price-tag icon. Pass null for none. */
  icon?: ReactNode;
  className?: string;
};

/** A small grey chip for an applied code. It pops in with a slight overshoot when it appears. */
export function Tag({ children, onRemove, removeLabel = 'Remove', icon, className }: TagProps) {
  return (
    <span className={cx(styles.tag, className)} data-static={onRemove ? undefined : ''}>
      {icon === undefined ? <TagIcon dot /> : icon}
      <span>{children}</span>
      {onRemove && (
        <button type="button" aria-label={removeLabel} onClick={onRemove}>
          <CloseIcon />
        </button>
      )}
    </span>
  );
}
