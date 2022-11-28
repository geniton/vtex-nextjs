import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import getPageComponents from 'src/utils/components/get-page-components'
import RenderComponents from 'src/utils/components/render-components'
import api from 'src/utils/api'

function Page({ page: { pageData }, dataCMS }: any) {
  console.log('dataCMS', dataCMS)

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

export const getStaticProps: GetStaticProps = async () => {
  const page = getPageComponents('home')
  const { data } = await api.getCMSpage('home')

  return {
    props: { page, pageName: 'home', dataCMS: data || null },
  }
}

Page.displayName = 'Page'
export default mark(Page)
