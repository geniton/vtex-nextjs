import Button from 'src/components/ui/Button'
import SVG from 'react-inlinesvg'
import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

interface CartToggleProps {
  iconUrl: string
}

function CartToggle({ iconUrl }: CartToggleProps) {
  const btnProps = useCartToggleButton()

  return (
    <Button
      variant="tertiary"
      data-fs-button-icon
      data-fs-button-cart
      aria-label={`Cart with ${btnProps['data-items']} items`}
      icon={<SVG src={iconUrl} />}
      {...btnProps}
    />
  )
}

export default CartToggle
