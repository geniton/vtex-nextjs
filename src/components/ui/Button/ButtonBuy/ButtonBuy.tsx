import React from 'react'

import Icon from 'src/components/ui/Icon'

import type { ButtonProps } from '../Button'
import styles from '../button.module.scss'

const ButtonBuy = React.forwardRef(
  (
    {
      children,
      icon = true,
      goToCheckout,
      onClick,
      ...otherProps
    }: ButtonProps,
    ref: any
  ) => {
    return (
      <button
        className={styles.fsButton}
        data-fs-button
        data-fs-button-buy
        data-fs-button-variant="buy"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          onClick(event, goToCheckout)
        }
        ref={ref}
        {...otherProps}
      >
        {icon && (
          <Icon name="ShoppingCart" width={18} height={18} weight="bold" />
        )}
        {children}
      </button>
    )
  }
)

ButtonBuy.displayName = 'ButtonBuy'

export default ButtonBuy
