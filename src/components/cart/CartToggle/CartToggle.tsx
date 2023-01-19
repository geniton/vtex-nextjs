import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

type Props = {
  cartAmountTop: boolean
  cartAmountCenter: boolean
  removedAmount: boolean
  minicartQuantityBgColor: string
  minicartQuantityTextColor: string
  children: any
}

function CartToggle({
  cartAmountTop,
  cartAmountCenter,
  minicartQuantityBgColor,
  minicartQuantityTextColor,
  removedAmount,
  children,
}: Props) {
  const btnProps = useCartToggleButton()

  function renderAmount() {
    if (removedAmount && btnProps['data-items'] === 0) return null

    return (
      <span
        data-fs-button-cart-amount
        data-fs-button-cart-amount-top={cartAmountTop}
        data-fs-button-cart-amount-center={cartAmountCenter}
        style={{
          backgroundColor: minicartQuantityBgColor,
          color: minicartQuantityTextColor,
        }}
      >
        {btnProps['data-items']}
      </span>
    )
  }

  return (
    <button
      data-fs-button-icon
      data-fs-button-cart
      aria-label={`Cart with ${btnProps['data-items']} items`}
      {...btnProps}
    >
      {children}
      {renderAmount()}
    </button>
  )
}

export default CartToggle
