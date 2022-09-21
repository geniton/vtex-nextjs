import { lazy, ReactNode, Suspense } from 'react'

// import Alert from 'src/components/common/Alert'
// import Footer from 'src/components/common/Footer'
// import Navbar from 'src/components/common/Navbar'
// import Toast from 'src/components/common/Toast'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'
import { useUI } from 'src/sdk/ui/Provider'
import ThemeConfigs from './utils/theme-configs'
import { Components } from './store-ui/src'
import Variables from '../config/variables.json'

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
        />}

      <main>
        <RegionalizationBar classes="display-mobile" />
        {children}
      </main>

      {pageProps?.footer &&
        <Components.Footer
          baseImageUrl={Variables.baseImageUrl}
          data={pageProps.footer}
          configsData={pageProps.themeConfigs}
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
