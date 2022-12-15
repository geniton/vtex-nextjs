import { useState, memo } from 'react'
import {
  Table as UITable,
  TableBody as UITableBody,
  TableCell as UITableCell,
  TableRow as UITableRow,
} from '@faststore/ui'

import Accordion, { AccordionItem } from 'src/components/ui/Accordion'
import type { StorePropertyValue } from '@generated/graphql'

import styles from './product-details-content.module.scss'
import Section from '../Section'

interface ArticleLabels {
  /**
   * Label for the "description" article.
   *
   * @default 'Description'
   */
  description: string
  /**
   * Label for the "About this product" article.
   *
   * @default 'About this product'
   */
  about: string
  /**
   * Label for the "Product highlights" article.
   *
   * @default 'Product highlights'
   */
  highlights: string
  /**
   * Label for the "Learn more" article.
   *
   * @default 'Learn more'
   */
  learnMore: string
}

interface Props {
  /**
   * Controls which articles will be initially expanded.
   *
   * @default 'first'
   */
  initiallyExpanded?: 'first' | 'all' | 'none'
  /**
   * Defines the labels used in each article.
   *
   * @default {description: 'Description', about: 'About this product', highlights: 'Product highlights', learnMore: 'Learn More' }
   */
  labels?: Partial<ArticleLabels>
  description?: string
  specifications?: StorePropertyValue[] | any[]
}

/**
 * Maps 'initiallyExpanded' prop values to indices
 */
const INITIALLY_EXPANDED_MAP = {
  first: [0],
  all: [0, 1, 2, 3],
  none: [],
}

/**
 * Default article labels
 */
const DEFAULT_LABELS: ArticleLabels = {
  description: 'Detalhes do produto',
  about: 'Especificações Técnicas',
  highlights: 'Product highlights',
  learnMore: 'Learn More',
} as const

function ProductDetailsContent({
  initiallyExpanded = 'first',
  labels: propLabels = {},
  specifications,
  description,
}: Props) {
  const [indices, setIndices] = useState(
    new Set(INITIALLY_EXPANDED_MAP[initiallyExpanded])
  )

  const onChange = (index: number) => {
    setIndices((currentIndices) => {
      const newIndices = new Set(currentIndices)

      if (currentIndices.has(index)) {
        newIndices.delete(index)
      } else {
        newIndices.add(index)
      }

      return newIndices
    })
  }

  const labels = { ...DEFAULT_LABELS, ...propLabels }

  if (!specifications?.length && !description) return null

  return (
    <Section
      className={styles.fsProductDetailsContent}
      data-fs-product-details-content
    >
      <Accordion
        expandedIndices={indices}
        onChange={onChange}
        aria-label="Product Details Content"
      >
        {description ? (
          <AccordionItem
            as="article"
            index={0}
            isExpanded={indices.has(0)}
            buttonLabel={
              <h2 className="text__title-subsection">{labels.description}</h2>
            }
            data-fs-product-details-description
            prefixId="product-details-content"
          >
            <p className="text__body">{description}</p>
          </AccordionItem>
        ) : (
          <></>
        )}
        {specifications?.length ? (
          <AccordionItem
            as="article"
            index={1}
            isExpanded={indices.has(1)}
            buttonLabel={
              <h2 className="text__title-subsection">{labels.about}</h2>
            }
            data-fs-product-details-about
            prefixId="product-details-content"
          >
            <UITable
              cellPadding={0}
              cellSpacing={0}
              className="text__title-mini-alt"
            >
              <UITableBody>
                {specifications.map((specificationItem, key) => (
                  <UITableRow key={key}>
                    <UITableCell variant="header">
                      {specificationItem.name}
                    </UITableCell>
                    <UITableCell>{specificationItem.value}</UITableCell>
                  </UITableRow>
                ))}
              </UITableBody>
            </UITable>
          </AccordionItem>
        ) : (
          <></>
        )}
      </Accordion>
    </Section>
  )
}

export default memo(ProductDetailsContent)
