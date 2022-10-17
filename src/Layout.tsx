import { lazy, ReactNode, Suspense } from 'react'

import { useUI } from 'src/sdk/ui/Provider'
import ThemeConfigs from './utils/theme-configs'

import { Components } from '@retailhub/audacity-ui'
import header from 'data/components/header.json'
import footer from 'data/components/footer.json'
import themeConfigs from 'data/components/theme-configs.json'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

interface LayoutProps {
  // pageProps: any
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <ThemeConfigs data={themeConfigs}>
      {header &&
        <Components.Header
          data={header}
        />}

      <main>
        {children}
      </main>

      {footer &&
        <Components.Footer
          {...footer}
        />}

      {displayCart && (
        <Suspense fallback={null}>
          <CartSidebar />
        </Suspense>
      )}

      {displayModal && (
        <Suspense fallback={null}>
          <RegionModal />
        </Suspense>
      )}
    </ThemeConfigs>
  )
}

export default Layout
