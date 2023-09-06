import { Price as UIPrice } from '@faststore/ui'
import type { CSSProperties } from 'react'
import { memo, useEffect, useState } from 'react'
import type { PriceProps } from '@faststore/ui'

import SROnly from '../SROnly'
import styles from './price.module.scss'

type Props = PriceProps & {
  /**
   * Text for the screen readers only
   */
  SRText: string
  /**
   * Other classes that might be applied
   */
  classes?: string
  style?: CSSProperties
}

function Price({ classes = '', SRText, style, ...props }: Props) {
  const [priceStyle, setPriceStyle] = useState({})

  useEffect(() => {
    setPriceStyle(style ?? {})
  }, [style])

  return (
    <>
      <SROnly text={SRText} />
      <UIPrice
        data-fs-price
        className={`${styles.fsPrice} ${classes}`}
        style={priceStyle}
        {...props}
      />
    </>
  )
}

export default memo(Price)
