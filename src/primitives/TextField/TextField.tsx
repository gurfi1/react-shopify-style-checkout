import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { Field } from '../Field/Field';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> & {
  /** Shown as the placeholder while empty, then as the small label above the value. */
  label: string;
  /** The error message. Also sets `aria-invalid`. */
  error?: string | null;
  /** Icon or tooltip button at the end of the field. */
  accessory?: ReactNode;
  /** Content placed under the field, above the error message. */
  below?: ReactNode;
  /** Class for the outer wrapper. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

/** A text input with a floating label: the placeholder shows first, and a small label fades in once there is a value. */
export function TextField({ label, error, accessory, below, className, id, type = 'text', dir, ref, ...input }: TextFieldProps) {
  const generated = useId();
  // Typed text takes its direction from what was typed, so an English address in a Hebrew form
  // (or the reverse) reads correctly. An empty field follows the page, so its placeholder does too.
  const direction = dir ?? (typeof input.value === 'string' && input.value !== '' ? 'auto' : undefined);
  const fieldId = id ?? generated;
  const errorId = 'err-' + fieldId;
  return (
    <Field error={error} errorId={errorId} accessory={accessory} below={below} className={className}>
      <input
        {...input}
        ref={ref}
        id={fieldId}
        type={type}
        dir={direction}
        placeholder={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : input['aria-describedby']}
      />
      <label htmlFor={fieldId}>{label}</label>
    </Field>
  );
}
