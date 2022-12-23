import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import api from 'src/utils/api'

const useErrorState = () => {
  const router = useRouter()
  const { from } = router.query
  const { pathname } = router

  return {
    fromUrl: from ?? pathname,
  }
}

function Page() {
  const { fromUrl } = useErrorState()

  return (
    <>
      <NextSeo noindex nofollow />

      <h1>Not Found: 404</h1>
      <div>This app could not find url {fromUrl}</div>
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
