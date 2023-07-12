import AudacityClientApi from '@retailhub/audacity-client-api'
import type { GetServerSideProps } from 'next'

const siteHost = process.env.SITE_HOST
const audacityToken = process.env.AUDACITY_TOKEN

const AudacityClient = new AudacityClientApi(audacityToken)

const createSitemap = (items: any[]) => `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${items
      .map((item: { url: any; lastmod: any }) => {
        return `
          <url>
            <loc>${item.url}</loc>
            <lastmod>${item.lastmod}</lastmod>
          </url>
        `
      })
      .join('')}
  </urlset>
  `

const EmptyComponent = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls: any[] = []
  const formattedDate = new Date().toISOString().split('T')[0]

  // Add Paths to urls
  const AddUrlPath = (path: any, date?: string) => {
    const url = `${siteHost}${path}`

    if (!date) {
      date = formattedDate
    }

    urls.push({ url, lastmod: date })
  }

  // Pages
  const { data: pages } = await AudacityClient.getSitemap().pages()

  for (const page of pages) {
    const path = page?.url?.[0]?.['pt-BR']

    if (!path) continue

    AddUrlPath(path, page.lastmod)
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(urls))
  res.end()

  return {
    props: {},
  }
}

export default EmptyComponent
