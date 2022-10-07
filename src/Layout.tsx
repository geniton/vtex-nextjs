import { lazy, ReactNode, Suspense } from 'react'

import { useUI } from 'src/sdk/ui/Provider'
import ThemeConfigs from './utils/theme-configs'
import { Components } from '@retailhub/store-ui/src'
import Variables from '../config/variables.json'
import renderPlatformComponents from './helpers/render-platform-components'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

interface LayoutProps {
  pageProps: any
  children: ReactNode
}

function Layout({ children, pageProps }: LayoutProps) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <ThemeConfigs data={pageProps?.themeConfigs}>
      {pageProps?.header &&
        <Components.Header
          baseImageUrl={Variables.baseImageUrl}
          data={pageProps.header}
          websiteUrls={Variables.websiteUrls}
          renderPlatformComponents={renderPlatformComponents}
        />}

      <main>
        {children}
      </main>

      {pageProps?.footer &&
        <Components.Footer
          baseImageUrl={Variables.baseImageUrl}
          data={pageProps.footer}
          themeConfigs={pageProps.themeConfigs}
          renderPlatformComponents={renderPlatformComponents}
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
