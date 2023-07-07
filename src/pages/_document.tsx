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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={storeConfig.theme}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
