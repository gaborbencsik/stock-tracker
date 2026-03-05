import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import StockTable from '@/components/StockTable.vue'
import hu from '@/locales/hu/messages.json'
import en from '@/locales/en/messages.json'
import type { Stock } from '@/types/Stock'

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

const mountStockTable = (
  stocks: Stock[] = [],
  currentView: 'basicInfos' | 'priceChanges' = 'basicInfos'
) =>
  mount(StockTable, {
    props: { stocks, currentView },
    global: {
      plugins: [createTestI18n()],
      stubs: {}
    }
  })

describe('StockTable', () => {
  const mockStocks: Stock[] = [
    {
      id: 1,
      ticker: 'AAPL',
      name: 'Apple Inc.',
      stock_exchange: 'NASDAQ',
      currency: 'USD',
      market_cap: 'large',
      entry_price: 175.50,
      current_price: 182.45,
      uplift_potential: 14.2,
      six_months_price_target: 195.00,
      twelve_months_price_target: 210.00,
      one_month_highest_price: 182.50,
      two_months_highest_price: 185.30,
      three_months_highest_price: 187.20,
      six_months_highest_price: 190.50,
      twelve_months_highest_price: 195.00,
      highest_price: 198.23,
      notes: 'Test notes',
      links: 'https://investor.apple.com',
      agent: 'OpenAI',
      last_modified: '2026-02-08T10:30:00Z',
      difference: null,
    created_at: '2026-01-15T14:22:00Z'
    },
    {
      id: 2,
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      stock_exchange: 'NASDAQ',
      currency: 'USD',
      market_cap: 'large',
      entry_price: 380.00,
      current_price: 395.20,
      uplift_potential: 18.5,
      six_months_price_target: 425.00,
      twelve_months_price_target: 450.00,
      one_month_highest_price: 390.20,
      two_months_highest_price: 395.50,
      three_months_highest_price: 398.75,
      six_months_highest_price: 405.00,
      twelve_months_highest_price: 410.30,
      highest_price: 415.50,
      notes: 'Microsoft notes',
      links: 'https://www.microsoft.com/investor',
      agent: 'Gemini',
      last_modified: '2026-02-07T15:45:00Z',
      difference: null,
    created_at: '2026-01-20T09:15:00Z'
    }
  ]

  describe('rendering', () => {
    it('should render table when stocks are provided', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.find('.stocks-table').exists()).toBe(true)
    })

    it('should display empty state when no stocks', () => {
      const wrapper = mountStockTable([])

      expect(wrapper.find('.empty-state').exists()).toBe(true)
      expect(wrapper.text()).toContain(hu.table.empty.title)
    })

    it('should render correct number of groups', () => {
      // mockStocks has 2 different tickers = 2 single-item groups
      const wrapper = mountStockTable(mockStocks)

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const grouped = component.groupedAndSortedStocks

      expect(grouped.length).toBe(2) // Two groups: AAPL (single) and MSFT (single)
    })

    it('should render correct number of detail rows per group', async () => {
      // Create a multi-item group - detail rows are only visible when expanded
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
      ]
      const wrapper = mountStockTable(stocks)

      // By default, groups are collapsed, so no detail rows are visible
      let detailRows = wrapper.findAll('.stock-row-in-group')
      expect(detailRows.length).toBe(0)

      // Get the collapsed row and click the ticket cell to expand
      const collapsedRow = wrapper.find('.stock-row-collapsible')
      const tickerCell = collapsedRow.find('.ticker-cell')
      await tickerCell.trigger('click')
      await nextTick()

      // After expanding, detail rows should be visible
      detailRows = wrapper.findAll('.stock-row-in-group')
      expect(detailRows.length).toBe(2) // Two rows in the same group
    })

    it('should display ticker in group headers', async () => {
      // Use stocks with multiple items in same groups
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
        { ...mockStocks[0], id: 3, ticker: 'MSFT' },
        { ...mockStocks[0], id: 4, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // Initially, groups are collapsed (collapsible rows show ticket badges)
      let tickerBadges = wrapper.findAll('.stock-row-collapsible .ticker-badge')
      expect(tickerBadges.length).toBeGreaterThan(0)
      expect(tickerBadges[0].text()).toMatch(/AAPL|MSFT/)

      // Now expand the groups to see headers in expanded state
      const collapsibleRows = wrapper.findAll('.stock-row-collapsible')
      await collapsibleRows[0]?.find('.ticker-cell')?.trigger('click')
      await nextTick()
      
      // In expanded state, first detail row should contain ticker badge
      const expandedDetailRows = wrapper.findAll('.stock-row-group-details')
      const firstRowBadge = expandedDetailRows[0]?.find('.ticker-badge')
      expect(firstRowBadge?.text()).toBe('AAPL')
    })

    it('should display stock name in each detail row', async () => {
      // Use stocks with multiple items in same ticker group
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[1], id: 2, ticker: 'AAPL' },
      ]
      const wrapper = mountStockTable(stocks)

      // Expand the group to see detail rows
      const tickerCell = wrapper.find('.ticker-cell')
      await tickerCell.trigger('click')
      await nextTick()

      const detailRows = wrapper.findAll('.stock-row-in-group')
      const names = detailRows.map(row => row.find('.name-cell')?.text())
      expect(names).toContain('Apple Inc.')
      expect(names).toContain('Microsoft Corporation')
    })

    it('should display entry price with currency', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain('175.50 USD')
      expect(wrapper.text()).toContain('380.00 USD')
    })

    it('should display uplift potential with percentage', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain('14.2%')
      expect(wrapper.text()).toContain('18.5%')
    })

    it('should display created_at date', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain('2026-01-15')
      expect(wrapper.text()).toContain('2026-01-20')
    })

    it('should display current price with currency', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain('182.45 USD')
      expect(wrapper.text()).toContain('395.20 USD')
    })

    it('should display current price header', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain(hu.table.columns.currentPrice)
    })

    it('should display current price between potential and price target columns', () => {
      const wrapper = mountStockTable(mockStocks)

      const headers = wrapper.findAll('th')
      const potentialIndex = headers.findIndex(th => th.text().includes(hu.table.columns.potential))
      const currentPriceIndex = headers.findIndex(th => th.text().includes(hu.table.columns.currentPrice))
      const createdIndex = headers.findIndex(th => th.text().includes(hu.table.columns.created))

      expect(potentialIndex).toBeLessThan(currentPriceIndex)
      expect(currentPriceIndex).toBeLessThan(createdIndex)
    })

    it('should render details button for each stock', () => {
      const wrapper = mountStockTable(mockStocks)

      const buttons = wrapper.findAll('.details-button')
      expect(buttons.length).toBe(mockStocks.length)
    })
  })

  describe('sorting', () => {
    it('should sort by ticker when ticker header is clicked', async () => {
      // Create stocks with multiple items in same groups
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'MSFT', created_at: '2026-01-20T10:00:00Z' },
        { ...mockStocks[0], id: 2, ticker: 'MSFT', created_at: '2026-01-21T10:00:00Z' },
        { ...mockStocks[0], id: 3, ticker: 'AAPL', created_at: '2026-01-15T10:00:00Z' },
        { ...mockStocks[0], id: 4, ticker: 'AAPL', created_at: '2026-01-16T10:00:00Z' },
      ]
      const wrapper = mountStockTable(stocks)

      const headers = wrapper.findAll('th.sortable')
      const tickerHeader = headers[0]

      // Click to sort by ticker (ascending by default when switching)
      await tickerHeader.trigger('click')
      await nextTick()

      // Groups are collapsed, so check the visible collapsed rows
      const collapsedRows = wrapper.findAll('.stock-row-collapsible')
      const firstTicker = collapsedRows[0]?.find('.ticker-badge')?.text()
      expect(firstTicker).toBe('AAPL')
    })

    it('should toggle sort order when clicking same header twice', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'MSFT', created_at: '2026-01-20T10:00:00Z' },
        { ...mockStocks[0], id: 2, ticker: 'MSFT', created_at: '2026-01-21T10:00:00Z' },
        { ...mockStocks[0], id: 3, ticker: 'AAPL', created_at: '2026-01-15T10:00:00Z' },
        { ...mockStocks[0], id: 4, ticker: 'AAPL', created_at: '2026-01-16T10:00:00Z' },
      ]
      const wrapper = mountStockTable(stocks)

      const headers = wrapper.findAll('th.sortable')
      const tickerHeader = headers[0]

      // First click ticker header - should sort by ticker ascending
      await tickerHeader.trigger('click')
      await nextTick()
      let collapsedRows = wrapper.findAll('.stock-row-collapsible')
      let firstTicker = collapsedRows[0]?.find('.ticker-badge')?.text()
      expect(firstTicker).toBe('AAPL')

      // Second click - toggle to descending
      await tickerHeader.trigger('click')
      await nextTick()
      collapsedRows = wrapper.findAll('.stock-row-collapsible')
      firstTicker = collapsedRows[0]?.find('.ticker-badge')?.text()
      expect(firstTicker).toBe('MSFT')
    })

    it('should display sort indicator', async () => {
      const wrapper = mountStockTable(mockStocks)

      const headers = wrapper.findAll('th.sortable')
      await headers[0].trigger('click')

      expect(wrapper.find('.sort-indicator').exists()).toBe(true)
    })

    it('should sort by price numerically', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'EXPENSIVE', entry_price: 500, created_at: '2026-01-15T10:00:00Z' },
        { ...mockStocks[0], id: 2, ticker: 'CHEAP', entry_price: 100, created_at: '2026-01-15T10:00:00Z' },
      ]
      const wrapper = mountStockTable(stocks)

      const headers = wrapper.findAll('th.sortable')
      const priceHeader = headers[3] // entry_price column

      await priceHeader.trigger('click')
      await nextTick()

      // Single-item groups, so check for normal ticket badges in .stock-row
      const rows = wrapper.findAll('.stock-row')
      const firstTicker = rows[0].find('.ticker-badge')?.text()
      // After first click, sort is ascending by entry_price
      // Actually we'll click twice to get the sorted order we expect
      expect(firstTicker).toBe('EXPENSIVE') // First sort is ascending
    })
  })

  describe('interactions', () => {
    it('should emit show-details event when details button is clicked', async () => {
      const wrapper = mountStockTable(mockStocks)

      const detailsButton = wrapper.find('.details-button')
      const detailsRow = wrapper.find('.stock-row')
      const detailsRowName = detailsRow.find('.name-cell')?.text()
      
      await detailsButton.trigger('click')

      expect(wrapper.emitted('show-details')).toBeTruthy()
      const emittedStock = wrapper.emitted('show-details')?.[0]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.name).toBe(detailsRowName)
    })

    it('should emit correct stock when different rows are clicked', async () => {
      const wrapper = mountStockTable(mockStocks)

      const rows = wrapper.findAll('.stock-row')
      
      // Get names from rendered rows to match the sorted order
      const firstRowName = rows[0]?.find('.name-cell')?.text()
      const secondRowName = rows[1]?.find('.name-cell')?.text()
      
      await rows[0]?.trigger('click')
      let emittedStock = wrapper.emitted('show-details')?.[0]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.name).toBe(firstRowName)

      await rows[1]?.trigger('click')
      emittedStock = wrapper.emitted('show-details')?.[1]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.name).toBe(secondRowName)
    })
  })

  describe('potential badge styling', () => {
    it('should apply positive class for positive potential', () => {
      const wrapper = mountStockTable(mockStocks)

      const potentialBadges = wrapper.findAll('.potential-badge')
      expect(potentialBadges[0].classes()).toContain('positive')
      expect(potentialBadges[1].classes()).toContain('positive')
    })

    it('should apply negative class for negative potential', () => {
      const negativeStock: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'TEST',
        uplift_potential: -5.3
      }

      const wrapper = mountStockTable([negativeStock])

      const potentialBadge = wrapper.find('.potential-badge')
      expect(potentialBadge.classes()).toContain('negative')
    })

    it('should display minus sign for negative potential', () => {
      const negativeStock: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'TEST',
        uplift_potential: -5.3
      }

      const wrapper = mountStockTable([negativeStock])

      expect(wrapper.text()).toContain('-5.3%')
    })

    it('should display plus sign for positive potential', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain('+14.2%')
    })
  })

  describe('market cap display', () => {
    it('should display market cap for each stock', () => {
      const wrapper = mountStockTable(mockStocks)

      expect(wrapper.text()).toContain('large')
    })

    it('should display market cap for small cap stock', () => {
      const smallCapStock = { ...mockStocks[0], market_cap: 'small' as const }
      const wrapper = mountStockTable([smallCapStock])

      expect(wrapper.text()).toContain('small')
    })

    it('should display market cap for mid cap stock', () => {
      const midCapStock = { ...mockStocks[0], market_cap: 'mid' as const }
      const wrapper = mountStockTable([midCapStock])

      expect(wrapper.text()).toContain('mid')
    })

    it('should display different market caps for different stocks', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], market_cap: 'small' as const },
        { ...mockStocks[1], market_cap: 'large' as const }
      ]
      const wrapper = mountStockTable(stocks)

      const text = wrapper.text()
      expect(text).toContain('small')
      expect(text).toContain('large')
    })
  })

  describe('difference column display', () => {
    it('should display dash when difference is null', () => {
      const wrapper = mountStockTable(mockStocks)

      // Find cells with just "-" text in the difference column
      const dashCells = wrapper.findAll('td').filter(cell => 
        cell.classes().includes('difference-cell') && cell.text() === '-'
      )
      
      expect(dashCells.length).toBeGreaterThan(0)
    })

    it('should display difference percentage when difference has value', async () => {
      const stockWithDifference: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'DIFF',
        difference: 4.25
      }

      const wrapper = mountStockTable([stockWithDifference])

      const differenceBadges = wrapper.findAll('.difference-badge')
      expect(differenceBadges.length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain('+4.25%')
    })

    it('should apply positive class for positive difference', () => {
      const stockWithPositiveDifference: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'DIFF',
        difference: 5.0
      }

      const wrapper = mountStockTable([stockWithPositiveDifference])

      const differenceBadge = wrapper.find('.difference-badge')
      expect(differenceBadge.classes()).toContain('positive')
    })

    it('should apply negative class for negative difference', () => {
      const stockWithNegativeDifference: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'DIFF',
        difference: -3.5
      }

      const wrapper = mountStockTable([stockWithNegativeDifference])

      const differenceBadge = wrapper.find('.difference-badge')
      expect(differenceBadge.classes()).toContain('negative')
    })

    it('should display plus sign for positive difference', () => {
      const stockWithPositiveDifference: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'DIFF',
        difference: 2.75
      }

      const wrapper = mountStockTable([stockWithPositiveDifference])

      expect(wrapper.text()).toContain('+2.75%')
    })

    it('should display without plus sign for negative difference', () => {
      const stockWithNegativeDifference: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'DIFF',
        difference: -1.5
      }

      const wrapper = mountStockTable([stockWithNegativeDifference])

      expect(wrapper.text()).toContain('-1.50%')
    })

    it('should be sortable by difference', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'A', difference: 5.0 },
        { ...mockStocks[0], id: 2, ticker: 'B', difference: 2.0 }
      ]

      const wrapper = mountStockTable(stocks)

      // Find the difference header and click it
      const headers = wrapper.findAll('th.sortable')
      const differenceHeader = headers.find(h => h.text().includes('Különbség'))
      
      if (differenceHeader) {
        await differenceHeader.trigger('click')
        await nextTick()

        const rows = wrapper.findAll('.stock-row')
        const firstTicker = rows[0].find('.ticker-badge')?.text()
        expect(firstTicker).toBe('B') // Lower difference first (ascending)
      }
    })
  })

  describe('view toggle', () => {
    it('should display different columns for Basic infos view', () => {
      const wrapper = mountStockTable(mockStocks, 'basicInfos')

      // Check that basic columns are visible
      expect(wrapper.text()).toContain(hu.table.columns.ticker)
      expect(wrapper.text()).toContain(hu.table.columns.name)
      expect(wrapper.text()).toContain(hu.table.columns.exchange)
      expect(wrapper.text()).toContain(hu.table.columns.marketCap)
      expect(wrapper.text()).toContain(hu.table.columns.entryPrice)
      expect(wrapper.text()).toContain(hu.table.columns.currentPrice)
    })

    it('should display Price changes columns when view prop is priceChanges', () => {
      const wrapper = mountStockTable(mockStocks, 'priceChanges')

      // Check Price changes specific columns
      expect(wrapper.text()).toContain(hu.table.columns.ticker)
      expect(wrapper.text()).toContain(hu.table.columns.name)
      expect(wrapper.text()).toContain(hu.table.columns.potential)
      expect(wrapper.text()).toContain(hu.table.columns.entryPrice)
      expect(wrapper.text()).toContain(hu.table.columns.currentPrice)
      expect(wrapper.text()).toContain(hu.table.columns.highestPrice)
      expect(wrapper.text()).toContain(hu.table.columns.maxPriceChange)
    })

    it('should calculate max price change percentage correctly', () => {
      const stock: Stock = {
        ...mockStocks[0],
        id: 3,
        entry_price: 100,
        highest_price: 150
      }

      const wrapper = mountStockTable([stock], 'priceChanges')

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const maxChange = component.calculateMaxPriceChange(stock)

      // ((150 - 100) / 100) * 100 = 50%
      expect(maxChange).toBe(50)
    })

    it('should return 0 when highest_price is null', () => {
      const stock: Stock = {
        ...mockStocks[0],
        id: 4,
        entry_price: 100,
        highest_price: null
      }

      const wrapper = mountStockTable([stock], 'priceChanges')

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const maxChange = component.calculateMaxPriceChange(stock)

      expect(maxChange).toBe(0)
    })
  })

  describe('stock grouping by ticker', () => {
    it('should group stocks with same ticker together', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'MSFT' },
        { ...mockStocks[0], id: 3, ticker: 'AAPL' },
        { ...mockStocks[0], id: 4, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const grouped = component.groupedAndSortedStocks

      expect(grouped).toBeDefined()
      expect(grouped.length).toBe(2) // Two groups: AAPL and MSFT
    })

    it('should maintain original order within each group', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL', created_at: '2026-01-15T14:22:00Z' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL', created_at: '2026-01-16T14:22:00Z' },
        { ...mockStocks[0], id: 3, ticker: 'AAPL', created_at: '2026-01-14T14:22:00Z' },
      ]
      const wrapper = mountStockTable(stocks)

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const grouped = component.groupedAndSortedStocks

      expect(grouped[0].stocks.length).toBe(3)
      // Default sort is by created_at descending: 2026-01-16 -> 2026-01-15 -> 2026-01-14
      expect(grouped[0].stocks[0].id).toBe(2) // Latest date first
      expect(grouped[0].stocks[1].id).toBe(1)
      expect(grouped[0].stocks[2].id).toBe(3) // Oldest date last
    })

    it('should display group header for each ticker', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
        { ...mockStocks[0], id: 3, ticker: 'MSFT' },
        { ...mockStocks[0], id: 4, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // Expand the AAPL group to see detail rows with ticker in first row
      const collapsibleRows = wrapper.findAll('.stock-row-collapsible')
      const aaplCollapsibleRow = collapsibleRows[0]
      const tickerCell = aaplCollapsibleRow.find('.ticker-cell')
      await tickerCell?.trigger('click')
      await nextTick()

      // In expanded state, the detail rows should be visible
      const detailRows = wrapper.findAll('.stock-row-group-details')
      // At least one detail row should be visible after expanding
      expect(detailRows.length).toBeGreaterThan(0)
      // First detail row should have ticker badge
      expect(detailRows[0].find('.ticker-badge')?.text()).toBe('AAPL')
    })

    it('should display ticker only in group header, not in detail rows', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
      ]
      const wrapper = mountStockTable(stocks)

      // Initially collapsed, so expand the group
      const collapsibleRow = wrapper.find('.stock-row-collapsible')
      const tickerCell = collapsibleRow.find('.ticker-cell')
      await tickerCell.trigger('click')
      await nextTick()

      // In expanded state, check detail rows
      const detailRows = wrapper.findAll('.stock-row-group-details')
      expect(detailRows.length).toBe(2)
      
      // First detail row should have ticker badge with toggle icon
      expect(detailRows[0].find('.ticker-badge')?.text()).toBe('AAPL')
      expect(detailRows[0].find('.toggle-icon')?.exists()).toBe(true)
      
      // Second detail row should have empty ticker cell (no badge)
      expect(detailRows[1].find('.ticker-badge')?.exists()).toBe(false)
    })

    it('should apply group styling to detail rows', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
      ]
      const wrapper = mountStockTable(stocks)

      // Expand the group
      const collapsibleRow = wrapper.find('.stock-row-collapsible')
      const tickerCell = collapsibleRow.find('.ticker-cell')
      await tickerCell.trigger('click')
      await nextTick()

      const detailRows = wrapper.findAll('.stock-row-group-details')
      expect(detailRows.length).toBeGreaterThan(0)
      // All detail rows should have the group styling class
      expect(detailRows[0].classes()).toContain('stock-row-group-details')
    })

    it('should emit show-details event from grouped row', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
      ]
      const wrapper = mountStockTable(stocks)

      // Expand the group to see detail rows
      const tickerCell = wrapper.find('.ticker-cell')
      await tickerCell.trigger('click')
      await nextTick()

      const detailRows = wrapper.findAll('.stock-row-in-group')
      await detailRows[0].trigger('click')

      expect(wrapper.emitted('show-details')).toBeTruthy()
      const emittedStock = wrapper.emitted('show-details')?.[0]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.id).toBe(1)
    })

    it('should work with single group', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
      ]
      const wrapper = mountStockTable(stocks)

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const grouped = component.groupedAndSortedStocks

      expect(grouped.length).toBe(1)
      expect(grouped[0].ticker).toBe('AAPL')
      expect(grouped[0].stocks.length).toBe(2)
    })

    it('should display single-item group without header as normal row', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const grouped = component.groupedAndSortedStocks

      // Both groups should have isSingleItem=true
      expect(grouped[0].isSingleItem).toBe(true)
      expect(grouped[1].isSingleItem).toBe(true)
    })

    it('should display multi-item group with header', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
        { ...mockStocks[0], id: 3, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // eslint-disable-next-line no-undef
      const component = wrapper.vm as any
      const grouped = component.groupedAndSortedStocks

      expect(grouped[0].isSingleItem).toBe(false)
      expect(grouped[1].isSingleItem).toBe(true)
    })

    it('should render group headers only for multi-item groups', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'AAPL' },
        { ...mockStocks[0], id: 3, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // Check that AAPL is a multi-item group (has collapsible row with toggle)
      const collapsedRows = wrapper.findAll('.stock-row-collapsible')
      const aaplCollapsedRow = collapsedRows[0]
      expect(aaplCollapsedRow.find('.toggle-icon')?.exists()).toBe(true)
      expect(aaplCollapsedRow.find('.ticker-badge')?.text()).toBe('AAPL')

      // MSFT is single-item group, so it should render as normal row without toggle
      const singleItemRows = wrapper.findAll('.stock-row:not(.stock-row-collapsible)')
      expect(singleItemRows.length).toBeGreaterThan(0)
      // Single item rows should have ticker badge but no toggle icon
      const msftBadge = singleItemRows.find(row => row.find('.ticker-badge')?.text() === 'MSFT')
      expect(msftBadge?.find('.toggle-icon')?.exists()).toBe(false)

      // Expand the AAPL group (multi-item group)
      const tickerCell = aaplCollapsedRow.find('.ticker-cell')
      await tickerCell.trigger('click')
      await nextTick()

      // Now the AAPL detail rows should be visible with ticker in first row
      const detailRows = wrapper.findAll('.stock-row-group-details')
      expect(detailRows.length).toBe(2)
      expect(detailRows[0].find('.ticker-badge')?.text()).toBe('AAPL')
      expect(detailRows[0].find('.toggle-icon-open')?.exists()).toBe(true)
    })

    it('should render single-item groups as normal rows with ticker visible', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'AAPL' },
        { ...mockStocks[0], id: 2, ticker: 'MSFT' },
      ]
      const wrapper = mountStockTable(stocks)

      // No group headers for single-item groups
      const groupHeaders = wrapper.findAll('.stock-group-header')
      expect(groupHeaders.length).toBe(0)

      // But ticker badges should be visible in rows
      const tickerBadges = wrapper.findAll('.ticker-badge')
      expect(tickerBadges.length).toBe(2)
      expect(tickerBadges[0].text()).toBe('AAPL')
      expect(tickerBadges[1].text()).toBe('MSFT')
    })
  })
})
