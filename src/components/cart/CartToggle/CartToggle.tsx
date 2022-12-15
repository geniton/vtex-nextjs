import SVG from 'react-inlinesvg'

import { useCartToggleButton } from 'src/sdk/cart/useCartToggleButton'

type Props = {
  icon: any
}

function CartToggle({
  icon = {
    url: 'https://content.retailhub.digital/wp-content/uploads/2022/12/cart.svg',
  },
}: Props) {
  const btnProps = useCartToggleButton()

  return (
    <button
      data-fs-button-icon
      data-fs-button-cart
      aria-label={`Cart with ${btnProps['data-items']} items`}
      {...btnProps}
    >
      <SVG src={icon?.url} />
    </button>
  )
}

export default CartToggle
