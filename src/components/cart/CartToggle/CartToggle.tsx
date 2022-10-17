import Button from 'src/components/ui/Button'
import SVG from 'react-inlinesvg'
import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

// interface CartToggleProps {
//   iconUrl: string
// }

function CartToggle() {
  const btnProps = useCartToggleButton()

  return (
    <Button
      variant="tertiary"
      data-fs-button-icon
      data-fs-button-cart
      aria-label={`Cart with ${btnProps['data-items']} items`}
      icon={<SVG src="https://content.retailhub.digital/wp-content/uploads/2022/03/rhub-cart-three.svg" />}
      {...btnProps}
    />
  )
}

export default CartToggle
