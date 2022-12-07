import React, { useState } from 'react'
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from 'react-share'
import cn from 'classnames'

import styles from './share.module.scss'
import ShareIcon from './ShareIcon'

type Props = {
    productUrl: string
}

const Share: React.FC<Props> = ({ productUrl }) => {
  const [openMedia, setOpenMedia] = useState(false)
  return (
    <div className={cn('share', styles.share)}>
      <button
        className={styles.shareButton}
        onClick={() => setOpenMedia(!openMedia)}
      >
        <ShareIcon />
      </button>
      <ul
        className={cn(styles.shareList, {
          [styles.shareListOpened]: openMedia,
        })}
      >
        <li className={styles.shareListItem}>
          <FacebookShareButton url={productUrl}>
            <FacebookIcon size="25" iconFillColor="white" round />
          </FacebookShareButton>
        </li>
        <li className={styles.shareListItem}>
          <WhatsappShareButton url={productUrl}>
            <WhatsappIcon size="25" iconFillColor="white" round />
          </WhatsappShareButton>
        </li>
      </ul>
    </div>
  )
}

export default Share
