import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import api from 'src/utils/api'
import getPageComponents from 'src/utils/components/get-page-components'

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
  const page = getPageComponents('wishlist')

  try {
    const data = await api.getCMSpage('homepage')
    page.themeConfigs = {
      colors: data.site.colors
    }

    if (data?.message === 'Resource not found') {
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
