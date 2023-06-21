import type { DocumentProps } from 'next/document'
import { Head, Html, Main, NextScript } from 'next/document'

import ThirdPartyScripts from 'src/components/ThirdPartyScripts'
import storeConfig from 'store.config'

function Document({ __NEXT_DATA__ }: DocumentProps) {
  const { favicon } =
    __NEXT_DATA__.props.pageProps?.pageData?.themeConfigs ?? {}

  return (
    <Html>
      <Head>
        {!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}
        {favicon && <link rel="icon" sizes="16x16" href={favicon} />}
      </Head>
      <body className={storeConfig.theme}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
