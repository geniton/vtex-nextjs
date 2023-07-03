import type { AccordionItemProps } from '@faststore/ui'
import {
  AccordionButton as UIAccordionButton,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel
} from '@faststore/ui'
import { forwardRef } from 'react'
import type { ReactNode } from 'react'

type Props = Omit<AccordionItemProps<'article' | 'div'>, 'ref'> & {
  /**
   * Attribute to check whether the item is expanded or not.
   */
  isExpanded: boolean
  /**
   * Label for Accordion button
   */
  buttonLabel?: ReactNode
  style?: any
}

const AccordionItem = forwardRef<HTMLDivElement, Props>(function AccordionItem(
  {
    children,
    isExpanded,
    index = 0,
    buttonLabel = '',
    testId = 'store-accordion-item',
    as,
    style,
    ...otherProps
  },
  ref
) {
  return (
    <UIAccordionItem
      ref={ref}
      index={index}
      data-testid={`${testId}-item`}
      data-fs-accordion-item
      as={as}
      style={{
        color: style?.textColor,
        borderColor: style?.borderColor
      }}
      {...otherProps}
    >
      <UIAccordionButton
        className="text__title-subsection"
        data-fs-accordion-item-button
        data-testid={`${testId}-button`}
      >
        {buttonLabel}
        <i
          data-testid={`${testId}-button-icon`}
          data-fs-accordion-item-button-icon
          data-fs-accordion-item-button-opened={isExpanded}
        />
      </UIAccordionButton>
      <UIAccordionPanel
        data-testid={`${testId}-panel`}
        data-fs-accordion-item-panel
      >
        {children}
      </UIAccordionPanel>
    </UIAccordionItem>
  )
})

export default AccordionItem
