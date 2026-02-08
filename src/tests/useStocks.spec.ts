import { describe, it, expect, beforeEach } from 'vitest'
import { useStocks } from '@/composables/useStocks'

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
    })
  })

  describe('filters', () => {
    beforeEach(async () => {
      await stocksComposable.loadStocks()
    })

    it('should filter stocks by search term (ticker)', () => {
      stocksComposable.filters.value.search = 'AAPL'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(s => s.ticker.includes('AAPL'))).toBe(true)
    })

    it('should filter stocks by search term (name)', () => {
      stocksComposable.filters.value.search = 'Apple'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.some(s => s.name.includes('Apple'))).toBe(true)
    })

    it('should filter stocks by exchange', () => {
      stocksComposable.filters.value.exchange = 'NASDAQ'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.stock_exchange === 'NASDAQ')).toBe(true)
    })

    it('should filter stocks by currency', () => {
      stocksComposable.filters.value.currency = 'USD'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.currency === 'USD')).toBe(true)
    })

    it('should filter stocks by minimum price', () => {
      stocksComposable.filters.value.minPrice = 200
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.entry_price >= 200)).toBe(true)
    })

    it('should filter stocks by maximum price', () => {
      stocksComposable.filters.value.maxPrice = 300
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.entry_price <= 300)).toBe(true)
    })

    it('should filter stocks by minimum potential', () => {
      stocksComposable.filters.value.minPotential = 15
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.uplift_potential >= 15)).toBe(true)
    })

    it('should filter stocks by maximum potential', () => {
      stocksComposable.filters.value.maxPotential = 20
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => s.uplift_potential <= 20)).toBe(true)
    })

    it('should combine multiple filters', () => {
      stocksComposable.filters.value.exchange = 'NASDAQ'
      stocksComposable.filters.value.minPotential = 10
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.every(s => 
        s.stock_exchange === 'NASDAQ' && s.uplift_potential >= 10
      )).toBe(true)
    })

    it('should return empty array when no stocks match filters', () => {
      stocksComposable.filters.value.search = 'NONEXISTENT'
      
      const filtered = stocksComposable.filteredStocks.value
      
      expect(filtered.length).toBe(0)
    })
  })

  describe('exchanges and currencies', () => {
    beforeEach(async () => {
      await stocksComposable.loadStocks()
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
    beforeEach(async () => {
      await stocksComposable.loadStocks()
    })

    it('should reset all filters to default values', () => {
      // Set some filters
      stocksComposable.filters.value.search = 'AAPL'
      stocksComposable.filters.value.exchange = 'NASDAQ'
      stocksComposable.filters.value.minPrice = 100
      
      // Reset
      stocksComposable.resetFilters()
      
      expect(stocksComposable.filters.value.search).toBe('')
      expect(stocksComposable.filters.value.exchange).toBe('')
      expect(stocksComposable.filters.value.currency).toBe('')
      expect(stocksComposable.filters.value.minPrice).toBe(null)
      expect(stocksComposable.filters.value.maxPrice).toBe(null)
      expect(stocksComposable.filters.value.minPotential).toBe(null)
      expect(stocksComposable.filters.value.maxPotential).toBe(null)
    })

    it('should show all stocks after reset', () => {
      stocksComposable.filters.value.search = 'AAPL'
      
      const filteredBefore = stocksComposable.filteredStocks.value.length
      
      stocksComposable.resetFilters()
      
      const filteredAfter = stocksComposable.filteredStocks.value.length
      
      expect(filteredAfter).toBeGreaterThanOrEqual(filteredBefore)
      expect(filteredAfter).toBe(stocksComposable.stocks.value.length)
    })
  })
})
