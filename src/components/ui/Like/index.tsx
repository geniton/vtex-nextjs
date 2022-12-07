import React, { useState, useEffect, memo, useCallback } from 'react'
import * as LocalStorage from 'src/utils/local-storage'
import * as API from 'src/utils/api'
import ButtonLink from '../Button/ButtonLink'
import styles from './like.module.scss'
import cn from 'classnames'
import HeartIcon from './HeartIcon'

type LikeProps = {
  skuId: string
  onChangeLike?: any
  width?: string
  height?: string
  color?: string
}

const Like: React.FC<LikeProps> = ({
  skuId,
  onChangeLike,
  width,
  height,
  color = 'var(--primary)',
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const person = {
    id: '3d6381e7-ac3f-4972-bbb9-35bcf8da7677',
  }

  function getWishlistData() {
    return LocalStorage.getData('wishlist') || []
  }

  function setWishlistData(value: number[]) {
    LocalStorage.saveData('wishlist', value)
  }

  const checkProductOnWishlist = () => {
    const wishlistData = getWishlistData()

    return wishlistData.filter((itemId: number) => +itemId === +skuId).length
  }

  const onLikeToggle = useCallback(() => {
    const isProductOnWishlist = checkProductOnWishlist()

    const wishlistData: any = getWishlistData()
    let like = false

    if (isProductOnWishlist) {
      wishlistData.splice(wishlistData.indexOf(skuId), 1)
    } else {
      like = true
      wishlistData.push(skuId)
    }

    setIsLiked(like)
    setWishlistData(wishlistData)

    const payload = {
      acronym: 'WL',
      products: JSON.stringify(wishlistData),
      userId: '3d6381e7-ac3f-4972-bbb9-35bcf8da7677',
    }

    API.saveMasterData(payload)
    typeof onChangeLike === 'function' && onChangeLike()
  }, [])

  useEffect(() => {
    if (checkProductOnWishlist()) {
      setIsLiked(true)
    }

    return () => setIsLiked(false)
  }, [skuId, setIsLiked, checkProductOnWishlist])

  return person?.id ? (
    <button
      type="button"
      className={cn('like', [styles.like, isLiked])}
      onClick={onLikeToggle}
      data-fs-like
      data-fs-like-active={isLiked}
    >
      <HeartIcon active={isLiked} width={width} height={height} color={color} />
    </button>
  ) : (
    <ButtonLink href="/login" className={cn([styles.like, isLiked])}>
      <HeartIcon active={isLiked} width={width} height={height} color={color} />
    </ButtonLink>
  )
}

export default memo(Like)
