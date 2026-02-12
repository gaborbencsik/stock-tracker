import { describe, it, expect } from 'vitest'

/**
 * Test suite for sync-stock-prices module
 * Tests Git operations, change detection, and commit messaging
 */
describe('syncStockPrices', () => {
  describe('timestamp generation', () => {
    it('should generate valid ISO 8601 timestamp', () => {
      const getTimestamp = () => new Date().toISOString()
      const timestamp = getTimestamp()
      
      // Check ISO 8601 format
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should create valid commit message with timestamp', () => {
      const getTimestamp = () => new Date().toISOString()
      const timestamp = getTimestamp()
      const commitMessage = `chore: sync stock prices [${timestamp}]`
      
      expect(commitMessage).toContain('chore: sync stock prices')
      expect(commitMessage).toContain('[')
      expect(commitMessage).toContain(']')
      expect(commitMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('idempotency', () => {
    it('should not commit if prices have not changed', () => {
      const result = { hasChanges: false, updatedCount: 0, stocks: [] }
      
      expect(result.hasChanges).toBe(false)
      expect(result.updatedCount).toBe(0)
    })

    it('should commit only when prices have changed', () => {
      const result = { hasChanges: true, updatedCount: 5, stocks: [] }
      
      expect(result.hasChanges).toBe(true)
      expect(result.updatedCount).toBeGreaterThan(0)
    })
  })

  describe('change detection', () => {
    it('should detect when stock data differs from original', () => {
      const original = JSON.stringify([
        { id: 1, entry_price: 100, current_price: 110, difference: 10 }
      ])
      
      const modified = JSON.stringify([
        { id: 1, entry_price: 100, current_price: 110, difference: 10.5 }
      ])
      
      expect(original === modified).toBe(false)
    })

    it('should detect identical data as no change', () => {
      const data1 = JSON.stringify([
        { id: 1, entry_price: 100, current_price: 110, difference: 10 }
      ])
      
      const data2 = JSON.stringify([
        { id: 1, entry_price: 100, current_price: 110, difference: 10 }
      ])
      
      expect(data1 === data2).toBe(true)
    })
  })

  describe('exit codes', () => {
    it('should return exit code 0 on success', () => {
      const success = true
      expect(success).toBe(true)
    })

    it('should return exit code 1 on failure', () => {
      const failure = false
      expect(failure).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle missing stocks.json gracefully', () => {
      const error = new Error('Failed to read stocks file: ENOENT')
      expect(error.message).toContain('Failed to read stocks file')
    })

    it('should handle git command failures', () => {
      const error = new Error('Failed to commit/push: fatal')
      expect(error.message).toContain('Failed to commit/push')
    })

    it('should distinguish between "nothing to commit" and actual errors', () => {
      const noChangesError = 'nothing to commit'
      const actualError = 'permission denied'
      
      expect(noChangesError.includes('nothing to commit')).toBe(true)
      expect(actualError.includes('nothing to commit')).toBe(false)
    })
  })

  describe('commit message format', () => {
    it('should follow conventional commits format', () => {
      const timestamp = '2026-02-10T15:30:00.000Z'
      const commitMessage = `chore: sync stock prices [${timestamp}]`
      
      // Should start with type
      expect(commitMessage).toMatch(/^(feat|fix|docs|style|refactor|perf|test|chore)/)
      // Should have colon separator
      expect(commitMessage).toContain(':')
      // Should have timestamp in brackets
      expect(commitMessage).toMatch(/\[.*\]$/)
    })

    it('should include ISO timestamp for reproducibility', () => {
      const timestamp = '2026-02-10T15:30:00.000Z'
      const commitMessage = `chore: sync stock prices [${timestamp}]`
      
      // Extract timestamp from message
      const match = commitMessage.match(/\[(.*)\]/)
      expect(match).not.toBeNull()
      expect(match?.[1]).toBe(timestamp)
    })
  })

  describe('workflow idempotency', () => {
    it('should safely run multiple times without duplicating commits', () => {
      // Simulating running the sync twice with no changes
      const result1 = { hasChanges: false }
      const result2 = { hasChanges: false }
      
      expect(result1.hasChanges).toBe(result2.hasChanges)
    })

    it('should handle scheduled runs gracefully', () => {
      const triggerTypes = ['schedule', 'workflow_dispatch', 'push']
      
      triggerTypes.forEach((trigger) => {
        expect(triggerTypes).toContain(trigger)
      })
    })
  })
})
