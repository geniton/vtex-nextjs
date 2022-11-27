import type { PropsWithChildren } from 'react'

import Zoom from './Zoomable'

interface ImageZoomProps {
  helpMessage?: string
  zoomFactor?: number
}

const ImageZoom = ({ children }: PropsWithChildren<ImageZoomProps>) => {
  return <Zoom>{children} </Zoom>
}

export default ImageZoom
