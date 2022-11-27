import Icon from 'src/components/ui/Icon'

import Button from '../Button'
import type { ButtonProps } from '../Button'
import styles from '../button.module.scss'

type Props = ButtonProps

function ButtonBuy({
  children,
  icon = true,
  goToCheckout,
  onClick,
  ...otherProps
}: Props) {
  return (
    <Button
      className={styles.fsButton}
      data-fs-button
      data-fs-button-buy
      data-fs-button-variant="buy"
      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
        onClick(event, goToCheckout)
      }
      {...otherProps}
    >
      {icon && (
        <Icon name="ShoppingCart" width={18} height={18} weight="bold" />
      )}
      {children}
    </Button>
  )
}

export default ButtonBuy
