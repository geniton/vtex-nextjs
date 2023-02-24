type Properties = {
  emptyGallery: string
}

function EmptyGallery({ emptyGallery }: Properties) {
  return (
    <div data-fs-product-listing-empty>
      <div dangerouslySetInnerHTML={{__html: emptyGallery}} />
    </div>
  )
}

export default EmptyGallery
