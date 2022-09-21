import { Link } from "@faststore/ui"

export default (id: string, props?: any, children?: any) => {
  if (id === 'link') {
    if (children) {
      return <Link {...props}>{children}</Link>
    }

    return <Link {...props} />
  }

  return null
}
