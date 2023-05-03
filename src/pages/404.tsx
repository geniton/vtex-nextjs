import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import { mark } from 'src/sdk/tests/mark'
import { RenderComponents } from 'src/utils'
import AudacityClientApi from '@retailhub/audacity-client-api'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN
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
  const data = {
    page: null,
    header: null,
    footer: null,
    menus: [],
    themeConfigs: {},
  }

  const { header, footer, menus, page } = await AudacityClient.getAllPageData(
    'page/page-not-found'
  )

  page.pageData = page['pt-BR']?.components ?? [
    {
      title: "404",
      component: "NotFound404",
    }
  ]

  page.header = header['pt-BR']?.data
  page.footer = footer['pt-BR']?.data
  page.menus = menus?.data
  page.themeConfigs = {
    colors: page?.site?.colors,
  }

  return {
    props: { pageData: data, pageType: 'page-not-found' },
    revalidate: 30,
  }
}

Page.displayName = 'Page'
export default mark(Page)

