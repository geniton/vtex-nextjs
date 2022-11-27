import React from 'react'

import Modal from 'src/components/ui/Modal'

interface Props {
  children: React.ReactNode
  ModalZoomElement: any
}

function ModalZoom(props: Props) {
  const { children, ModalZoomElement } = props

  return (
    <Modal>
      {children}
      <ModalZoomElement />
    </Modal>
  )
}

export default ModalZoom
