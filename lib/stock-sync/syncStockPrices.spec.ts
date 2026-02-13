import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Stock } from '../../src/types/Stock'
import {
  calculatePriceDifference,
  updateStockWithPrice,
  updateStockTimestamp,
  comparePrices,
  syncAndUpdateStocks,
} from './syncStockPrices'

describe('syncStockPrices', () => {
  describe('calculatePriceDifference', () => {
    it('should calculate percentage difference correctly', () => {
      const difference = calculatePriceDifference(100, 150)
      expect(difference).toBe(50)
    })

    it('should round to 2 decimal places', () => {
      const difference = calculatePriceDifference(100, 123.456)
      expect(difference).toBe(23.46)
    })

    it('should handle negative differences', () => {
      const difference = calculatePriceDifference(100, 50)
      expect(difference).toBe(-50)
    })

    it('should throw error when entry price is zero', () => {
      expect(() => calculatePriceDifference(0, 100)).toThrow('Entry price cannot be zero')
    })

    it('should throw error when entry price is null', () => {
      expect(() => calculatePriceDifference(null as unknown as number, 100)).toThrow(
        'Entry price must be a valid number'
      )
    })

    it('should throw error when current price is null', () => {
      expect(() => calculatePriceDifference(100, null as unknown as number)).toThrow(
        'Current price must be a valid number'
      )
    })

    it('should return 0 when prices are equal', () => {
      const difference = calculatePriceDifference(100, 100)
      expect(difference).toBe(0)
    })
  })

  describe('updateStockWithPrice', () => {
    it('should update stock with new price and calculate difference', () => {
      const stock: Stock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        yahoo_ticker: 'TEST.DE',
        stock_exchange: 'Frankfurt',
        currency: 'EUR',
        market_cap: 'mid',
        entry_price: 100,
        current_price: 100,
        difference: 0,
        uplift_potential: 10,
        six_months_price_target: null,
        twelve_months_price_target: null,
        one_month_highest_price: null,
        two_months_highest_price: null,
        three_months_highest_price: null,
        six_months_highest_price: null,
        twelve_months_highest_price: null,
        highest_price: null,
        notes: '',
        links: '',
        agent: 'Test',
        last_modified: '2026-02-13 10:00',
        created_at: '2026-02-13',
      }

      const updatedStock = updateStockWithPrice(stock, 150)

      expect(updatedStock.current_price).toBe(150)
      expect(updatedStock.difference).toBe(50)
    })

    it('should throw error for invalid price', () => {
      const stock: Stock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        yahoo_ticker: 'TEST.DE',
        stock_exchange: 'Frankfurt',
        currency: 'EUR',
        market_cap: 'mid',
        entry_price: 100,
        current_price: 100,
        difference: 0,
        uplift_potential: 10,
        six_months_price_target: null,
        twelve_months_price_target: null,
        one_month_highest_price: null,
        two_months_highest_price: null,
        three_months_highest_price: null,
        six_months_highest_price: null,
        twelve_months_highest_price: null,
        highest_price: null,
        notes: '',
        links: '',
        agent: 'Test',
        last_modified: '2026-02-13 10:00',
        created_at: '2026-02-13',
      }

      expect(() => updateStockWithPrice(stock, -50)).toThrow('Price must be positive')
    })

    it('should preserve other stock fields', () => {
      const stock: Stock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        yahoo_ticker: 'TEST.DE',
        stock_exchange: 'Frankfurt',
        currency: 'EUR',
        market_cap: 'mid',
        entry_price: 100,
        current_price: 100,
        difference: 0,
        uplift_potential: 10,
        six_months_price_target: null,
        twelve_months_price_target: null,
        one_month_highest_price: null,
        two_months_highest_price: null,
        three_months_highest_price: null,
        six_months_highest_price: null,
        twelve_months_highest_price: null,
        highest_price: null,
        notes: 'Important note',
        links: 'https://example.com',
        agent: 'Test',
        last_modified: '2026-02-13 10:00',
        created_at: '2026-02-13',
      }

      const updatedStock = updateStockWithPrice(stock, 150)

      expect(updatedStock.id).toBe(stock.id)
      expect(updatedStock.ticker).toBe(stock.ticker)
      expect(updatedStock.notes).toBe('Important note')
      expect(updatedStock.links).toBe('https://example.com')
    })
  })

  describe('updateStockTimestamp', () => {
    it('should update last_modified with current timestamp', () => {
      const stock: Stock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        yahoo_ticker: 'TEST.DE',
        stock_exchange: 'Frankfurt',
        currency: 'EUR',
        market_cap: 'mid',
        entry_price: 100,
        current_price: 100,
        difference: 0,
        uplift_potential: 10,
        six_months_price_target: null,
        twelve_months_price_target: null,
        one_month_highest_price: null,
        two_months_highest_price: null,
        three_months_highest_price: null,
        six_months_highest_price: null,
        twelve_months_highest_price: null,
        highest_price: null,
        notes: '',
        links: '',
        agent: 'Test',
        last_modified: '2026-02-13 10:00',
        created_at: '2026-02-13',
      }

      const beforeUpdate = new Date()
      const updatedStock = updateStockTimestamp(stock)
      const afterUpdate = new Date()

      // Check format YYYY-MM-DD HH:mm
      expect(updatedStock.last_modified).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)

      // Parse and check it's between before and after
      const [datePart, timePart] = updatedStock.last_modified.split(' ')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hours, minutes] = timePart.split(':').map(Number)

      const parsedDate = new Date(year, month - 1, day, hours, minutes)
      expect(parsedDate.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime() - 60000) // Allow 1 minute margin
      expect(parsedDate.getTime()).toBeLessThanOrEqual(afterUpdate.getTime() + 60000)
    })

    it('should preserve other stock fields when updating timestamp', () => {
      const stock: Stock = {
        id: 1,
        ticker: 'TEST',
        name: 'Test Stock',
        yahoo_ticker: 'TEST.DE',
        stock_exchange: 'Frankfurt',
        currency: 'EUR',
        market_cap: 'mid',
        entry_price: 100,
        current_price: 150,
        difference: 50,
        uplift_potential: 10,
        six_months_price_target: null,
        twelve_months_price_target: null,
        one_month_highest_price: null,
        two_months_highest_price: null,
        three_months_highest_price: null,
        six_months_highest_price: null,
        twelve_months_highest_price: null,
        highest_price: null,
        notes: 'Note',
        links: 'Link',
        agent: 'Test',
        last_modified: '2026-02-13 10:00',
        created_at: '2026-02-13',
      }

      const updatedStock = updateStockTimestamp(stock)

      expect(updatedStock.current_price).toBe(150)
      expect(updatedStock.difference).toBe(50)
      expect(updatedStock.notes).toBe('Note')
    })
  })

  describe('comparePrices', () => {
    it('should return true if prices changed', () => {
      const oldStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST',
          name: 'Test Stock',
          yahoo_ticker: 'TEST.DE',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 100,
          difference: 0,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const newStocks: Stock[] = [
        {
          ...oldStocks[0],
          current_price: 150,
          difference: 50,
        },
      ]

      const hasChanged = comparePrices(oldStocks, newStocks)
      expect(hasChanged).toBe(true)
    })

    it('should return false if prices did not change', () => {
      const stocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST',
          name: 'Test Stock',
          yahoo_ticker: 'TEST.DE',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 100,
          difference: 0,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const hasChanged = comparePrices(stocks, stocks)
      expect(hasChanged).toBe(false)
    })

    it('should detect difference field changes', () => {
      const oldStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST',
          name: 'Test Stock',
          yahoo_ticker: 'TEST.DE',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 150,
          difference: 50,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const newStocks: Stock[] = [
        {
          ...oldStocks[0],
          difference: 51,
        },
      ]

      const hasChanged = comparePrices(oldStocks, newStocks)
      expect(hasChanged).toBe(true)
    })
  })

  describe('syncAndUpdateStocks', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should update all stocks with fetched prices', async () => {
      const mockStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST1',
          name: 'Test Stock 1',
          yahoo_ticker: 'TEST1.DE',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 100,
          difference: 0,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const mockQuote = vi.fn().mockResolvedValue({ regularMarketPrice: 150 })
      const mockFileAdapter = {
        read: vi.fn().mockResolvedValue(mockStocks),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const mockGitAdapter = {
        add: vi.fn().mockResolvedValue(undefined),
        commit: vi.fn().mockResolvedValue(undefined),
        push: vi.fn().mockResolvedValue(undefined),
      }

      const result = await syncAndUpdateStocks(
        { quote: mockQuote } as any,
        mockFileAdapter,
        mockGitAdapter
      )

      expect(result.updatedCount).toBe(1)
      expect(result.hasChanges).toBe(true)
      expect(mockQuote).toHaveBeenCalledWith('TEST1.DE')
    })

    it('should skip stocks with invalid yahoo_ticker', async () => {
      const mockStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST1',
          name: 'Test Stock 1',
          yahoo_ticker: '',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 100,
          difference: 0,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const mockQuote = vi.fn().mockResolvedValue({ regularMarketPrice: 150 })
      const mockFileAdapter = {
        read: vi.fn().mockResolvedValue(mockStocks),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const mockGitAdapter = {
        add: vi.fn().mockResolvedValue(undefined),
        commit: vi.fn().mockResolvedValue(undefined),
        push: vi.fn().mockResolvedValue(undefined),
      }

      const result = await syncAndUpdateStocks(
        { quote: mockQuote } as any,
        mockFileAdapter,
        mockGitAdapter
      )

      expect(result.skippedCount).toBe(1)
      expect(mockQuote).not.toHaveBeenCalled()
    })

    it('should handle fetch errors gracefully', async () => {
      const mockStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST1',
          name: 'Test Stock 1',
          yahoo_ticker: 'TEST1.DE',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 100,
          difference: 0,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const mockQuote = vi.fn().mockRejectedValue(new Error('Network error'))
      const mockFileAdapter = {
        read: vi.fn().mockResolvedValue(mockStocks),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const mockGitAdapter = {
        add: vi.fn().mockResolvedValue(undefined),
        commit: vi.fn().mockResolvedValue(undefined),
        push: vi.fn().mockResolvedValue(undefined),
      }

      const result = await syncAndUpdateStocks(
        { quote: mockQuote } as any,
        mockFileAdapter,
        mockGitAdapter
      )

      expect(result.errorCount).toBe(1)
      expect(result.hasChanges).toBe(false)
    })

    it('should not commit if no changes detected', async () => {
      const mockStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST1',
          name: 'Test Stock 1',
          yahoo_ticker: 'TEST1.DE',
          stock_exchange: 'Frankfurt',
          currency: 'EUR',
          market_cap: 'mid',
          entry_price: 100,
          current_price: 100,
          difference: 0,
          uplift_potential: 10,
          six_months_price_target: null,
          twelve_months_price_target: null,
          one_month_highest_price: null,
          two_months_highest_price: null,
          three_months_highest_price: null,
          six_months_highest_price: null,
          twelve_months_highest_price: null,
          highest_price: null,
          notes: '',
          links: '',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const mockQuote = vi.fn().mockResolvedValue({ regularMarketPrice: 100 })
      const mockFileAdapter = {
        read: vi.fn().mockResolvedValue(mockStocks),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const mockGitAdapter = {
        add: vi.fn().mockResolvedValue(undefined),
        commit: vi.fn().mockResolvedValue(undefined),
        push: vi.fn().mockResolvedValue(undefined),
      }

      const result = await syncAndUpdateStocks(
        { quote: mockQuote } as any,
        mockFileAdapter,
        mockGitAdapter
      )

      expect(result.hasChanges).toBe(false)
      expect(mockGitAdapter.commit).not.toHaveBeenCalled()
    })
  })
})
