import type { IShippingItem } from '@faststore/api'
import { Table, TableBody, TableCell, TableRow } from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import Price from 'src/components/ui/Price'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import InputText from '../InputText'
import styles from './shipping-simulation.module.scss'
import { useShippingSimulation } from './useShippingSimulation'

interface ShippingSimulationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Object used for simulating shippings
   */
  shippingItem: IShippingItem
}

function ShippingSimulation({
  testId = 'store-shipping-simulation',
  shippingItem,
  ...otherProps
}: ShippingSimulationProps) {
  const { dispatch, input, shippingSimulation, handleSubmit, handleOnInput, isValidating } =
    useShippingSimulation(shippingItem)

  const {
    postalCode: shippingPostalCode,
    displayClearButton,
    errorMessage,
  } = input

  const { location: shippingLocation, options: shippingOptions } =
    shippingSimulation

  const formatter = usePriceFormatter()

  const hasShippingOptions = !!shippingOptions && shippingOptions.length > 0

  return (
    <section
      className={styles.fsShippingSimulation}
      data-fs-shipping-simulation
      data-fs-shipping-simulation-empty={!hasShippingOptions ? 'true' : 'false'}
      data-testid={testId}
      {...otherProps}
    >
      <h2 className="text__title-subsection" data-fs-shipping-simulation-title>
        Calcular frete
      </h2>

      <div>
        <InputText
          actionable
          error={errorMessage}
          id="shipping-postal-code"
          buttonActionText="Calcular"
          placeholder="00000-000"
          value={shippingPostalCode}
          onInput={handleOnInput}
          onKeyUp={(e: any) => e.keyCode === 13 && handleSubmit()}
          onSubmit={handleSubmit}
          onClear={() => dispatch({ type: 'clear' })}
          displayClearButton={displayClearButton}
          disabled={isValidating}
        />

        {hasShippingOptions && (
          <>
            <header data-fs-shipping-simulation-header>
              <h3 data-fs-shipping-simulation-subtitle>Opções de envio</h3>
              <p className="text__body" data-fs-shipping-simulation-location>
                {shippingLocation}
              </p>
            </header>

            <Table data-fs-shipping-simulation-table>
              <TableBody>
                {shippingOptions.map((option) => (
                  <TableRow
                    key={option.carrier}
                    data-fs-shipping-simulation-table-row
                  >
                    <TableCell data-fs-shipping-simulation-table-cell>
                      {option.carrier}
                    </TableCell>
                    <TableCell data-fs-shipping-simulation-table-cell>
                      {option.localizedEstimates}
                    </TableCell>
                    <TableCell data-fs-shipping-simulation-table-cell>
                      {option.price && (
                        <Price
                          formatter={formatter}
                          value={option.price}
                          SRText="price"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

    </section>
  )
}

export default ShippingSimulation
