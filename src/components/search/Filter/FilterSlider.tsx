import { useSearch } from '@faststore/sdk'

import type { Filter_FacetsFragment } from '@generated/graphql'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import SlideOver from 'src/components/ui/SlideOver'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import Facets from './Facets'
import styles from './filter-slider.module.scss'
import type { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  style?: any
}

function FilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  style
}: Props & ReturnType<typeof useFilter>) {
  const { closeFilter } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  const { resetInfiniteScroll, setState, state } = useSearch()

  return (
    <SlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="partial"
      direction="rightSide"
      className={styles.fsFilterSlider}
      onTransitionEnd={() => fade === 'out' && closeFilter()}
    >
      <div data-fs-filter-slider-content>
        <header data-fs-filter-slider-header>
          <h2 className="text__lead" style={{
            color: style?.textColor
          }}>Filtros</h2>
          <Button
            data-fs-filter-slider-header-icon
            aria-label="Fechar Filtros"
            icon={<Icon name="X" width={32} height={32} style={{
              color: 'var(--aud-primary)'
            }}/>}
            onClick={() => {
              dispatch({
                type: 'selectFacets',
                payload: state.selectedFacets,
              })

              fadeOut()
            }}
          />
        </header>
        <Facets
          facets={facets}
          testId={`mobile-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={(facet, type) =>
            type === 'BOOLEAN'
              ? dispatch({ type: 'toggleFacet', payload: facet })
              : dispatch({ type: 'setFacet', payload: { facet, unique: true } })
          }
          onAccordionChange={(index) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
          isMobile
          style={style}
        />
      </div>
      <footer data-fs-filter-slider-footer>
        <Button
          data-fs-filter-slider-footer-button-clear
          variant="secondary"
          onClick={() => dispatch({ type: 'selectFacets', payload: [] })}
        >
          Limpar
        </Button>
        <Button
          data-fs-filter-slider-footer-button-apply
          variant="primary"
          data-testid="filter-slider-button-apply"
          onClick={() => {
            resetInfiniteScroll(0)

            setState({
              ...state,
              selectedFacets: selected,
              page: 0,
            })
            fadeOut()
          }}
        >
          Aplicar
        </Button>
      </footer>
    </SlideOver>
  )
}

export default FilterSlider
