import type { DocumentProps } from 'next/document'
import { Head, Html, Main, NextScript } from 'next/document'

import storeConfig from 'store.config'

function Document({ __NEXT_DATA__ }: DocumentProps) {
  const { favicon } =
    __NEXT_DATA__.props.pageProps?.pageData?.themeConfigs ?? {}

  return (
    <Html>
      <Head>
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
        <link
          href="https://chat.baianao.com.br:443/webchat/widget_baianao/module.css"
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
