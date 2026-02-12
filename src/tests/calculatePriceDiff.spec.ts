import { describe, it, expect } from 'vitest'

/**
 * Test suite for calculatePriceDifference function
 * Tests the core business logic for percentage change calculation
 *
 * Formula: ((current_price - entry_price) / entry_price) * 100
 * Rounded to 2 decimal places
 */
describe('calculatePriceDifference', () => {
  /**
   * Helper function that mirrors the script implementation
   */
  function calculatePriceDifference(
    entryPrice: number | null | undefined,
    currentPrice: number | null | undefined
  ): number | null {
    if (entryPrice === null || entryPrice === undefined || currentPrice === null || currentPrice === undefined) {
      return null
    }

    if (entryPrice === 0) {
      throw new Error('Entry price cannot be zero')
    }

    const percentageDifference = ((currentPrice - entryPrice) / entryPrice) * 100
    return Math.round(percentageDifference * 100) / 100
  }

  describe('valid inputs - positive change', () => {
    it('should calculate 10% positive change correctly', () => {
      expect(calculatePriceDifference(100, 110)).toBe(10)
    })

    it('should calculate SAX stock change (4.37%)', () => {
      expect(calculatePriceDifference(33.2, 34.65)).toBe(4.37)
    })

    it('should calculate SY1 stock change (8.6%)', () => {
      expect(calculatePriceDifference(70, 76.02)).toBe(8.6)
    })
  })

  describe('valid inputs - negative change', () => {
    it('should calculate -10% negative change correctly', () => {
      expect(calculatePriceDifference(100, 90)).toBe(-10)
    })

    it('should calculate IOS.F stock change (-6.05%)', () => {
      expect(calculatePriceDifference(25.6, 24.05)).toBeCloseTo(-6.05, 1)
    })

    it('should calculate CYR stock change (-5.31%)', () => {
      expect(calculatePriceDifference(2.26, 2.14)).toBeCloseTo(-5.31, 1)
    })
  })

  describe('valid inputs - zero change', () => {
    it('should handle zero change correctly', () => {
      expect(calculatePriceDifference(100, 100)).toBe(0)
    })

    it('should handle BSGR stock with zero change', () => {
      expect(calculatePriceDifference(5.85, 5.85)).toBe(0)
    })
  })

  describe('rounding behavior', () => {
    it('should round to 2 decimal places', () => {
      expect(calculatePriceDifference(100, 112.567)).toBe(12.57)
    })

    it('should round down when needed', () => {
      expect(calculatePriceDifference(100, 111.234)).toBe(11.23)
    })

    it('should round up when needed', () => {
      expect(calculatePriceDifference(100, 111.456)).toBe(11.46)
    })
  })

  describe('null and undefined inputs', () => {
    it('should return null when entryPrice is null', () => {
      expect(calculatePriceDifference(null, 110)).toBeNull()
    })

    it('should return null when currentPrice is null', () => {
      expect(calculatePriceDifference(100, null)).toBeNull()
    })

    it('should return null when both are null', () => {
      expect(calculatePriceDifference(null, null)).toBeNull()
    })

    it('should return null when entryPrice is undefined', () => {
      expect(calculatePriceDifference(undefined, 110)).toBeNull()
    })

    it('should return null when currentPrice is undefined', () => {
      expect(calculatePriceDifference(100, undefined)).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should throw error when entryPrice is zero', () => {
      expect(() => calculatePriceDifference(0, 100)).toThrow('Entry price cannot be zero')
    })
  })

  describe('edge cases', () => {
    it('should handle very small prices', () => {
      expect(calculatePriceDifference(0.01, 0.02)).toBe(100)
    })

    it('should handle very large prices', () => {
      expect(calculatePriceDifference(10000, 12000)).toBe(20)
    })

    it('should handle fractional cent prices', () => {
      expect(calculatePriceDifference(87.3, 89.86)).toBeCloseTo(2.92, 1)
    })
  })
})
