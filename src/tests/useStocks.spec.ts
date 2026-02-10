import { describe, it, expect, beforeEach } from 'vitest'
import { useStocks } from '@/composables/useStocks'
import type { Stock } from '@/types/Stock'

const mockStocks: Stock[] = [
  {
    id: 1,
    ticker: 'SAX',
    name: 'Ströer SE & Co. KGaA',
    stock_exchange: 'Frankfurt (XETRA)',
    currency: 'EUR',
    market_cap: 'mid',
    entry_price: 33.2,
    current_price: null,
    uplift_potential: 69.7,
    six_months_price_target: null,
    twelve_months_price_target: 56.26,
    one_month_highest_price: null,
    two_months_highest_price: null,
    three_months_highest_price: null,
    six_months_highest_price: null,
    twelve_months_highest_price: null,
    highest_price: null,
    notes: 'Test stock 1',
    links: 'https://example.com',
    agent: 'OpenAI',
    last_modified: '2026-02-08',
    difference: null,
    created_at: '2026-02-08'
  },
  {
    id: 2,
    ticker: 'IMCD',
    name: 'IMCD N.V.',
    stock_exchange: 'Euronext Amsterdam',
    currency: 'EUR',
    market_cap: 'mid',
    entry_price: 87.3,
    current_price: null,
    uplift_potential: 29.9,
    six_months_price_target: null,
    twelve_months_price_target: 113.43,
    one_month_highest_price: null,
    two_months_highest_price: null,
    three_months_highest_price: null,
    six_months_highest_price: null,
    twelve_months_highest_price: null,
    highest_price: null,
    notes: 'Test stock 2',
    links: 'https://example.com',
    agent: 'OpenAI',
    last_modified: '2026-02-08',
    difference: null,
    created_at: '2026-02-08'
  },
  {
    id: 3,
    ticker: 'ARCAD',
    name: 'Arcadis N.V.',
    stock_exchange: 'Euronext Amsterdam',
    currency: 'EUR',
    market_cap: 'mid',
    entry_price: 37.5,
    current_price: null,
    uplift_potential: 45.0,
    six_months_price_target: null,
    twelve_months_price_target: 54.5,
    one_month_highest_price: null,
    two_months_highest_price: null,
    three_months_highest_price: null,
    six_months_highest_price: null,
    twelve_months_highest_price: null,
    highest_price: null,
    notes: 'Test stock 3',
    links: 'https://example.com',
    agent: 'Gemini',
    last_modified: '2026-02-08',
    difference: null,
    created_at: '2026-02-08'
  }
]

