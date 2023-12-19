import { useSearch } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import { lazy, memo, Suspense, useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import cn from 'classnames'
import { VtexComponents } from '@retailhub/audacity-vtex'
import { Components } from '@retailhub/audacity'

import Filter from 'src/components/search/Filter'
import Sort from 'src/components/search/Sort'
import Button, { ButtonLink } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from 'src/sdk/ui/Provider'

import Section from '../Section'
import EmptyGallery from './EmptyGallery'
import styles from './product-gallery.module.scss'
import { useDelayedFacets } from './useDelayedFacets'
import { useDelayedPagination } from './useDelayedPagination'
import { useGalleryQuery } from './useGalleryQuery'
import { useProductsPrefetch } from './usePageProducts'
import Breadcrumb from 'src/components/ui/Breadcrumb'

const GalleryPage = lazy(() => import('./ProductGalleryPage'))
const GalleryPageSkeleton = <VtexComponents.ProductGallerySkeleton loading />

interface Props {
  title: string
  searchTerm?: string
  controls: any
  content: any
  collection: any
  tags: any[]
}

function ProductGallery({
  title,
  searchTerm,
  controls,
  content,
  tags,
  ...props
}: Props) {
  const { collection } = props ?? {}
  const [gridNumber, setGridNumber] = useState<number>(2)
  const { openFilter } = useUI()
  const { pages, addNextPage, addPrevPage, resetInfiniteScroll } = useSearch()
  const { emptyGallery } = content ?? {}

  const { data } = useGalleryQuery()
  const facetsList = useDelayedFacets(data)
  // FEATURE
  // remove facet with label productClusterNames
  const facets = useMemo(() => {
    if (!facetsList || !facetsList?.length) {
      return facetsList
    }

    return facetsList.filter((facet) => facet.label !== 'productClusterNames')
  }, [facetsList])

  const totalCount = data?.search.products.pageInfo.totalCount ?? 0
  const { next, prev } = useDelayedPagination(totalCount)

  function updateGrid(value: React.SetStateAction<number>) {
    setGridNumber(value)
  }

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  useEffect(() => {
    resetInfiniteScroll(0)
  }, [])

  if (data && totalCount === 0) {
    return (
      <Section
        data-testid="product-gallery"
        className={`${styles.fsProductListing} layout__content`}
        data-fs-product-listing
        style={{
          paddingTop: 0,
        }}
      >
        <div className="aud-container">
          <EmptyGallery
            emptyGallery={
              emptyGallery ||
              '<h2>OOPS!</h2></br><p>Nenhum produto foi encontrado</p>'
            }
          />
        </div>
      </Section>
    )
  }

  return (
    <Section
      data-testid="product-gallery"
      className={`${styles.fsProductListing} layout__content-full`}
      data-fs-product-listing
    >
      <Components.Container
        className={cn({
          'mobile-only:p-0': controls?.general?.mobileVariations?.full,
          'lg:p-0': controls?.general?.deskVariations?.full,
        })}
      >
        {collection?.breadcrumbList?.itemListElement?.length ? <Breadcrumb breadcrumbList={collection?.breadcrumbList?.itemListElement} /> : null}
        {searchTerm && (
          <header
            data-fs-product-listing-search-term
            className="layout__content"
          >
            <h1>
              Mostrar resultados por: <span>{searchTerm}</span>
            </h1>
          </header>
        )}
        <div data-fs-product-listing-content-grid className="layout__content">
          <div data-fs-product-listing-filters>
            <VtexComponents.FilterSkeleton loading={facets?.length === 0}>
              <Filter facets={facets} style={controls.style.filterStyle} />
            </VtexComponents.FilterSkeleton>
          </div>

          <div data-fs-product-listing-results-count data-count={totalCount}>
            <VtexComponents.Skeleton
              loading={!data}
              margin="0px"
              data-fs-product-listing-results-count-skeleton
              style={{
                height: '36px',
              }}
            >
              <h2 data-testid="total-product-count">{totalCount} Resultados</h2>
            </VtexComponents.Skeleton>
          </div>

          <div data-fs-product-listing-sort>
            <VtexComponents.Skeleton
              margin="0px"
              style={{
                height: '36px',
                marginRight: '14px',
              }}
              loading={facets?.length === 0}
              data-fs-product-listing-sort-skeleton
            >
              <Sort style={controls.style.filterStyle} />
            </VtexComponents.Skeleton>

            <VtexComponents.Skeleton
              margin="0px"
              style={{
                height: '36px',
              }}
              loading={facets?.length === 0}
              data-fs-product-listing-filter-button-skeleton
            >
              <Button
                variant="tertiary"
                data-testid="open-filter-button"
                icon={<Icon name="FadersHorizontal" width={16} height={16} />}
                iconPosition="left"
                aria-label="Open Filters"
                onClick={openFilter}
              >
                Filtrar
              </Button>
            </VtexComponents.Skeleton>
          </div>

          <div data-fs-product-listing-results>
            <Components.GridView
              grid={gridNumber}
              onChangeGrid={(value: React.SetStateAction<number>) =>
                updateGrid(value)
              }
            />
            {/* Add link to previous page. This helps on SEO */}
            {prev !== false && (
              <div data-fs-product-listing-pagination="top">
                <NextSeo
                  additionalLinkTags={[{ rel: 'prev', href: prev.link }]}
                />
                <ButtonLink
                  onClick={(e: MouseEvent<HTMLElement>) => {
                    e.currentTarget.blur()
                    e.preventDefault()
                    addPrevPage()
                  }}
                  href={prev.link}
                  rel="prev"
                  variant="secondary"
                  iconPosition="left"
                  icon={
                    <Icon
                      name="ArrowLeft"
                      width={16}
                      height={16}
                      weight="bold"
                    />
                  }
                >
                  Previous Page
                </ButtonLink>
              </div>
            )}

            {/* Render ALL products */}
            {data ? (
              <Suspense fallback={GalleryPageSkeleton}>
                <ul
                  data-fs-product-grid
                  data-fs-product-grid-columns={gridNumber}
                >
                  {pages.map((page) => (
                    <GalleryPage
                      controls={controls}
                      key={`gallery-page-${page}`}
                      showSponsoredProducts={false}
                      page={page}
                      title={title}
                      gridNumber={gridNumber}
                      tags={tags}
                      {...props}
                    />
                  ))}
                </ul>
              </Suspense>
            ) : (
              GalleryPageSkeleton
            )}

            {/* Add link to next page. This helps on SEO */}
            {next !== false && (
              <div data-fs-product-listing-pagination="bottom">
                <NextSeo
                  additionalLinkTags={[{ rel: 'next', href: next.link }]}
                />
                <ButtonLink
                  data-testid="show-more"
                  onClick={(e: MouseEvent<HTMLElement>) => {
                    e.currentTarget.blur()
                    e.preventDefault()
                    addNextPage()
                  }}
                  href={next.link}
                  rel="next"
                  variant="secondary"
                >
                  Ver mais
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Components.Container>
    </Section>
  )
}

ProductGallery.displayName = 'ProductGallery'
export default memo(mark(ProductGallery))
