import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import { RenderComponents } from 'src/utils'
import AudacityClientApi from '@retailhub/audacity-client-api'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN
})

function Page({ pageData: { page } }: any) {
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
      <RenderComponents components={page} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const data = {
    page: null,
    header: null,
    footer: null,
    menus: [],
    themeConfigs: {},
  }

  try {
    const { header, footer, menus, page } = await AudacityClient.getAllPageData(
      'page/homepage'
    )

    if (
      page?.message?.includes('Resource not found') ||
      header?.message?.includes('Resource not found') ||
      footer?.message?.includes('Resource not found') ||
      menus?.message?.includes('Resource not found')
    ) {
      return {
        notFound: true,
      }
    }

    data.page = page['pt-BR'].components
    data.header = header['pt-BR'].data
    data.footer = footer['pt-BR'].data
    data.menus = menus.data
    data.themeConfigs = {
      colors: page.site.colors,
    }
  } catch ({ message }) {
    return {
      notFound: true,
    }
  }

  return {
    props: { pageData: data, pageType: 'homepage' },
    revalidate: 30,
  }
}

Page.displayName = 'Page'
export default mark(Page)
