import { forwardRef, useMemo } from 'react'
import type { Ref, ElementType, AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import type { LinkProps as FrameworkLinkProps } from 'next/link'
import type { LinkProps as UILinkProps } from '@faststore/ui'

import styles from './link.module.scss'

type Variant = 'default' | 'display' | 'footer' | 'inline'

export type LinkProps<T extends ElementType = 'a'> = UILinkProps<T> &
  FrameworkLinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: Variant
    inverse?: boolean
  }

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link<
  T extends ElementType = 'a'
>(
  { href, inverse, children, variant = 'default', ...otherProps }: LinkProps<T>,
  ref: Ref<HTMLAnchorElement> | undefined
) {
  const isInternalLink = useMemo(
    () => href[0] === '/' && href[1] !== '/',
    [href]
  )

  if (isInternalLink) {
    return (
      <NextLink
        passHref
        href={href}
        ref={ref}
        data-fs-link
        data-fs-link-variant={variant}
        data-fs-link-inverse={inverse}
        className={styles.fsLink}
        {...otherProps}
      >
        {children}
      </NextLink>
    )
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      data-fs-link
      data-fs-link-variant={variant}
      data-fs-link-inverse={inverse}
      className={styles.fsLink}
      {...otherProps}
    >
      {children}
    </NextLink>
  )
})

export default Link
