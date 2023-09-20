import '../styles/global/tokens.scss'
import '../styles/global/resets.scss'
import '../styles/global/typography.scss'
import '../styles/global/layout.scss'
import '../styles/global/components.scss'

import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'
import { Components } from '@retailhub/audacity'
import type { IModal } from '@retailhub/audacity/dist/components/modals/modal/models'

import Layout from 'src/Layout'
import AnalyticsHandler from 'src/sdk/analytics'
import ErrorBoundary from 'src/sdk/error/ErrorBoundary'
import UIProvider from 'src/sdk/ui/Provider'
import { NextjsComponents } from 'src/utils'
import Head from 'next/head'

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

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {scripts?.length ? (
        <Components.Scripts
          scripts={scripts}
          NextjsComponents={NextjsComponents}
        />
      ) : null}

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
