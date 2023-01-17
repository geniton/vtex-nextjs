import type { GetServerSideProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
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
  const page = {
    pageData: null,
    header: null,
    footer: null,
    themeConfigs: {},
  }

  try {
    const homepage = await api.audacityCMS('page/homepage')
    const header = await api.audacityCMS('header')
    const footer = await api.audacityCMS('footer')

    page.pageData = homepage['pt-BR'].components
    page.header = header['pt-BR'].data
    page.footer = footer['pt-BR'].data
    page.themeConfigs = {
      colors: homepage.site.colors,
    }

    if (
      homepage?.message === 'Resource not found' ||
      header?.message === 'Resource not found' ||
      footer?.message === 'Resource not found'
    ) {
      return {
        notFound: true,
      }
    }
  } catch ({ message }) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page, pageName: 'homepage' },
  }
}

Page.displayName = 'Page'
export default mark(Page)
