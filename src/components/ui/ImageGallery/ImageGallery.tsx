import { useState } from 'react'

import { Image } from 'src/components/ui/Image'
import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'

import { ImageGallerySelector, ImageZoom } from '.'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps {
  images: ImageElementData[]
  galleryMode: 'with-thumbnails' | 'list' | 'list-with-spaces'
}

function ImageGallery({ images, galleryMode }: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]

  return (
    <section
      data-fs-image-gallery={galleryMode}
      className={styles.fsImageGallery}
    >
      {galleryMode === 'with-thumbnails' && images.length > 1 && (
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
      )}
      {galleryMode === 'list' || galleryMode === 'list-with-spaces'
        ? images.map((image, key) => (
            <ImageZoom key={key}>
              <Image
                src={image.url}
                alt={image.alternateName}
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
          ))
        : null}
    </section>
  )
}

export default ImageGallery
