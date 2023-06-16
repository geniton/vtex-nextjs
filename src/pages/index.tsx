import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import AudacityClientApi from '@retailhub/audacity-client-api'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import { RenderComponents } from 'src/utils'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN,
})

function Page({ pageData: { page, seo } }: any) {
  return (
    <>
      <NextSeo
        title={seo.title}
        description={seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: seo.title,
          description: seo.description,
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
  const pageData = {
    page: null,
    header: null,
    footer: null,
    menus: [],
    themeConfigs: {},
    seo: {
      title: '',
      description: '',
    },
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

    pageData.page = page['pt-BR'].components
    pageData.header = header['pt-BR'].data
    pageData.footer = footer['pt-BR'].data
    pageData.menus = menus.data
    pageData.themeConfigs = {
      colors: page.site.colors,
    }
    pageData.seo = {
      title: page['pt-BR']?.seo?.title || page.site?.['pt-BR']?.seo?.title,
      description:
        page['pt-BR']?.seo?.description ||
        page.site?.['pt-BR']?.seo?.description,
    }
  } catch ({ message }) {
    return {
      notFound: true,
    }
  }

  return {
    props: { pageData, pageType: 'homepage' },
    revalidate: 30,
  }
}

Page.displayName = 'Page'
export default mark(Page)
