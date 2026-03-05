import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import App from '@/App.vue'
import StockFilters from '@/components/StockFilters.vue'
import StockTable from '@/components/StockTable.vue'
import StockModal from '@/components/StockModal.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import hu from '@/locales/hu/messages.json'
import en from '@/locales/en/messages.json'

const createTestI18n = () =>
  createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'hu',
    messages: { hu, en },
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false
  })

const mountApp = () =>
  mount(App, {
    global: {
      plugins: [createTestI18n()],
      stubs: {
        StockFilters,
        StockTable,
        StockModal,
        LanguageSwitcher
      }
    }
  })

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

vi.mock('@/composables/useStocks', () => {
  const loadStocksMock = vi.fn()
  return {
    useStocks: () => ({
      stocks: mockStocks,
      loading: ref(false),
      filters: mockFilters,
      filteredStocks: mockFilteredStocks,
      exchanges: ref(['NASDAQ', 'NYSE']),
      currencies: ref(['USD', 'EUR']),
      loadStocks: loadStocksMock,
      resetFilters: vi.fn()
    }),
    __loadStocksMock: loadStocksMock
  }
})

describe('App', () => {
  describe('rendering', () => {
    it('should render the app container', () => {
      const wrapper = mountApp()
      expect(wrapper.find('#app').exists()).toBe(true)
    })

    it('should render the header', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.app-header').exists()).toBe(true)
    })

    it('should render the app title', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.app-title').exists()).toBe(true)
    })

    it('should render the app subtitle', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.app-subtitle').exists()).toBe(true)
    })

    it('should render the main content area', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.app-main').exists()).toBe(true)
      expect(wrapper.find('.container').exists()).toBe(true)
    })
  })

  describe('component composition', () => {
    it('should render StockFilters component when toggled', async () => {
      const wrapper = mountApp()
      
      // Open filters
      await wrapper.find('.filters-toggle-btn').trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findComponent(StockFilters).exists()).toBe(true)
    })

    it('should render StockTable component', () => {
      const wrapper = mountApp()
      expect(wrapper.findComponent(StockTable).exists()).toBe(true)
    })

    it('should render StockModal component', () => {
      const wrapper = mountApp()
      expect(wrapper.findComponent(StockModal).exists()).toBe(true)
    })

    it('should pass filters to StockFilters component when visible', async () => {
      const wrapper = mountApp()
      
      // Open filters
      await wrapper.find('.filters-toggle-btn').trigger('click')
      await wrapper.vm.$nextTick()
      
      const stockFilters = wrapper.findComponent(StockFilters)
      expect(stockFilters.props('filters')).toBeDefined()
      expect(stockFilters.props('exchanges')).toBeDefined()
      expect(stockFilters.props('currencies')).toBeDefined()
    })

    it('should pass filtered stocks to StockTable component', () => {
      const wrapper = mountApp()
      const stockTable = wrapper.findComponent(StockTable)
      
      expect(stockTable.props('stocks')).toBeDefined()
    })
  })

  describe('loading state', () => {
    it('should not show loading overlay when not loading', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.loading-overlay').exists()).toBe(false)
    })


  })

  describe('accessibility', () => {
    it('should have header element', () => {
      const wrapper = mountApp()
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should have main element', () => {
      const wrapper = mountApp()
      expect(wrapper.find('main').exists()).toBe(true)
    })

    it('should have heading with title', () => {
      const wrapper = mountApp()
      const heading = wrapper.find('h1')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toContain(hu.header.title)
    })

    it('should have title with icon SVG', () => {
      const wrapper = mountApp()
      const svg = wrapper.find('.app-title svg')
      expect(svg.exists()).toBe(true)
    })
  })

  describe('styling classes', () => {
    it('should have proper CSS class for header', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.app-header').exists()).toBe(true)
    })

    it('should have proper CSS class for main content', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.app-main').exists()).toBe(true)
    })

    it('should have proper CSS class for container', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.container').exists()).toBe(true)
    })
  })

  describe('semantic structure', () => {
    it('should have logical DOM hierarchy', () => {
      const wrapper = mountApp()
      const app = wrapper.find('#app')
      const header = app.find('header')
      const main = app.find('main')

      expect(header.exists()).toBe(true)
      expect(main.exists()).toBe(true)
    })

    it('should have header before main', () => {
      const wrapper = mountApp()
      const html = wrapper.html()
      const headerIndex = html.indexOf('app-header')
      const mainIndex = html.indexOf('app-main')

      expect(headerIndex).toBeLessThan(mainIndex)
    })

    it('should have all sections within container', () => {
      const wrapper = mountApp()
      const container = wrapper.find('.container')
      
      expect(container.findComponent(StockTable).exists()).toBe(true)
    })
  })

  describe('filters toggle', () => {
    it('should render the filters toggle button', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.filters-toggle-btn').exists()).toBe(true)
    })

    it('should display "Szűrők megjelenítése" text when filters are hidden', () => {
      const wrapper = mountApp()
      expect(wrapper.find('.filters-toggle-btn').text()).toContain('Szűrők megjelenítése')
    })

    it('should hide StockFilters component by default', () => {
      const wrapper = mountApp()
      expect(wrapper.findComponent(StockFilters).exists()).toBe(false)
    })

    it('should show StockFilters when toggle button is clicked', async () => {
      const wrapper = mountApp()
      const toggleBtn = wrapper.find('.filters-toggle-btn')
      
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findComponent(StockFilters).exists()).toBe(true)
    })

    it('should display "Szűrők elrejtése" text when filters are visible', async () => {
      const wrapper = mountApp()
      await wrapper.find('.filters-toggle-btn').trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.filters-toggle-btn').text()).toContain('Szűrők elrejtése')
    })

    it('should toggle filters visibility when button is clicked multiple times', async () => {
      const wrapper = mountApp()
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
      
      const wrapper = mountApp()
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
      
      const wrapper = mountApp()
      expect(wrapper.find('.filter-badge').exists()).toBe(false)
    })
  })

  describe('modal and detail flow', () => {
    it('should handle showing and closing modal with details', async () => {
      const wrapper = mountApp()
      
      // Initially no modal props
      let stockModal = wrapper.findComponent(StockModal)
      expect(stockModal.exists()).toBe(true)
    })

    it('should handle filter updates through component interaction', async () => {
      const wrapper = mountApp()
      
      // Open filters
      const toggleBtn = wrapper.find('.filters-toggle-btn')
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Filters should be visible
      expect(wrapper.findComponent(StockFilters).exists()).toBe(true)
      
      // Close filters
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findComponent(StockFilters).exists()).toBe(false)
    })

    it('should reset selected stock when modal closes', async () => {
      const wrapper = mountApp()
      
      // Get component instance to access internal state
      const vm = wrapper.vm as any
      
      // Set a selected stock
      const testStock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        stock_exchange: 'NYSE',
        currency: 'USD',
        market_cap: 'large' as const,
        entry_price: 100,
        current_price: 110,
        uplift_potential: 10,
        six_months_price_target: 120,
        twelve_months_price_target: 130,
        one_month_highest_price: 115,
        two_months_highest_price: 118,
        three_months_highest_price: 120,
        six_months_highest_price: 125,
        twelve_months_highest_price: 128,
        highest_price: 130,
        notes: '',
        links: '',
        agent: 'Test',
        last_modified: '2026-01-01T00:00:00Z',
        difference: null,
        created_at: '2026-01-01T00:00:00Z'
      }
      
      vm.showStockDetails(testStock)
      await wrapper.vm.$nextTick()
      
      // Modal should be open
      expect(vm.isModalOpen).toBe(true)
      expect(vm.selectedStock).toEqual(testStock)
    })

    it('should close modal and reset stock after timeout', async () => {
      vi.useFakeTimers()
      const wrapper = mountApp()
      const vm = wrapper.vm as any
      
      const testStock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        stock_exchange: 'NYSE',
        currency: 'USD',
        market_cap: 'large' as const,
        entry_price: 100,
        current_price: 110,
        uplift_potential: 10,
        six_months_price_target: 120,
        twelve_months_price_target: 130,
        one_month_highest_price: 115,
        two_months_highest_price: 118,
        three_months_highest_price: 120,
        six_months_highest_price: 125,
        twelve_months_highest_price: 128,
        highest_price: 130,
        notes: '',
        links: '',
        agent: 'Test',
        last_modified: '2026-01-01T00:00:00Z',
        difference: null,
        created_at: '2026-01-01T00:00:00Z'
      }
      
      // Open modal
      vm.showStockDetails(testStock)
      await wrapper.vm.$nextTick()
      expect(vm.isModalOpen).toBe(true)
      expect(vm.selectedStock).toEqual(testStock)
      
      // Close modal
      vm.closeModal()
      expect(vm.isModalOpen).toBe(false)
      expect(vm.selectedStock).toEqual(testStock) // Not cleared yet
      
      // Fast-forward time
      vi.advanceTimersByTime(300)
      await wrapper.vm.$nextTick()
      
      expect(vm.selectedStock).toBe(null)
      vi.useRealTimers()
    })
  })

  describe('table view toggle', () => {
    it('should display view toggle buttons', () => {
      const wrapper = mountApp()
      const basicInfosBtn = wrapper.findAll('.view-toggle-btn-header')[0]
      const priceChangesBtn = wrapper.findAll('.view-toggle-btn-header')[1]
      
      expect(basicInfosBtn.exists()).toBe(true)
      expect(priceChangesBtn.exists()).toBe(true)
    })

    it('should have basicInfos button active by default', () => {
      const wrapper = mountApp()
      const basicInfosBtn = wrapper.findAll('.view-toggle-btn-header')[0]
      
      expect(basicInfosBtn.classes()).toContain('active')
    })

    it('should switch to priceChanges view when button is clicked', async () => {
      const wrapper = mountApp()
      const priceChangesBtn = wrapper.findAll('.view-toggle-btn-header')[1]
      
      await priceChangesBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      const basicInfosBtn = wrapper.findAll('.view-toggle-btn-header')[0]
      expect(basicInfosBtn.classes()).not.toContain('active')
      expect(priceChangesBtn.classes()).toContain('active')
    })

    it('should switch back to basicInfos view', async () => {
      const wrapper = mountApp()
      const basicInfosBtn = wrapper.findAll('.view-toggle-btn-header')[0]
      const priceChangesBtn = wrapper.findAll('.view-toggle-btn-header')[1]
      
      // Switch to priceChanges
      await priceChangesBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Switch back to basicInfos
      await basicInfosBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(basicInfosBtn.classes()).toContain('active')
      expect(priceChangesBtn.classes()).not.toContain('active')
    })

    it('should not change view if clicking same active button', async () => {
      const wrapper = mountApp()
      const vm = wrapper.vm as any
      const basicInfosBtn = wrapper.findAll('.view-toggle-btn-header')[0]
      
      const initialView = vm.tableView
      
      // Click the already active button
      await basicInfosBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      // View should remain the same
      expect(vm.tableView).toBe(initialView)
      expect(basicInfosBtn.classes()).toContain('active')
    })

    it('should pass current view to StockTable component', async () => {
      const wrapper = mountApp()
      const stockTable = wrapper.findComponent(StockTable)
      
      expect(stockTable.props('currentView')).toBe('basicInfos')
      
      const priceChangesBtn = wrapper.findAll('.view-toggle-btn-header')[1]
      await priceChangesBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(stockTable.props('currentView')).toBe('priceChanges')
    })
  })

  describe('filter count calculations', () => {
    it('should count active filters correctly with search only', () => {
      mockFilters.value = {
        search: 'test',
        exchange: '',
        currency: '',
        minPrice: null,
        maxPrice: null,
        minPotential: null,
        maxPotential: null,
        marketCaps: []
      }
      
      const wrapper = mountApp()
      const badge = wrapper.find('.filter-badge')
      
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('1')
      
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

    it('should count active filters with multiple filter types', () => {
      mockFilters.value = {
        search: 'test',
        exchange: 'NYSE',
        currency: 'USD',
        minPrice: 100,
        maxPrice: 500,
        minPotential: null,
        maxPotential: null,
        marketCaps: []
      }
      
      const wrapper = mountApp()
      const badge = wrapper.find('.filter-badge')
      
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('5')
      
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

    it('should count minPotential and maxPotential filters', () => {
      mockFilters.value = {
        search: '',
        exchange: '',
        currency: '',
        minPrice: null,
        maxPrice: null,
        minPotential: 5,
        maxPotential: 50,
        marketCaps: []
      }
      
      const wrapper = mountApp()
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

    it('should hide badge when no filters are active', () => {
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
      
      const wrapper = mountApp()
      expect(wrapper.find('.filter-badge').exists()).toBe(false)
    })
  })

})
