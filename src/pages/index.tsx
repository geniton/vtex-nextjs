import type { GetServerSideProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import { useEffect } from 'react'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import getPageComponents from 'src/utils/components/get-page-components'
import RenderComponents from 'src/utils/components/render-components'
import api from 'src/utils/api'

function Page({ page: { pageData } }: any) {
  return (
    <>
      <NextSeo
        title={storeConfig.seo.title}
        description={storeConfig.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        }}
      />
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q`,
            queryInput: 'search_term_string',
          },
        ]}
      />
      <RenderComponents pageData={pageData} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const page = getPageComponents('home')

  try {
    const data = await api.getCMSpage('pagina-inicial')

    page.pageData = data['pt-BR'].components
  } catch ({ message }: any) {
    console.log(message)
  }

  return {
    props: { page, pageName: 'home' },
  }
}

Page.displayName = 'Page'
export default mark(Page)
