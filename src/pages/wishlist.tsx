import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import api from 'src/utils/api'
import RenderComponents from 'src/utils/components/render-components'

function Page({ page }: any) {
  return (
    <>
      <NextSeo noindex nofollow />
      <RenderComponents pageData={page.pageData} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const page = {
    header: null,
    footer: null,
    pageData: null,
    themeConfigs: {},
  }

  try {
    const wishlistPage = await api.audacityCMS('page/wishlist')
    const header = await api.audacityCMS('header')
    const footer = await api.audacityCMS('footer')

    page.pageData = wishlistPage['pt-BR'].components
    page.header = header['pt-BR'].data
    page.footer = footer['pt-BR'].data
    page.themeConfigs = {
      colors: wishlistPage.site.colors,
    }

    if (
      wishlistPage?.message === 'Resource not found' ||
      header?.message === 'Resource not found' ||
      footer?.message === 'Resource not found'
    ) {
      return {
        notFound: true,
      }
    }
  } catch ({ message }: any) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page },
  }
}

export default Page
