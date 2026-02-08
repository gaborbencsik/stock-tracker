import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '@/App.vue'
import StockFilters from '@/components/StockFilters.vue'
import StockTable from '@/components/StockTable.vue'
import StockModal from '@/components/StockModal.vue'

const mockStocks = ref([])
const mockFilters = ref({
  search: '',
  exchange: '',
  currency: '',
  minPrice: null,
  maxPrice: null,
  minPotential: null,
  maxPotential: null
})
const mockFilteredStocks = ref([])

vi.mock('@/composables/useStocks', () => ({
  useStocks: () => ({
    stocks: mockStocks,
    loading: ref(false),
    filters: mockFilters,
    filteredStocks: mockFilteredStocks,
    exchanges: ref(['NASDAQ', 'NYSE']),
    currencies: ref(['USD', 'EUR']),
    loadStocks: vi.fn(),
    resetFilters: vi.fn()
  })
}))

describe('App', () => {
  describe('rendering', () => {
    it('should render the app container', () => {
      const wrapper = mount(App)
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should render the header', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-header').exists()).toBe(true)
    })

    it('should render the app title', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-title').exists()).toBe(true)
      expect(wrapper.text()).toContain('Részvény Követő')
    })

    it('should render the app subtitle', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-subtitle').exists()).toBe(true)
      expect(wrapper.text()).toContain('Személyes portfólió elemzés')
    })

    it('should render the main content area', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-main').exists()).toBe(true)
      expect(wrapper.find('.container').exists()).toBe(true)
    })
  })

  describe('component composition', () => {
    it('should render StockFilters component', () => {
      const wrapper = mount(App)
      expect(wrapper.findComponent(StockFilters).exists()).toBe(true)
    })

    it('should render StockTable component', () => {
      const wrapper = mount(App)
      expect(wrapper.findComponent(StockTable).exists()).toBe(true)
    })

    it('should render StockModal component', () => {
      const wrapper = mount(App)
      expect(wrapper.findComponent(StockModal).exists()).toBe(true)
    })

    it('should pass filters to StockFilters component', () => {
      const wrapper = mount(App)
      const stockFilters = wrapper.findComponent(StockFilters)
      
      expect(stockFilters.props('filters')).toBeDefined()
      expect(stockFilters.props('exchanges')).toBeDefined()
      expect(stockFilters.props('currencies')).toBeDefined()
    })

    it('should pass filtered stocks to StockTable component', () => {
      const wrapper = mount(App)
      const stockTable = wrapper.findComponent(StockTable)
      
      expect(stockTable.props('stocks')).toBeDefined()
    })
  })

  describe('summary cards', () => {
    it('should render summary card section', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.stocks-summary').exists()).toBe(true)
    })

    it('should display total stocks count', () => {
      const wrapper = mount(App)
      expect(wrapper.text()).toContain('Összes részvény')
    })

    it('should display filtered results count', () => {
      const wrapper = mount(App)
      expect(wrapper.text()).toContain('Szűrt eredmények')
    })

    it('should display average potential', () => {
      const wrapper = mount(App)
      expect(wrapper.text()).toContain('Átlag potenciál')
    })

    it('should render three summary cards', () => {
      const wrapper = mount(App)
      const summaryCards = wrapper.findAll('.summary-card')
      expect(summaryCards).toHaveLength(3)
    })
  })

  describe('loading state', () => {
    it('should not show loading overlay when not loading', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.loading-overlay').exists()).toBe(false)
    })


  })

  describe('accessibility', () => {
    it('should have header element', () => {
      const wrapper = mount(App)
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should have main element', () => {
      const wrapper = mount(App)
      expect(wrapper.find('main').exists()).toBe(true)
    })

    it('should have heading with title', () => {
      const wrapper = mount(App)
      const heading = wrapper.find('h1')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toContain('Részvény Követő')
    })

    it('should have title with icon SVG', () => {
      const wrapper = mount(App)
      const svg = wrapper.find('.app-title svg')
      expect(svg.exists()).toBe(true)
    })
  })

  describe('styling classes', () => {
    it('should have proper CSS class for header', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-header').exists()).toBe(true)
    })

    it('should have proper CSS class for main content', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-main').exists()).toBe(true)
    })

    it('should have proper CSS class for container', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.container').exists()).toBe(true)
    })

    it('should have summary value styling', () => {
      const wrapper = mount(App)
      const summaryValues = wrapper.findAll('.summary-value')
      expect(summaryValues.length).toBeGreaterThan(0)
    })
  })

  describe('semantic structure', () => {
    it('should have logical DOM hierarchy', () => {
      const wrapper = mount(App)
      const app = wrapper.find('#app')
      const header = app.find('header')
      const main = app.find('main')

      expect(header.exists()).toBe(true)
      expect(main.exists()).toBe(true)
    })

    it('should have header before main', () => {
      const wrapper = mount(App)
      const html = wrapper.html()
      const headerIndex = html.indexOf('app-header')
      const mainIndex = html.indexOf('app-main')

      expect(headerIndex).toBeLessThan(mainIndex)
    })

    it('should have all sections within container', () => {
      const wrapper = mount(App)
      const container = wrapper.find('.container')
      
      expect(container.findComponent(StockFilters).exists()).toBe(true)
      expect(container.find('.stocks-summary').exists()).toBe(true)
      expect(container.findComponent(StockTable).exists()).toBe(true)
    })
  })

  describe('data display', () => {
    it('should display summary information', () => {
      const wrapper = mount(App)
      const summaryLabels = wrapper.findAll('.summary-label')

      expect(summaryLabels.length).toBeGreaterThan(0)
      summaryLabels.forEach(label => {
        expect(label.text()).toBeTruthy()
      })
    })

    it('should display summary values', () => {
      const wrapper = mount(App)
      const summaryValues = wrapper.findAll('.summary-value')

      expect(summaryValues.length).toBeGreaterThan(0)
    })
  })
})
