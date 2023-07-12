import '../styles/global/tokens.scss'
import '../styles/global/resets.scss'
import '../styles/global/typography.scss'
import '../styles/global/layout.scss'
import '../styles/global/components.scss'

import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import UIProvider from 'src/sdk/ui/Provider'
import { Components } from '@retailhub/audacity'
import { NextjsComponents } from 'src/utils'

function App({ Component, pageProps }: AppProps) {
  console.log('=>', pageProps.pageData?.themeConfigs?.scripts)
  return (
    <ErrorBoundary>
      <NextNProgress
        color="var(--fs-color-primary-bkg);"
        showOnShallow={false}
        options={{ showSpinner: false }}
      />

      {pageProps.pageData?.themeConfigs?.scripts?.length ? (
        <Components.Scripts
          scripts={pageProps.pageData.themeConfigs.scripts}
          NextjsComponents={NextjsComponents}
        />
      ) : null}

      <AnalyticsHandler />

      <UIProvider>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </UIProvider>
    </ErrorBoundary>
  )
}

export default App
