import { useEffect } from 'react'
import { NextSeo } from 'next-seo'

import storeConfig from '../../store.config'
import { Components } from '@retailhub/audacity-ui'
import { GetServerSideProps } from 'next'
import api from 'src/utils/api'

function Page() {
  useEffect(() => {
    window.location.href = storeConfig.accountUrl
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
    themeConfigs: {}
  }

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
