import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import { mark } from 'src/sdk/tests/mark'
import RenderComponents from 'src/utils/components/render-components'
import { getAllPageData } from 'src/services/audacity'


function Page({ page: { pageData } }: any) {
  return (
    <>
      <NextSeo noindex nofollow />
      <RenderComponents pageData={pageData} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const page = {
    pageData: [],
    header: null,
    footer: null,
    menus: [],
    themeConfigs: {},
  }

  const { header, footer, menus, pageData } = await getAllPageData(
    '/page/page-not-found'
  )

  page.pageData = pageData['pt-BR']?.components ?? [
    {
      title: "404",
      component: "NotFound404",
    }
  ]

  page.header = header['pt-BR']?.data
  page.footer = footer['pt-BR']?.data
  page.menus = menus?.data
  page.themeConfigs = {
    colors: pageData?.site?.colors,
  }

  return {
    props: { page, pageName: 'page-not-found' },
    revalidate: 30,
  }
}

Page.displayName = 'Page'
export default mark(Page)

