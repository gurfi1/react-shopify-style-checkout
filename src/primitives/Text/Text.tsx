import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Text.module.css';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** 2: section title (20px). 3: sub-section (16px). 4: detail label (14px). */
  level?: 2 | 3 | 4;
  children: ReactNode;
};

/** A heading from the three-step type scale. All are weight 600. */
export function Heading({ level = 2, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <Tag className={cx(styles.heading, styles[Tag], className)} {...rest}>
      {children}
    </Tag>
  );
}

export type TextProps = HTMLAttributes<HTMLElement> & {
  /** `subdued` is the grey used for helper text. */
  tone?: 'default' | 'subdued';
  /** `small` is 12px; the default is the body's 14px. */
  size?: 'body' | 'small';
  /** Element to render. */
  as?: 'p' | 'span' | 'div';
  children: ReactNode;
};

/** Body text, optionally subdued or small. */
export function Text({ tone = 'default', size = 'body', as: Tag = 'p', className, children, ...rest }: TextProps) {
  return (
    <Tag className={cx(styles.text, tone === 'subdued' && styles.subdued, size === 'small' && styles.small, className)} {...rest}>
      {children}
    </Tag>
  );
}

export type LinkProps =
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; children: ReactNode });

/** The accent link. With `href` it is an anchor; without, a button that looks the same. */
export function Link(props: LinkProps) {
  if (props.href !== undefined) {
    const { className, children, ...rest } = props;
    return (
      <a className={cx(styles.link, className)} {...rest}>
        {children}
      </a>
    );
  }
  const { className, children, type = 'button', ...rest } = props;
  return (
    <button type={type} className={cx(styles.link, className)} {...rest}>
      {children}
    </button>
  );
}
