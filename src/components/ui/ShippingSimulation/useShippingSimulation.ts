import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { VtexUtils } from '@retailhub/audacity-vtex'

import type {
  IShippingItem,
  ShippingSimulationQueryQuery,
  ShippingSla,
} from '@generated/graphql'
import { useSession } from 'src/sdk/session'
import { getShippingSimulation } from 'src/sdk/shipping'

type InputProps = {
  postalCode?: string
  displayClearButton?: boolean
  errorMessage?: string
}

type ShippingSimulationProps = {
  location?: string
  options?: ShippingSla[]
}

type State = {
  input: InputProps
  shippingSimulation: ShippingSimulationProps
}

type Action =
  | {
      type: 'update'
      payload: State
    }
  | {
      type: 'onInput'
      payload: InputProps
    }
  | {
      type: 'onError'
      payload: Partial<InputProps>
    }
  | {
      type: 'clear'
    }

const createEmptySimulation = () => ({
  input: {
    postalCode: '',
    displayClearButton: false,
    errorMessage: '',
  },
  shippingSimulation: {
    location: '',
    options: [],
  },
})

const reducer = (state: State, action: Action) => {
  const { type } = action

  switch (type) {
    case 'clear': {
      return createEmptySimulation()
    }

    case 'update': {
      const { payload } = action

      return {
        input: {
          ...state.input,
          ...payload.input,
        },
        shippingSimulation: {
          ...state.shippingSimulation,
          ...payload.shippingSimulation,
        },
      }
    }

    case 'onInput': {
      const { payload } = action

      return {
        ...state,
        input: {
          ...payload,
        },
      }
    }

    case 'onError': {
      const { payload } = action

      return {
        ...state,
        input: {
          ...state.input,
          ...payload,
        },
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }
}

function getShippingInformation(
  shipping: ShippingSimulationQueryQuery['shipping']
): [string, ShippingSla[]] {
  const location =
    [shipping?.address?.neighborhood, shipping?.address?.city]
      .filter(Boolean)
      .join(' / ') ?? ''

  const options = shipping?.logisticsInfo?.[0]?.slas ?? []

  return [location, options as ShippingSla[]]
}

export const useShippingSimulation = (shippingItem: IShippingItem) => {
  const { postalCode: sessionPostalCode, country } = useSession()
  const [isValidating, setIsValidating] = useState(false)
  const [{ input, shippingSimulation }, dispatch] = useReducer(
    reducer,
    null,
    createEmptySimulation
  )

  const { postalCode: shippingPostalCode } = input

  useEffect(() => {
    if (!sessionPostalCode || shippingPostalCode) {
      return
    }

    // Use sessionPostalCode if there is no shippingPostalCode
    async function fetchShipping() {
      const shipping = await getShippingSimulation({
        country,
        postalCode: sessionPostalCode ?? '',
        items: [shippingItem],
      })

      const [location, options] = getShippingInformation(shipping)

      const optionsFormattedForPT = options?.length
        ? options.map((option: any) => ({
            ...option,
            price: option?.price === 0 ? 'Grátis' : option?.price,
            localizedEstimates: VtexUtils?.Shipping?.getLocalizedEstimates(
              option?.shippingEstimate
            ),
          }))
        : []

      dispatch({
        type: 'update',
        payload: {
          input: {
            postalCode: sessionPostalCode ?? '',
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location,
            options: optionsFormattedForPT,
          },
        },
      })
    }

    fetchShipping()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionPostalCode])

  const handleSubmit = useCallback(async () => {
    setIsValidating(true)
    try {
      const shipping = await getShippingSimulation({
        country,
        postalCode: shippingPostalCode ?? '',
        items: [shippingItem],
      })

      const [location, options] = getShippingInformation(shipping)

      const optionsFormattedForPT = options?.length
        ? options.map((option: any) => ({
            ...option,
            price: option?.price === 0 ? 'Grátis' : option?.price,
            localizedEstimates: VtexUtils?.Shipping?.getLocalizedEstimates(
              option?.shippingEstimate
            ),
          }))
        : []

      dispatch({
        type: 'update',
        payload: {
          input: {
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location,
            options: optionsFormattedForPT,
          },
        },
      })
    } catch (error) {
      dispatch({
        type: 'onError',
        payload: {
          displayClearButton: true,
          errorMessage: 'Você digitou um CEP inválido',
        },
      })
    } finally {
      setIsValidating(false)
    }
  }, [shippingPostalCode])

  const handleOnInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value

    if (currentValue) {
      dispatch({
        type: 'onInput',
        payload: {
          postalCode: currentValue,
          displayClearButton: false,
          errorMessage: '',
        },
      })
    } else {
      dispatch({
        type: 'clear',
      })
    }
  }, [])

  return {
    input,
    shippingSimulation,
    dispatch,
    handleSubmit,
    handleOnInput,
    isValidating
  }
}
