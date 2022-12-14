import React from 'react';
import EmptyState from 'src/components/ui/EmptyState'
import Icon from 'src/components/ui/Icon'

interface Props {
  /**
   * This function is called when `Start Shopping` button is clicked
   */
  onDismiss?: () => void
}

const EmptyCart: React.FC<Props> = () => {
  return (
    <EmptyState>
      <header data-fs-empty-state-title>
        <Icon name="ShoppingCart" width={56} height={56} weight="thin" />
        <p>Seu carrinho está vazio.</p>
      </header>
      {/* <Button onClick={onDismiss} variant="secondary">
        Start Shopping
      </Button> */}
    </EmptyState>
  )
}

export default EmptyCart;