describe('useStocks', () => {
  let stocksComposable: ReturnType<typeof useStocks>

  beforeEach(() => {
    stocksComposable = useStocks()
  })

  describe('loadStocks', () => {
    it('should load stocks from JSON', async () => {
      await stocksComposable.loadStocks()
      
      expect(stocksComposable.stocks.value.length).toBeGreaterThan(0)
      expect(stocksComposable.loading.value).toBe(false)
      expect(stocksComposable.error.value).toBe(null)
    })

    it('should set loading state during load', async () => {
      const loadPromise = stocksComposable.loadStocks()
      
      // Check if loading is true immediately
      expect(stocksComposable.loading.value).toBe(true)
      
      await loadPromise
      
      expect(stocksComposable.loading.value).toBe(false)
    })

    it('should load stocks with correct structure', async () => {
      await stocksComposable.loadStocks()
      
      const firstStock = stocksComposable.stocks.value[0]
      
      expect(firstStock).toHaveProperty('id')
      expect(firstStock).toHaveProperty('ticker')
      expect(firstStock).toHaveProperty('name')
      expect(firstStock).toHaveProperty('stock_exchange')
      expect(firstStock).toHaveProperty('currency')
      expect(firstStock).toHaveProperty('entry_price')
      expect(firstStock).toHaveProperty('uplift_potential')
      expect(firstStock).toHaveProperty('market_cap')
    })
  })

  describe('filters', () => {
    beforeEach(() => {
      stocksComposable.stocks.value = mockStocks
    })

    it('should filter stocks by search term (ticker)', () => {
      stocksComposable.filters.value.search = 'SAX'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(s => s.ticker.includes('SAX'))).toBe(true)
    })

    it('should filter stocks by search term (name)', () => {
      stocksComposable.filters.value.search = 'Ströer'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.some(s => s.name.includes('Ströer'))).toBe(true)
    })

    it('should filter stocks by exchange', () => {
      stocksComposable.filters.value.exchange = 'Frankfurt (XETRA)'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.stock_exchange === 'Frankfurt (XETRA)')).toBe(true)
    })

    it('should filter stocks by currency', () => {
      stocksComposable.filters.value.currency = 'EUR'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.currency === 'EUR')).toBe(true)
    })

    it('should filter stocks by minimum price', () => {
      stocksComposable.filters.value.minPrice = 50
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.entry_price >= 50)).toBe(true)
    })

    it('should filter stocks by maximum price', () => {
      stocksComposable.filters.value.maxPrice = 80
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.entry_price <= 80)).toBe(true)
    })

    it('should filter stocks by minimum potential', () => {
      stocksComposable.filters.value.minPotential = 30
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.uplift_potential >= 30)).toBe(true)
    })

    it('should filter stocks by maximum potential', () => {
      stocksComposable.filters.value.maxPotential = 50
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.uplift_potential <= 50)).toBe(true)
    })

    it('should combine multiple filters', () => {
      stocksComposable.filters.value.exchange = 'Frankfurt (XETRA)'
      stocksComposable.filters.value.minPotential = 30
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => 
        s.stock_exchange === 'Frankfurt (XETRA)' && s.uplift_potential >= 30
      )).toBe(true)
    })

    it('should return empty array when no stocks match filters', () => {
      stocksComposable.filters.value.search = 'NONEXISTENT'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBe(0)
    })

    it('should filter stocks by market cap', () => {
      stocksComposable.filters.value.marketCaps = ['mid']
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(s => s.market_cap === 'mid')).toBe(true)
    })

    it('should filter stocks by multiple market caps', () => {
      stocksComposable.filters.value.marketCaps = ['small', 'large']
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => 
        s.market_cap === 'small' || s.market_cap === 'large'
      )).toBe(true)
    })

    it('should return all stocks when no market cap filter applied', () => {
      stocksComposable.filters.value.marketCaps = []
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBe(mockStocks.length)
    })
  })

  describe('exchanges and currencies', () => {
    beforeEach(() => {
      stocksComposable.stocks.value = mockStocks
    })

    it('should return unique exchanges', () => {
      const exchanges = stocksComposable.exchanges.value
      
      expect(exchanges.length).toBeGreaterThan(0)
      expect(new Set(exchanges).size).toBe(exchanges.length)
    })

    it('should return unique currencies', () => {
      const currencies = stocksComposable.currencies.value
      
      expect(currencies.length).toBeGreaterThan(0)
      expect(new Set(currencies).size).toBe(currencies.length)
    })

    it('should sort exchanges alphabetically', () => {
      const exchanges = stocksComposable.exchanges.value
      const sorted = [...exchanges].sort()
      
      expect(exchanges).toEqual(sorted)
    })

    it('should sort currencies alphabetically', () => {
      const currencies = stocksComposable.currencies.value
      const sorted = [...currencies].sort()
      
      expect(currencies).toEqual(sorted)
    })
  })

  describe('resetFilters', () => {
    beforeEach(() => {
      stocksComposable.stocks.value = mockStocks
    })

    it('should reset all filters to default values', () => {
      // Set some filters
      stocksComposable.filters.value.search = 'SAX'
      stocksComposable.filters.value.exchange = 'Frankfurt (XETRA)'
      stocksComposable.filters.value.minPrice = 50
      
      // Reset
      stocksComposable.resetFilters()
      
      expect(stocksComposable.filters.value.search).toBe('')
      expect(stocksComposable.filters.value.exchange).toBe('')
      expect(stocksComposable.filters.value.currency).toBe('')
      expect(stocksComposable.filters.value.minPrice).toBe(null)
      expect(stocksComposable.filters.value.maxPrice).toBe(null)
      expect(stocksComposable.filters.value.minPotential).toBe(null)
      expect(stocksComposable.filters.value.maxPotential).toBe(null)
      expect(stocksComposable.filters.value.marketCaps).toEqual([])
    })

    it('should show all stocks after reset', () => {
      stocksComposable.filters.value.search = 'SAX'
      
      const filteredBefore = stocksComposable.filteredStocks.value.length
      
      stocksComposable.resetFilters()
      
      const filteredAfter = stocksComposable.filteredStocks.value.length
      
      expect(filteredAfter).toBeGreaterThanOrEqual(filteredBefore)
      expect(filteredAfter).toBe(stocksComposable.stocks.value.length)
    })
  })
})
