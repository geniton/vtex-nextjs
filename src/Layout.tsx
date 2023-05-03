/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { Components } from '@retailhub/audacity'
import { VtexComponents } from '@retailhub/audacity-vtex'
import { ThemeConfigs, VtexHooks, NextjsComponents, VtexComponents as TemplateVtexComponents } from 'src/utils'
import { useUI } from 'src/sdk/ui/Provider'
import themeMock from 'data/components/theme-configs.json'
import Toast from './components/ui/Toast'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

interface LayoutProps {
  children: ReactNode
  page?: {
    header: any
    footer: any
    menus: any[]
    themeConfigs: any
  }
  [key: string]: any
}

function Layout({ children, pageData, pageType }: LayoutProps) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <ThemeConfigs data={pageData?.themeConfigs || themeMock}>
      <Toast />

      {pageData?.header && (
        <VtexComponents.Header
          {...pageData?.header}
          NextjsComponents={NextjsComponents}
          VtexHooks={VtexHooks}
          VtexComponents={TemplateVtexComponents}
          pageType={pageType}
          cmsAudacityData={{
            menus: pageData.menus,
          }}
        />
      )}

      <main>{children}</main>

      {pageData?.footer && (
        <Components.Footer
          NextjsComponents={NextjsComponents}
          VtexHooks={VtexHooks}
          {...pageData?.footer}
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
