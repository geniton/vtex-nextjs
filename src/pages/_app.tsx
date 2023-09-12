import '../styles/global/tokens.scss'
import '../styles/global/resets.scss'
import '../styles/global/typography.scss'
import '../styles/global/layout.scss'
import '../styles/global/components.scss'

import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'
import { Components } from '@retailhub/audacity'
import type { IModal } from '@retailhub/audacity/dist/components/modals/modal/models'
import Script from 'next/script'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import UIProvider from 'src/sdk/ui/Provider'
import { NextjsComponents } from 'src/utils'

function App({ Component, pageProps }: AppProps) {
  const { themeConfigs, modals } = pageProps?.pageData ?? {}
  const { scripts } = themeConfigs ?? {}

  return (
    <ErrorBoundary>
      <NextNProgress
        color="var(--fs-color-primary-bkg);"
        showOnShallow={false}
        options={{ showSpinner: false }}
      />

      {scripts?.length ? (
        <Components.Scripts
          scripts={scripts}
          NextjsComponents={NextjsComponents}
        />
      ) : null}

      <Script
        id="lgpdy-sc-banner"
        type="text/javascript"
        src="https://app.lgpdy.com/banner.js?key=71ce7a4f-1067-4526-bb3e-203e777e0db5"
        strategy="lazyOnload"
        defer
      />

      <Script
        id="webchat"
        src="https://chat.baianao.com.br:443/webchat/widget_baianao/module.js"
        type="module"
        strategy="lazyOnload"
        defer
      />

      <Script
        id="pushnews-launcher"
        src="https://cdn.pn.vg/push/pushnews-launcher.js?appId=9ba327ae-3927-492a-bae8-bc766f644de1"
        strategy="lazyOnload"
        defer
      />

      {modals?.length
        ? modals.map(
            (props: {
              [key: string]: any & { data: JSX.IntrinsicAttributes & IModal }
            }) => (
              <Components.Modal
                {...props?.['pt-BR']?.data}
                active={props.active}
                uuid={props.uuid}
                type={props.type}
                key={`modal-${props.uuid}`}
              />
            )
          )
        : null}

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
