import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '@/App.vue'
import StockFilters from '@/components/StockFilters.vue'
import StockTable from '@/components/StockTable.vue'
import StockModal from '@/components/StockModal.vue'
import { messages } from '@/locales/messages'

vi.mock('@/locales/useMessages', () => ({
  useMessages: () => ({
    messages,
    msg: (key: string) => key
  })
}))

const mockStocks = ref([])
const mockFilters = ref({
  search: '',
  exchange: '',
  currency: '',
  minPrice: null,
  maxPrice: null,
  minPotential: null,
  maxPotential: null,
  marketCaps: []
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
    })

    it('should render the app subtitle', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-subtitle').exists()).toBe(true)
    })

    it('should render the main content area', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.app-main').exists()).toBe(true)
      expect(wrapper.find('.container').exists()).toBe(true)
    })
  })

  describe('component composition', () => {
    it('should render StockFilters component when toggled', async () => {
      const wrapper = mount(App)
      
      // Open filters
      await wrapper.find('.filters-toggle-btn').trigger('click')
      await wrapper.vm.$nextTick()
      
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

    it('should pass filters to StockFilters component when visible', async () => {
      const wrapper = mount(App)
      
      // Open filters
      await wrapper.find('.filters-toggle-btn').trigger('click')
      await wrapper.vm.$nextTick()
      
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
      expect(heading.text()).toContain(messages.header.title)
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
      
      expect(container.findComponent(StockTable).exists()).toBe(true)
    })
  })

  describe('filters toggle', () => {
    it('should render the filters toggle button', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.filters-toggle-btn').exists()).toBe(true)
    })

    it('should display "Szűrők megjelenítése" text when filters are hidden', () => {
      const wrapper = mount(App)
      expect(wrapper.find('.filters-toggle-btn').text()).toContain('Szűrők megjelenítése')
    })

    it('should hide StockFilters component by default', () => {
      const wrapper = mount(App)
      expect(wrapper.findComponent(StockFilters).exists()).toBe(false)
    })

    it('should show StockFilters when toggle button is clicked', async () => {
      const wrapper = mount(App)
      const toggleBtn = wrapper.find('.filters-toggle-btn')
      
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findComponent(StockFilters).exists()).toBe(true)
    })

    it('should display "Szűrők elrejtése" text when filters are visible', async () => {
      const wrapper = mount(App)
      await wrapper.find('.filters-toggle-btn').trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.filters-toggle-btn').text()).toContain('Szűrők elrejtése')
    })

    it('should toggle filters visibility when button is clicked multiple times', async () => {
      const wrapper = mount(App)
      const toggleBtn = wrapper.find('.filters-toggle-btn')
      
      // First click - open
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(StockFilters).exists()).toBe(true)
      
      // Second click - close
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(StockFilters).exists()).toBe(false)
    })

    it('should display active filters count badge', async () => {
      mockFilters.value = {
        search: 'Apple',
        exchange: 'NASDAQ',
        currency: '',
        minPrice: null,
        maxPrice: null,
        minPotential: null,
        maxPotential: null,
        marketCaps: []
      }
      
      const wrapper = mount(App)
      const badge = wrapper.find('.filter-badge')
      
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('2')
      
      mockFilters.value = {
        search: '',
        exchange: '',
        currency: '',
        minPrice: null,
        maxPrice: null,
        minPotential: null,
        maxPotential: null,
        marketCaps: []
      }
    })

    it('should not display badge when no filters are active', () => {
      mockFilters.value = {
        search: '',
        exchange: '',
        currency: '',
        minPrice: null,
        maxPrice: null,
        minPotential: null,
        maxPotential: null,
        marketCaps: []
      }
      
      const wrapper = mount(App)
      expect(wrapper.find('.filter-badge').exists()).toBe(false)
    })
  })

})
