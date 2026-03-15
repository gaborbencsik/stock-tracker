import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  extractUniqueTickers,
  buildTodayKey,
  mergePricesForDate,
  buildPriceRecord,
} from './fetch-daily-prices.js'

describe('fetch-daily-prices', () => {
  describe('extractUniqueTickers', () => {
    it('should extract unique yahoo_tickers from stocks', () => {
      const stocks = [
        { yahoo_ticker: 'IMCD.AS' },
        { yahoo_ticker: 'EDEN.PA' },
        { yahoo_ticker: 'IMCD.AS' },
      ]
      expect(extractUniqueTickers(stocks)).toEqual(['IMCD.AS', 'EDEN.PA'])
    })

    it('should skip stocks with empty yahoo_ticker', () => {
      const stocks = [{ yahoo_ticker: 'IMCD.AS' }, { yahoo_ticker: '' }, { yahoo_ticker: '   ' }]
      expect(extractUniqueTickers(stocks)).toEqual(['IMCD.AS'])
    })

    it('should skip stocks with missing yahoo_ticker', () => {
      const stocks = [{ yahoo_ticker: 'IMCD.AS' }, {}]
      expect(extractUniqueTickers(stocks)).toEqual(['IMCD.AS'])
    })

    it('should return empty array for empty input', () => {
      expect(extractUniqueTickers([])).toEqual([])
    })

    it('should return empty array when all tickers are missing', () => {
      const stocks = [{}, { yahoo_ticker: '' }]
      expect(extractUniqueTickers(stocks)).toEqual([])
    })
  })

  describe('buildTodayKey', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = new Date('2026-03-15T10:00:00Z')
      expect(buildTodayKey(date)).toBe('2026-03-15')
    })

    it('should zero-pad month and day', () => {
      const date = new Date('2026-01-05T10:00:00Z')
      expect(buildTodayKey(date)).toBe('2026-01-05')
    })
  })

  describe('mergePricesForDate', () => {
    it('should add new date entry to empty prices', () => {
      const existing = {}
      const result = mergePricesForDate(existing, '2026-03-15', { 'IMCD.AS': 86 })
      expect(result).toEqual({ '2026-03-15': { 'IMCD.AS': 86 } })
    })

    it('should preserve existing dates when adding a new date', () => {
      const existing = { '2026-03-14': { 'IMCD.AS': 84.5 } }
      const result = mergePricesForDate(existing, '2026-03-15', { 'IMCD.AS': 86 })
      expect(result).toEqual({
        '2026-03-14': { 'IMCD.AS': 84.5 },
        '2026-03-15': { 'IMCD.AS': 86 },
      })
    })

    it('should overwrite existing entries for the same date', () => {
      const existing = { '2026-03-15': { 'IMCD.AS': 84 } }
      const result = mergePricesForDate(existing, '2026-03-15', { 'IMCD.AS': 86, 'EDEN.PA': 18.32 })
      expect(result).toEqual({ '2026-03-15': { 'IMCD.AS': 86, 'EDEN.PA': 18.32 } })
    })

    it('should not mutate the original object', () => {
      const existing = { '2026-03-14': { 'IMCD.AS': 84 } }
      mergePricesForDate(existing, '2026-03-15', { 'IMCD.AS': 86 })
      expect(existing).toEqual({ '2026-03-14': { 'IMCD.AS': 84 } })
    })
  })

  describe('buildPriceRecord', () => {
    it('should map ticker fetch results to a price record', () => {
      const results = [
        { ticker: 'IMCD.AS', price: 86 },
        { ticker: 'EDEN.PA', price: 18.32 },
      ]
      expect(buildPriceRecord(results)).toEqual({ 'IMCD.AS': 86, 'EDEN.PA': 18.32 })
    })

    it('should exclude failed fetches (null price)', () => {
      const results = [
        { ticker: 'IMCD.AS', price: 86 },
        { ticker: 'BAD.XX', price: null },
      ]
      expect(buildPriceRecord(results)).toEqual({ 'IMCD.AS': 86 })
    })

    it('should return empty object when all fetches failed', () => {
      const results = [{ ticker: 'BAD.XX', price: null }]
      expect(buildPriceRecord(results)).toEqual({})
    })

    it('should return empty object for empty input', () => {
      expect(buildPriceRecord([])).toEqual({})
    })
  })
})
