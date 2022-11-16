interface PagesProps {
  [key: string]: string
}

const CATEGORY_PAGE = 'category'

export default function getPageName(slug: string[]) {
  let pageName = slug?.length ? slug[0] : CATEGORY_PAGE

  if (slug?.length && slug[0] === 'blog' && slug.length > 1) {
    pageName = 'default'
  }

  const pages: PagesProps = {
    institucional: 'institutionalPage',
    campanhas: 'landingPage',
  }

  return pages[pageName] ?? CATEGORY_PAGE
}
