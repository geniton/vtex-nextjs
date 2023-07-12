import type { GetServerSideProps } from 'next'

const siteHost = process.env.SITE_HOST
const formattedDate = new Date().toISOString().split('T')[0]

const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${siteHost}/sitemap/pages.xml</loc>
      <lastmod>${formattedDate}</lastmod>
    </sitemap>
    <sitemap>
      <loc>${siteHost}/sitemap/categories.xml</loc>
      <lastmod>${formattedDate}</lastmod>
    </sitemap>
    <sitemap>
      <loc>${siteHost}/sitemap/products.xml</loc>
      <lastmod>${formattedDate}</lastmod>
    </sitemap>
  </sitemapindex>
  `

const EmptyComponent = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap())
  res.end()

  return {
    props: {},
  }
}

export default EmptyComponent
