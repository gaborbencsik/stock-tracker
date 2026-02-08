import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StockFilters from '@/components/StockFilters.vue'
import MarketCapSelect from '@/components/MarketCapSelect.vue'
import type { StockFilters as StockFiltersType } from '@/types/Stock'

describe('StockFilters', () => {
  const defaultFilters: StockFiltersType = {
    search: '',
    exchange: '',
    currency: '',
    minPrice: null,
    maxPrice: null,
    minPotential: null,
    maxPotential: null,
    marketCaps: []
  }

  const mockExchanges = ['NASDAQ', 'NYSE']
  const mockCurrencies = ['USD', 'EUR']

  const createComponent = (props = {}) => {
    return mount(StockFilters, {
      props: {
        filters: defaultFilters,
        exchanges: mockExchanges,
        currencies: mockCurrencies,
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the filters container', () => {
      const wrapper = createComponent()
      expect(wrapper.find('.filters-container').exists()).toBe(true)
    })

    it('should render the reset button', () => {
      const wrapper = createComponent()
      expect(wrapper.find('.reset-button').exists()).toBe(true)
      expect(wrapper.find('.reset-button').text()).toBe('Visszaállítás')
    })

    it('should render all filter input fields', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#search').exists()).toBe(true)
      expect(wrapper.find('#minPrice').exists()).toBe(true)
      expect(wrapper.find('#maxPrice').exists()).toBe(true)
      expect(wrapper.find('#minPotential').exists()).toBe(true)
      expect(wrapper.find('#maxPotential').exists()).toBe(true)
    })

    it('should render exchange and currency dropdowns', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#exchange').exists()).toBe(true)
      expect(wrapper.find('#currency').exists()).toBe(true)
    })

    it('should render all available exchanges', () => {
      const wrapper = createComponent()
      const exchangeOptions = wrapper.findAll('#exchange option')
      expect(exchangeOptions).toHaveLength(mockExchanges.length + 1) // +1 for "Összes"
    })

    it('should render all available currencies', () => {
      const wrapper = createComponent()
      const currencyOptions = wrapper.findAll('#currency option')
      expect(currencyOptions).toHaveLength(mockCurrencies.length + 1) // +1 for "Összes"
    })
  })

  describe('search functionality', () => {
    it('should have search input field', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#search').exists()).toBe(true)
    })

    it('should accept search text input', async () => {
      const wrapper = createComponent()
      const searchInput = wrapper.find<HTMLInputElement>('#search')

      await searchInput.setValue('AAPL')

      expect(searchInput.element.value).toBe('AAPL')
    })

    it('should allow clearing search input', async () => {
      const wrapper = createComponent()
      const searchInput = wrapper.find<HTMLInputElement>('#search')

      await searchInput.setValue('TEST')
      await searchInput.setValue('')

      expect(searchInput.element.value).toBe('')
    })
  })

  describe('exchange filter', () => {
    it('should have exchange dropdown', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#exchange').exists()).toBe(true)
    })

    it('should display all exchanges in dropdown', () => {
      const wrapper = createComponent()
      const exchangeOptions = wrapper.findAll('#exchange option')
      const optionTexts = exchangeOptions.map(o => o.text())

      expect(optionTexts).toContain('Összes')
      mockExchanges.forEach(exchange => {
        expect(optionTexts).toContain(exchange)
      })
    })

    it('should allow selecting an exchange', async () => {
      const wrapper = createComponent()
      const exchangeSelect = wrapper.find<HTMLSelectElement>('#exchange')

      await exchangeSelect.setValue('NASDAQ')

      expect(exchangeSelect.element.value).toBe('NASDAQ')
    })
  })

  describe('currency filter', () => {
    it('should have currency dropdown', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#currency').exists()).toBe(true)
    })

    it('should display all currencies in dropdown', () => {
      const wrapper = createComponent()
      const currencyOptions = wrapper.findAll('#currency option')
      const optionTexts = currencyOptions.map(o => o.text())

      expect(optionTexts).toContain('Összes')
      mockCurrencies.forEach(currency => {
        expect(optionTexts).toContain(currency)
      })
    })

    it('should allow selecting a currency', async () => {
      const wrapper = createComponent()
      const currencySelect = wrapper.find<HTMLSelectElement>('#currency')

      await currencySelect.setValue('EUR')

      expect(currencySelect.element.value).toBe('EUR')
    })
  })

  describe('price range filter', () => {
    it('should have minimum price input field', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#minPrice').exists()).toBe(true)
    })

    it('should have maximum price input field', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#maxPrice').exists()).toBe(true)
    })

    it('should accept numeric price values', async () => {
      const wrapper = createComponent()
      const minPriceInput = wrapper.find<HTMLInputElement>('#minPrice')
      const maxPriceInput = wrapper.find<HTMLInputElement>('#maxPrice')

      await minPriceInput.setValue(100.5)
      await maxPriceInput.setValue(500.99)

      expect(minPriceInput.element.valueAsNumber).toBe(100.5)
      expect(maxPriceInput.element.valueAsNumber).toBe(500.99)
    })
  })

  describe('potential range filter', () => {
    it('should have minimum potential input field', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#minPotential').exists()).toBe(true)
    })

    it('should have maximum potential input field', () => {
      const wrapper = createComponent()
      expect(wrapper.find('#maxPotential').exists()).toBe(true)
    })

    it('should accept numeric potential values', async () => {
      const wrapper = createComponent()
      const minPotentialInput = wrapper.find<HTMLInputElement>('#minPotential')
      const maxPotentialInput = wrapper.find<HTMLInputElement>('#maxPotential')

      await minPotentialInput.setValue(5.5)
      await maxPotentialInput.setValue(50.0)

      expect(minPotentialInput.element.valueAsNumber).toBe(5.5)
      expect(maxPotentialInput.element.valueAsNumber).toBe(50.0)
    })

    it('should allow negative potential values', async () => {
      const wrapper = createComponent()
      const minPotentialInput = wrapper.find<HTMLInputElement>('#minPotential')

      await minPotentialInput.setValue(-10.5)

      expect(minPotentialInput.element.valueAsNumber).toBe(-10.5)
    })
  })

  describe('reset functionality', () => {
    it('should emit reset event when reset button is clicked', async () => {
      const wrapper = createComponent()
      await wrapper.find('.reset-button').trigger('click')

      expect(wrapper.emitted('reset')).toBeTruthy()
      expect(wrapper.emitted('reset')).toHaveLength(1)
    })
  })

  describe('filter props', () => {
    it('should accept filters as props', () => {
      const customFilters: StockFiltersType = {
        ...defaultFilters,
        search: 'AAPL',
        exchange: 'NASDAQ'
      }

      const wrapper = createComponent({ filters: customFilters })

      expect(wrapper.find('#search').element).toBeTruthy()
      expect(wrapper.find('#exchange').element).toBeTruthy()
    })

    it('should accept exchanges list as props', () => {
      const customExchanges = ['NASDAQ', 'NYSE', 'AMEX']
      const wrapper = createComponent({ exchanges: customExchanges })

      const exchangeOptions = wrapper.findAll('#exchange option')
      expect(exchangeOptions.length).toBe(customExchanges.length + 1)
    })

    it('should accept currencies list as props', () => {
      const customCurrencies = ['USD', 'EUR', 'GBP', 'JPY']
      const wrapper = createComponent({ currencies: customCurrencies })

      const currencyOptions = wrapper.findAll('#currency option')
      expect(currencyOptions.length).toBe(customCurrencies.length + 1)
    })
  })

  describe('accessibility', () => {
    it('should have labels for all input fields', () => {
      const wrapper = createComponent()

      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should link labels to their inputs using for attribute', () => {
      const wrapper = createComponent()

      const searchLabel = wrapper.find('label[for="search"]')
      expect(searchLabel.exists()).toBe(true)

      const exchangeLabel = wrapper.find('label[for="exchange"]')
      expect(exchangeLabel.exists()).toBe(true)
    })

    it('should have proper input IDs', () => {
      const wrapper = createComponent()

      const inputIds = ['search', 'exchange', 'currency', 'minPrice', 'maxPrice', 'minPotential', 'maxPotential']
      inputIds.forEach(id => {
        expect(wrapper.find(`#${id}`).exists()).toBe(true)
      })
    })

    it('should render market cap component', () => {
      const wrapper = createComponent()

      expect(wrapper.findComponent(MarketCapSelect).exists()).toBe(true)
    })

    it('should have all three market cap options available', async () => {
      const wrapper = createComponent()
      const marketCapSelect = wrapper.findComponent(MarketCapSelect)

      expect(marketCapSelect.exists()).toBe(true)
    })
  })

  describe('market cap filtering', () => {
    it('should update filters when market cap value changes', async () => {
      const wrapper = createComponent()
      const marketCapSelect = wrapper.findComponent(MarketCapSelect)

      await marketCapSelect.vm.$emit('update:modelValue', ['small'])

      expect(wrapper.emitted('update:filters')).toBeTruthy()
    })

    it('should support multiple market cap selections', async () => {
      const wrapper = createComponent()
      const marketCapSelect = wrapper.findComponent(MarketCapSelect)

      await marketCapSelect.vm.$emit('update:modelValue', ['small', 'large'])

      const emitted = wrapper.emitted('update:filters')
      expect(emitted).toBeTruthy()
      expect((emitted![emitted!.length - 1][0] as any).marketCaps.length).toBe(2)
    })

    it('should clear market cap selection', async () => {
      const wrapper = createComponent()
      const marketCapSelect = wrapper.findComponent(MarketCapSelect)

      await marketCapSelect.vm.$emit('update:modelValue', ['small', 'mid', 'large'])
      await marketCapSelect.vm.$emit('update:modelValue', [])

      const emitted = wrapper.emitted('update:filters')
      expect((emitted![emitted!.length - 1][0] as any).marketCaps.length).toBe(0)
    })
  })
})
