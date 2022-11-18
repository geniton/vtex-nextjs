/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { Components } from '@retailhub/audacity-ui'

import { useUI } from 'src/sdk/ui/Provider'
import ThemeConfigs from 'src/utils/components/theme-configs'
import renderPlatformComponent from 'src/utils/components/render-platform-component'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

interface LayoutProps {
  children: ReactNode
  [key: string]: any
}

function Layout({ children, page }: LayoutProps) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <ThemeConfigs data={page?.themeConfigs}>
      {page?.header && (
        <Components.Header
          data={page.header}
          renderPlatformComponent={renderPlatformComponent}
        />
      )}

      <main>{children}</main>

      {page?.footer && <Components.Footer {...page.footer} />}

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
