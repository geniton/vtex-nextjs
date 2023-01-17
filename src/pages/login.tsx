import { useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { Components } from '@retailhub/audacity-ui'
import type { GetServerSideProps } from 'next'

import api from 'src/utils/api'

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

export const getServerSideProps: GetServerSideProps = async () => {
  const page = {
    header: null,
    footer: null,
    themeConfigs: {},
  }

  try {
    const homepage = await api.audacityCMS('page/homepage')
    const header = await api.audacityCMS('header')
    const footer = await api.audacityCMS('footer')

    page.header = header['pt-BR'].data
    page.footer = footer['pt-BR'].data
    page.themeConfigs = {
      colors: homepage.site.colors,
    }

    if (
      homepage?.message === 'Resource not found' ||
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
