import React, { memo } from 'react'
import { Components } from '@retailhub/audacity-ui'
import { data } from 'data/components/footer.json'
import Link from 'src/components/ui/Link'
import styles from './footer.module.scss'
import cn from 'classnames'
import { Image } from '../ui/Image'
import {
  FaFacebookF,
  FaInstagram,
  FaSpotify,
  FaPinterestP,
  FaYoutube,
} from 'react-icons/fa'

const Icons: any = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  spotify: FaSpotify,
  pinterest: FaPinterestP,
  youtube: FaYoutube,
}

const Footer: React.FC = () => {
  function handleAccordionContent(event: React.ChangeEvent<HTMLInputElement>) {
    if (window.innerWidth > 1280) return

    const content: any = event.target.nextElementSibling
    const contentHeight = content.style.height
    const contentChild: any = event.target.firstElementChild

    if (!contentHeight || contentHeight === '0px') {
      contentChild.classList.add('active')
      content.style.height = `${content.scrollHeight}px`
      return
    }

    content.style.height = '0px'
    contentChild.classList.remove('active')
  }

  function renderIcon(iconName: string) {
    const Icon = Icons[iconName]
    return <Icon width={23} height={23} fill="#bea669" />
  }

  function renderImage({ icon, image }: any) {
    return icon ? (
      renderIcon(icon.name)
    ) : (
      <Image
        src={image.url}
        alt={image.alt}
        width={40}
        height={40}
        withoutThumborOptions
        style={{
            width: image.width,
            height: image.height,
        }}
      />
    )
  }

  function renderItems(items: any[], type: string) {
    if (!items?.length) return null

    return (
      <ul>
        {items.map(
          ({ link, title, icon, image, items: subItems, type: subType }: any, index: number) =>
            type === 'menu' ? (
              <li key={`${title}-${index}`}>
                {link?.url || link?.title ? (
                  <Link href={link.url} target={link.target}>{link.title}</Link>
                ) : (
                  title && <h3>{title}</h3>
                )}
                {subItems?.length ? renderItems(subItems, subType) : null}
              </li>
            ) : (
              <li key={`${title}-${index}`}>
                {link.url ? (
                  <Link href={link.url} target={link.target}>{renderImage({ icon, image })}</Link>
                ) : (
                  renderImage({ icon, image })
                )}
              </li>
            )
        )}
      </ul>
    )
  }

  return (
    <footer className={styles.footer}>
      {data.map(({ data: navData, mobileFull, deskFull, divisor }: any, index:number) =>
        data.length ? (
          <div
            key={`section-${index}`}
            className={cn(styles.footerWrapper, {
              [styles.footerWrapperDivisor]: divisor,
            })}
          >
            <Components.Container
              className={cn({
                [styles.mobileFull]: mobileFull,
                [styles.deskFull]: deskFull,
              })}
            >
              {navData.map(
                ({ title, items, addAccordionMobile, type, content }: any, navIndex: number) =>
                  type === 'text' ? (
                    <div
                      key={`${title}-${navIndex}`}
                      className={cn(styles.footerRow, {
                        [styles.footerRowBorder]: addAccordionMobile,
                      })}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <div
                      className={cn(styles.footerRow, {
                        [styles.footerRowBorder]: addAccordionMobile,
                      })}
                    >
                      <h3
                        className={cn(styles.footerBtn, {
                          [styles.footerAccordionBtn]: addAccordionMobile,
                        })}
                        onClick={(event: any) =>
                          addAccordionMobile && handleAccordionContent(event)
                        }
                      >
                        {title}
                        {addAccordionMobile && (
                          <span className={styles.footerBtnIcon} />
                        )}
                      </h3>
                      {items.length ? (
                        <nav
                          className={cn(styles.footerNav, {
                            [styles.footerNavAccordion]: addAccordionMobile,
                            [styles.footerNavImages]: type === 'image',
                            [styles.footerNavMenu]: type === 'menu',
                          })}
                        >
                          {renderItems(items, type)}
                        </nav>
                      ) : null}
                    </div>
                  )
              )}
            </Components.Container>
          </div>
        ) : null
      )}
    </footer>
  )
}

export default memo(Footer)
