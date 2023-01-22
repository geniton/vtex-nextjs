import { useState } from 'react'
import { Components } from '@retailhub/audacity-ui'

import { Image } from 'src/components/ui/Image'
import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'
import { Hooks as PlatformHooks } from 'src/utils/components/platform'

import { ImageGallerySelector, ImageZoom } from '.'
import Share from '../Share'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps {
  images: ImageElementData[]
  galleryMode: 'with-thumbnails' | 'list' | 'list-with-spaces'
  skuId: string
  productUrl: string
}

function ImageGallery({
  images,
  galleryMode,
  skuId,
  productUrl,
}: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx || 0]

  return (
    <section
      data-fs-image-gallery={galleryMode}
      className={styles.fsImageGallery}
      data-fs-image-gallery-full-screen={images.length <= 1}
    >
      <div data-fs-image-gallery-share>
        <Components.Like PlatformHooks={PlatformHooks} skuId={skuId} />
        <Share productUrl={productUrl} />
      </div>
      {galleryMode === 'with-thumbnails' && images.length > 1 ? (
        <>
          <ImageZoom>
            <Image
              src={currentImage.url}
              alt={currentImage.alternateName}
              sizes="(max-width: 804px) 25vw, 30vw"
              width={804}
              height={804 * (3 / 4)}
              loading="eager"
              fetchPriority="high"
              options={{
                fitIn: true,
              }}
            />
          </ImageZoom>
          <ImageGallerySelector
            images={images}
            currentImageIdx={selectedImageIdx}
            onSelect={setSelectedImageIdx}
          />
        </>
      ) : (
        <ImageZoom>
          <Image
            src={currentImage.url}
            alt={currentImage.alternateName}
            sizes="(max-width: 900px) 25vw, 30vw"
            width={900}
            height={900}
            loading="eager"
            fetchPriority="high"
            options={{
              fitIn: true,
            }}
          />
        </ImageZoom>
      )}
      {galleryMode === 'list' || galleryMode === 'list-with-spaces'
        ? images.map((image, key) => (
            <ImageZoom key={key}>
              <Image
                src={image.url}
                alt={image.alternateName}
                sizes="(max-width: 900px) 25vw, 30vw"
                width={900}
                height={900}
                loading="eager"
                fetchPriority="high"
                options={{
                  fitIn: true,
                }}
              />
            </ImageZoom>
          ))
        : null}
    </section>
  )
}

export default ImageGallery
