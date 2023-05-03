import { VtexComponents } from '@retailhub/audacity-vtex'

import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'
import { VtexHooks } from 'src/utils'

import Share from '../Share'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps {
  images: ImageElementData[]
  skuId: string
  productUrl: string
  withCarousel: boolean
  imagesPerView: number
  withThumbnails: boolean
  thumbnailsPosition: string
}

function ImageGallery({
  images,
  skuId,
  productUrl,
  withCarousel,
  imagesPerView,
  withThumbnails,
  thumbnailsPosition,
}: ImageGalleryProps) {
  return (
    <section className={styles.fsImageGallery}>
      <div data-fs-image-gallery-share>
        <VtexComponents.Like VtexHooks={VtexHooks} skuId={skuId} />
        <Share productUrl={productUrl} />
      </div>
      <VtexComponents.SingleProductGallery
        images={images}
        thumbnailsPosition={thumbnailsPosition}
        withThumbnails={withThumbnails}
        imagesPerView={imagesPerView}
        withCarousel={withCarousel}
        arrows
      />
    </section>
  )
}

export default ImageGallery
