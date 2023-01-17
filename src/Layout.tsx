/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { Components } from '@retailhub/audacity-ui'

import { useUI } from 'src/sdk/ui/Provider'
import ThemeConfigs from 'src/utils/components/theme-configs'
import themeConfigsMock from 'data/components/theme-configs.json'

import {
  Hooks as PlatformHooks,
  Components as PlatformComponents,
} from './utils/components/platform'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

interface LayoutProps {
  children: ReactNode
  page?: {
    header: any
    footer: any
    themeConfigs: any
  }
  [key: string]: any
}

function Layout({ children, page }: LayoutProps) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <ThemeConfigs data={page?.themeConfigs || themeConfigsMock}>
      {page?.header && (
        <Components.Header
          PlatformComponents={PlatformComponents}
          PlatformHooks={PlatformHooks}
          {...page?.header}
        />
      )}

      <main>{children}</main>

      {page?.footer && (
        <Components.Footer
          PlatformComponents={PlatformComponents}
          PlatformHooks={PlatformHooks}
          {...page?.footer}
        />
      )}

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
