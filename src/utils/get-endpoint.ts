export function getEndpoint(pathSlug: string) {
  if (!pathSlug) return ''

  if (pathSlug.match(/(\/p)$/)) {
    return 'page-product'
  }

  if (!pathSlug.match(/(\/p)$/)) {
    return ''
  }
}