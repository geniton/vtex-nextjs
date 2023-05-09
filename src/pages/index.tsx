import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import AudacityClientApi from '@retailhub/audacity-client-api'
import { Carousel } from '@faststore/ui'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import { RenderComponents } from 'src/utils'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN,
})

function Page({ pageData: { page } }: any) {
  const firstClientX = useRef(0)
  const firstClientY = useRef(0)
  const clientX = useRef(0)
  const clientY = useRef(0)

  function touchStart(e: any) {
    firstClientX.current = e.touches[0].clientX
    firstClientY.current = e.touches[0].clientY
  }

  function preventTouch(e: any) {
    const minValue = 5

    clientX.current = e.touches[0].clientX - firstClientX.current
    clientY.current = e.touches[0].clientY - firstClientY.current

    if (Math.abs(clientX.current) > minValue) {
      e.preventDefault()
      e.returnValue = false

      return false
    }

    return true
  }

  useEffect(() => {
    window.addEventListener('touchstart', touchStart)
    window.addEventListener('touchmove', preventTouch, { passive: false })

    return () => {
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', preventTouch)
    }
  }, [])

  return (
    <>
      <NextSeo
        title={storeConfig.seo.title}
        description={storeConfig.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        }}
      />
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q`,
            queryInput: 'search_term_string',
          },
        ]}
      />
      <RenderComponents components={page} />
      <Carousel>
        <article>
          <Image
            src="https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/medias/download/3f357eb4-90f6-4c73-9e52-6068a6d0b942"
            width="1366"
            height="480"
            alt=""
          />
        </article>
        <article>
          <Image
            src="https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/medias/download/ea841ea2-3222-4caa-b455-aad333296295"
            width="1366"
            height="480"
            alt=""
          />
        </article>
        <article>
          <Image
            src="https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/medias/download/e9775d93-b0b1-484f-9264-e2d6400c4d71"
            width="1366"
            height="480"
            alt=""
          />
        </article>
      </Carousel>
      <article>
        <Image
          src="https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/medias/download/3f357eb4-90f6-4c73-9e52-6068a6d0b942"
          width="1366"
          height="480"
          alt=""
        />
      </article>
      <article>
        <Image
          src="https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/medias/download/ea841ea2-3222-4caa-b455-aad333296295"
          width="1366"
          height="480"
          alt=""
        />
      </article>
      <article>
        <Image
          src="https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/medias/download/e9775d93-b0b1-484f-9264-e2d6400c4d71"
          width="1366"
          height="480"
          alt=""
        />
      </article>
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

    pageData.page = page['pt-BR'].components
    pageData.header = header['pt-BR'].data
    pageData.footer = footer['pt-BR'].data
    pageData.menus = menus.data
    pageData.themeConfigs = {
      colors: page.site.colors,
    }
  } catch ({ message }) {
    return {
      notFound: true,
    }
  }

  return {
    props: { pageData, pageType: 'homepage' },
    revalidate: 30,
  }
}

Page.displayName = 'Page'
export default mark(Page)
