import SVG from 'react-inlinesvg'
import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

// interface CartToggleProps {
//   iconUrl: string
// }

function CartToggle() {
  const btnProps = useCartToggleButton()

  return (
    <button
      data-fs-button-icon
      data-fs-button-cart
      aria-label={`Cart with ${btnProps['data-items']} items`}
      {...btnProps}
    >
      <SVG src="https://content.retailhub.digital/wp-content/uploads/2022/11/rhub-cart-three-2.svg" />
    </button>
  )
}

export default CartToggle
