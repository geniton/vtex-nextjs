import type { FC, ReactElement } from 'react'

import type Modal from 'src/components/ui/Modal'

import ZoomInPlace from './ZoomInPlace'
import ModalZoom from './ModalZoom'

export type ZoomMode =
  | 'in-place-click'
  | 'in-place-hover'
  | 'disabled'
  | 'open-modal'

interface Props {
  mode?: ZoomMode
  zoomContent?: ReactElement
  factor?: number
  ModalZoomElement?: typeof Modal
  children: any
}

const Zoomable: FC<Props> = ({
  children,
  factor = 2,
  zoomContent,
  ModalZoomElement,
  mode = 'in-place-click',
}) => {
  switch (mode) {
    case 'in-place-hover':
      return (
        <ZoomInPlace type="hover" factor={factor} zoomContent={zoomContent}>
          {children}
        </ZoomInPlace>
      )

    case 'in-place-click':
      return (
        <ZoomInPlace type="click" factor={factor} zoomContent={zoomContent}>
          {children}
        </ZoomInPlace>
      )

    case 'open-modal': {
      if (ModalZoomElement) {
        return (
          <ModalZoom ModalZoomElement={ModalZoomElement}>{children}</ModalZoom>
        )
      }
    }
    // falls through

    case 'disabled':
    // falls through

    default:
      return <>{children}</>
  }
}

export default Zoomable
