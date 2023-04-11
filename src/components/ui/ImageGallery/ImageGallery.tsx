import { Components } from '@retailhub/audacity-ui'

import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'
import { Hooks as PlatformHooks } from 'src/utils/components/platform'

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
        <Components.Like PlatformHooks={PlatformHooks} skuId={skuId} />
        <Share productUrl={productUrl} />
      </div>
      <Components.SingleProductGallery
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
