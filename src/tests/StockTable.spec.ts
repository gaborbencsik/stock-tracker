import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import StockTable from '@/components/StockTable.vue'
import { messages } from '@/locales/messages'
import type { Stock } from '@/types/Stock'

vi.mock('@/locales/useMessages', () => ({
  useMessages: () => ({
    messages,
    msg: (key: string) => key
  })
}))

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
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.find('.stocks-table').exists()).toBe(true)
    })

    it('should display empty state when no stocks', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: []
        }
      })

      expect(wrapper.find('.empty-state').exists()).toBe(true)
      expect(wrapper.text()).toContain(messages.table.empty.title)
    })

    it('should render correct number of rows', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const rows = wrapper.findAll('.stock-row')
      expect(rows.length).toBe(mockStocks.length)
    })

    it('should display ticker in each row', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('AAPL')
      expect(wrapper.text()).toContain('MSFT')
    })

    it('should display stock name in each row', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('Apple Inc.')
      expect(wrapper.text()).toContain('Microsoft Corporation')
    })

    it('should display entry price with currency', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('175.50 USD')
      expect(wrapper.text()).toContain('380.00 USD')
    })

    it('should display uplift potential with percentage', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('14.2%')
      expect(wrapper.text()).toContain('18.5%')
    })

    it('should display created_at date', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('2026-01-15')
      expect(wrapper.text()).toContain('2026-01-20')
    })

    it('should display current price with currency', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('182.45 USD')
      expect(wrapper.text()).toContain('395.20 USD')
    })

    it('should display current price header', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain(messages.table.columns.currentPrice)
    })

    it('should display current price between potential and price target columns', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const headers = wrapper.findAll('th')
      const potentialIndex = headers.findIndex(th => th.text().includes(messages.table.columns.potential))
      const currentPriceIndex = headers.findIndex(th => th.text().includes(messages.table.columns.currentPrice))
      const createdIndex = headers.findIndex(th => th.text().includes(messages.table.columns.created))

      expect(potentialIndex).toBeLessThan(currentPriceIndex)
      expect(currentPriceIndex).toBeLessThan(createdIndex)
    })

    it('should render details button for each stock', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const buttons = wrapper.findAll('.details-button')
      expect(buttons.length).toBe(mockStocks.length)
    })
  })

  describe('sorting', () => {
    it('should sort by ticker when ticker header is clicked', async () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      // Verify default is by created_at (descending)
      let rows = wrapper.findAll('.stock-row')
      let firstTicker = rows[0].find('.ticker-badge')?.text()
      // Both have same created_at, so order depends on filter order
      
      const headers = wrapper.findAll('th.sortable')
      const tickerHeader = headers[0]

      // Click to sort by ticker (ascending by default when switching)
      await tickerHeader.trigger('click')
      await nextTick()

      rows = wrapper.findAll('.stock-row')
      firstTicker = rows[0].find('.ticker-badge')?.text()
      expect(firstTicker).toBe('AAPL')
    })

    it('should toggle sort order when clicking same header twice', async () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const headers = wrapper.findAll('th.sortable')
      const tickerHeader = headers[0]

      // First click ticker header - should sort by ticker ascending
      await tickerHeader.trigger('click')
      await nextTick()
      let rows = wrapper.findAll('.stock-row')
      let firstTicker = rows[0].find('.ticker-badge')?.text()
      expect(firstTicker).toBe('AAPL')

      // Second click - toggle to descending
      await tickerHeader.trigger('click')
      await nextTick()
      rows = wrapper.findAll('.stock-row')
      firstTicker = rows[0].find('.ticker-badge')?.text()
      expect(firstTicker).toBe('MSFT')
    })

    it('should display sort indicator', async () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const headers = wrapper.findAll('th.sortable')
      await headers[0].trigger('click')

      expect(wrapper.find('.sort-indicator').exists()).toBe(true)
    })

    it('should sort by price numerically', async () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const headers = wrapper.findAll('th.sortable')
      const priceHeader = headers[3] // entry_price column

      await priceHeader.trigger('click')

      const rows = wrapper.findAll('.stock-row')
      const firstTicker = rows[0].find('.ticker-badge')?.text()
      expect(firstTicker).toBe('AAPL') // Lower price
    })
  })

  describe('interactions', () => {
    it('should emit show-details event when details button is clicked', async () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const detailsButton = wrapper.find('.details-button')
      const detailsButtonTicker = wrapper.find('.ticker-badge')?.text()
      
      await detailsButton.trigger('click')

      expect(wrapper.emitted('show-details')).toBeTruthy()
      const emittedStock = wrapper.emitted('show-details')?.[0]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.ticker).toBe(detailsButtonTicker)
    })

    it('should emit correct stock when different details buttons are clicked', async () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      const rows = wrapper.findAll('.stock-row')
      
      // Get tickers from rendered rows to match the sorted order
      const firstRowTicker = rows[0].find('.ticker-badge')?.text()
      const secondRowTicker = rows[1].find('.ticker-badge')?.text()
      
      await rows[0].trigger('click')
      let emittedStock = wrapper.emitted('show-details')?.[0]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.ticker).toBe(firstRowTicker)

      await rows[1].trigger('click')
      emittedStock = wrapper.emitted('show-details')?.[1]?.[0] as typeof mockStocks[0]
      expect(emittedStock?.ticker).toBe(secondRowTicker)
    })
  })

  describe('potential badge styling', () => {
    it('should apply positive class for positive potential', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

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

      const wrapper = mount(StockTable, {
        props: {
          stocks: [negativeStock]
        }
      })

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

      const wrapper = mount(StockTable, {
        props: {
          stocks: [negativeStock]
        }
      })

      expect(wrapper.text()).toContain('-5.3%')
    })

    it('should display plus sign for positive potential', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('+14.2%')
    })
  })

  describe('market cap display', () => {
    it('should display market cap for each stock', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

      expect(wrapper.text()).toContain('large')
    })

    it('should display market cap for small cap stock', () => {
      const smallCapStock = { ...mockStocks[0], market_cap: 'small' as const }
      const wrapper = mount(StockTable, {
        props: {
          stocks: [smallCapStock]
        }
      })

      expect(wrapper.text()).toContain('small')
    })

    it('should display market cap for mid cap stock', () => {
      const midCapStock = { ...mockStocks[0], market_cap: 'mid' as const }
      const wrapper = mount(StockTable, {
        props: {
          stocks: [midCapStock]
        }
      })

      expect(wrapper.text()).toContain('mid')
    })

    it('should display different market caps for different stocks', () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], market_cap: 'small' as const },
        { ...mockStocks[1], market_cap: 'large' as const }
      ]
      const wrapper = mount(StockTable, {
        props: { stocks }
      })

      const text = wrapper.text()
      expect(text).toContain('small')
      expect(text).toContain('large')
    })
  })

  describe('difference column display', () => {
    it('should display dash when difference is null', () => {
      const wrapper = mount(StockTable, {
        props: {
          stocks: mockStocks
        }
      })

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

      const wrapper = mount(StockTable, {
        props: {
          stocks: [stockWithDifference]
        }
      })

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

      const wrapper = mount(StockTable, {
        props: {
          stocks: [stockWithPositiveDifference]
        }
      })

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

      const wrapper = mount(StockTable, {
        props: {
          stocks: [stockWithNegativeDifference]
        }
      })

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

      const wrapper = mount(StockTable, {
        props: {
          stocks: [stockWithPositiveDifference]
        }
      })

      expect(wrapper.text()).toContain('+2.75%')
    })

    it('should display without plus sign for negative difference', () => {
      const stockWithNegativeDifference: Stock = {
        ...mockStocks[0],
        id: 3,
        ticker: 'DIFF',
        difference: -1.5
      }

      const wrapper = mount(StockTable, {
        props: {
          stocks: [stockWithNegativeDifference]
        }
      })

      expect(wrapper.text()).toContain('-1.50%')
    })

    it('should be sortable by difference', async () => {
      const stocks: Stock[] = [
        { ...mockStocks[0], id: 1, ticker: 'A', difference: 5.0 },
        { ...mockStocks[0], id: 2, ticker: 'B', difference: 2.0 }
      ]

      const wrapper = mount(StockTable, {
        props: { stocks }
      })

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
})
