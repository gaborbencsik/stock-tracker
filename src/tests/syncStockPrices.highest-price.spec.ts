import { describe, it, expect } from 'vitest'

/**
 * Test suite for highest price update logic in stock synchronization
 * Validates that highest_price is updated when current_price exceeds it
 */

interface Stock {
  ticker: string
  entry_price: number
  current_price: number
  highest_price: number | null
  difference: number
}

function updateHighestPrice(stock: Stock, newCurrentPrice: number): Stock {
  const shouldUpdateHighest =
    stock.highest_price === null || newCurrentPrice > stock.highest_price

  return {
    ...stock,
    current_price: newCurrentPrice,
    highest_price: shouldUpdateHighest ? newCurrentPrice : stock.highest_price,
  }
}

describe('highest_price update logic', () => {
  describe('when highest_price is null', () => {
    it('should set highest_price to current_price', () => {
      const stock: Stock = {
        ticker: 'TEST',
        entry_price: 100,
        current_price: 110,
        highest_price: null,
        difference: 10,
      }

      const updated = updateHighestPrice(stock, 120)

      expect(updated.highest_price).toBe(120)
      expect(updated.current_price).toBe(120)
    })
  })

  describe('when current_price exceeds highest_price', () => {
    it('should update highest_price to new current_price', () => {
      const stock: Stock = {
        ticker: 'TEST',
        entry_price: 100,
        current_price: 115,
        highest_price: 110,
        difference: 15,
      }

      const updated = updateHighestPrice(stock, 125)

      expect(updated.highest_price).toBe(125)
      expect(updated.current_price).toBe(125)
    })
  })

  describe('when current_price is lower than highest_price', () => {
    it('should keep highest_price unchanged', () => {
      const stock: Stock = {
        ticker: 'TEST',
        entry_price: 100,
        current_price: 105,
        highest_price: 120,
        difference: 5,
      }

      const updated = updateHighestPrice(stock, 110)

      expect(updated.highest_price).toBe(120)
      expect(updated.current_price).toBe(110)
    })
  })

  describe('when current_price equals highest_price', () => {
    it('should keep highest_price unchanged', () => {
      const stock: Stock = {
        ticker: 'TEST',
        entry_price: 100,
        current_price: 100,
        highest_price: 111,
        difference: 0,
      }

      const updated = updateHighestPrice(stock, 111)

      expect(updated.highest_price).toBe(111)
      expect(updated.current_price).toBe(111)
    })
  })
})
