import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../icons';
import { DURATION, prefersReducedMotion } from '../../lib/motion';
import { usePortalTarget } from '../../theme/Theme';
import { cx } from '../../utils';
import styles from './Modal.module.css';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Accessible name of the close button. */
  closeLabel?: string;
  className?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A dialog over a dark backdrop. Opening moves focus to its close button and locks page scroll;
 * closing (button, Escape or backdrop) returns focus to where it was. Tab stays inside the dialog.
 */
export function Modal({ open, onClose, title, children, closeLabel = 'Close', className }: ModalProps) {
  const target = usePortalTarget();
  const titleId = useId();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Mount first, then flip to visible on the next layout pass so the entrance transition has a starting point.
  if (open && !mounted) setMounted(true);
  useLayoutEffect(() => {
    if (!mounted) return;
    if (open) {
      void root.current?.offsetHeight;
      setVisible(true);
      return;
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : DURATION.base);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      returnFocus.current?.focus();
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !root.current) return;
      const items = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !root.current.contains(current))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (current === last || !root.current.contains(current))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted || !target) return null;
  return createPortal(
    <div ref={root} className={cx(styles.modal, className)} data-open={visible ? '' : undefined}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className={styles.head}>
          <h2 className={styles.title} id={titleId}>{title}</h2>
          <button ref={closeButton} type="button" className={styles.close} aria-label={closeLabel} onClick={onClose}>
            <CloseIcon size={14} strokeWidth={1.2} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    target,
  );
}
