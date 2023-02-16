import { useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { Components } from '@retailhub/audacity-ui'
import type { GetStaticProps } from 'next'

import { getAllPageData } from 'src/services/audacity'

import storeConfig from '../../store.config'

function Page() {
  useEffect(() => {
    window.location.href = storeConfig.loginUrl
  }, [])

  return (
    <>
      <NextSeo noindex nofollow />

      <Components.Container>
        <Components.LoadingPage />
      </Components.Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const page = {
    header: null,
    footer: null,
    menus: [],
    themeConfigs: {},
  }

  try {
    const { header, footer, menus, pageData }: any = await getAllPageData(
      '/page/homepage'
    )

    if (
      pageData?.message?.includes('Resource not found') ||
      header?.message?.includes('Resource not found') ||
      footer?.message?.includes('Resource not found') ||
      menus?.message?.includes('Resource not found')
    ) {
      return {
        notFound: true,
      }
    }

    page.header = header['pt-BR'].data
    page.footer = footer['pt-BR'].data
    page.menus = menus.data
    page.themeConfigs = {
      colors: pageData.site.colors,
    }
  } catch ({ message }: any) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page },
    revalidate: 30,
  }
}

export default Page
