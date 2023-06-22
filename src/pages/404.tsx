import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import AudacityClientApi from '@retailhub/audacity-client-api'

import { mark } from 'src/sdk/tests/mark'
import { RenderComponents } from 'src/utils'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN,
})

function Page({ pageData: { page } }: any) {
  return (
    <>
      <NextSeo noindex nofollow />
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
  }

  const { header, footer, menus, page } = await AudacityClient.getAllPageData(
    'page/page-not-found'
  )

  pageData.page = page['pt-BR']?.components ?? [
    {
      title: '404',
      component: 'NotFound404',
    },
  ]
  pageData.header = header['pt-BR']?.data
  pageData.footer = footer['pt-BR']?.data
  pageData.menus = menus?.data
  pageData.themeConfigs = {
    colors: page.site?.colors ?? null,
    favicon: page.site?.seo?.['pt-BR']?.favicon ?? null,
  }

  return {
    props: { pageData, pageType: 'page-not-found' },
    revalidate: 30,
  }
}

Page.displayName = 'Page'
export default mark(Page)
