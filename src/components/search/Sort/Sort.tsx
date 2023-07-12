import { useSearch } from '@faststore/sdk'
import { Style } from '@retailhub/audacity'

import Select from 'src/components/ui/Select'

const OptionsMap = {
  price_desc: 'Preço, decrescente',
  price_asc: 'Preço, crescente',
  orders_desc: 'Mais vendidos',
  name_asc: 'Nome, A-Z',
  name_desc: 'Nome, Z-A',
  release_desc: 'Data de lançamento',
  discount_desc: 'Desconto',
  score_desc: 'Relevância',
}

const keys = Object.keys(OptionsMap) as Array<keyof typeof OptionsMap>

interface ISort {
  style: Style
}

function Sort({ style }: ISort) {
  const { state, setState } = useSearch()

  return (
    <Select
      id="sort-select"
      className="sort / text__title-mini-alt"
      label="Ordenar por"
      options={OptionsMap}
      onChange={(e) => {
        const sort = keys[e.target.selectedIndex]

        setState({
          ...state,
          sort,
          page: 0,
        })
      }}
      value={state.sort}
      testId="search-sort"
      style={{
        backgroundColor: style?.bgColor,
        color: style?.textColor
      }}
    />
  )
}

export default Sort
