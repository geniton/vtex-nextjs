/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { Components } from '@retailhub/audacity-ui'

import headerMock from 'data/components/header.json'
import { useUI } from 'src/sdk/ui/Provider'
import ThemeConfigs from 'src/utils/components/theme-configs'
import themeConfigsMock from 'data/components/theme-configs.json'
import {
  Components as PlatformComponents,
  Hooks as PlatformHooks,
} from 'src/utils/components/platform'

import Footer from './components/Footer'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

interface LayoutProps {
  children: ReactNode
  [key: string]: any
}

function Layout({ children, page, pageName }: LayoutProps) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <ThemeConfigs data={page?.themeConfigs || themeConfigsMock}>
      <Components.Header
        data={headerMock}
        pageName={pageName}
        PlatformComponents={PlatformComponents}
        PlatformHooks={PlatformHooks}
      />

      <main>{children}</main>

      <Footer />

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
