import { cloneElement, useId, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { InfoIcon } from '../../icons';
import { cx } from '../../utils';
import styles from './Tooltip.module.css';

export type TooltipProps = {
  /** The bubble's text. */
  content: ReactNode;
  /** One focusable element, usually an `InfoButton`. It receives `aria-describedby`. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  className?: string;
};

/** A dark bubble above its trigger, shown on hover and on keyboard focus. */
export function Tooltip({ content, children, className }: TooltipProps) {
  const id = useId();
  return (
    <span className={cx(styles.tip, className)}>
      {cloneElement(children, { 'aria-describedby': id })}
      <span role="tooltip" id={id} className={styles.bubble}>
        {content}
      </span>
    </span>
  );
}

export type InfoButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Accessible name, for example "More information". */
  label: string;
  /** Replaces the question-mark icon. */
  icon?: ReactNode;
};

/** The round 22px "?" button that tooltips hang from. */
export function InfoButton({ label, icon, className, ...rest }: InfoButtonProps) {
  return (
    <button type="button" className={cx(styles.trigger, className)} aria-label={label} {...rest}>
      {icon ?? <InfoIcon />}
    </button>
  );
}
