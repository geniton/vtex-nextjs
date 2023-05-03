import { useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { Components } from '@retailhub/audacity'
import type { GetServerSideProps } from 'next'

import storeConfig from '../../store.config'
import AudacityClientApi from '@retailhub/audacity-client-api'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN
})

function Page() {
  useEffect(() => {
    window.location.href = storeConfig.checkoutUrl
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

export const getServerSideProps: GetServerSideProps = async () => {
  const data = {
    themeConfigs: {},
    header: null,
    footer: null,
    menus: [],
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
    props: { pageData: data },
  }
}

export default Page
