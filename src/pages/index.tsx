import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import AudacityClientApi from '@retailhub/audacity-client-api'
import { Utils } from '@retailhub/audacity'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import { RenderComponents } from 'src/utils'

const AudacityClient = new AudacityClientApi(
  process.env.AUDACITY_TOKEN,
  process.env.ENV
)

function Page({ pageData: { page, seo, tags } }: any) {
  const { title, description } = seo ?? {}

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        titleTemplate={title}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title,
          description,
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
      <RenderComponents components={page} tags={tags} />
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
    modals: [],
    tags: [],
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
      colors: page.site?.colors ?? null,
      favicon: page.site?.seo?.['pt-BR']?.favicon ?? null,
      scripts: page.site?.scripts ?? null,
    }
    pageData.tags = page.site?.tags ?? []
    pageData.seo = Utils.Formats.formatSeo({
      page,
    })

    pageData.modals = page.modals ?? []
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
