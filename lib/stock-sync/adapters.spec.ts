import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import type { Stock } from '../../src/types/Stock'
import { FileSystemAdapter, GitCommandAdapter } from './adapters'
import { syncAndUpdateStocks } from './syncStockPrices'

describe('Adapters Integration', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `stock-test-${Date.now()}`)
    await fs.mkdir(tempDir, { recursive: true })
  })

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch (error) {
    }
  })

  describe('FileSystemAdapter', () => {
    it('should read and parse JSON file correctly', async () => {
      const testStocks: Stock[] = [
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
          notes: 'Test note',
          links: 'https://test.com',
          agent: 'Test',
          last_modified: '2026-02-13 10:00',
          created_at: '2026-02-13',
        },
      ]

      const filePath = path.join(tempDir, 'stocks.json')
      await fs.writeFile(filePath, JSON.stringify(testStocks, null, 2))

      const adapter = new FileSystemAdapter()
      const result = await adapter.read(filePath)

      expect(result).toEqual(testStocks)
    })

    it('should write stocks to file with proper formatting', async () => {
      const testStocks: Stock[] = [
        {
          id: 1,
          ticker: 'TEST1',
          name: 'Test Stock 1',
          yahoo_ticker: 'TEST1.DE',
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

      const filePath = path.join(tempDir, 'stocks.json')
      const adapter = new FileSystemAdapter()
      await adapter.write(filePath, testStocks)

      const fileContent = await fs.readFile(filePath, 'utf-8')
      const parsed = JSON.parse(fileContent)

      expect(parsed).toEqual(testStocks)
      expect(fileContent).toContain('  "ticker": "TEST1"')
    })

    it('should throw error when reading non-existent file', async () => {
      const filePath = path.join(tempDir, 'non-existent.json')
      const adapter = new FileSystemAdapter()

      await expect(adapter.read(filePath)).rejects.toThrow()
    })

    it('should throw error when reading invalid JSON', async () => {
      const filePath = path.join(tempDir, 'invalid.json')
      await fs.writeFile(filePath, 'not valid json {')

      const adapter = new FileSystemAdapter()
      await expect(adapter.read(filePath)).rejects.toThrow('Failed to parse JSON')
    })
  })

  describe('Full Synchronization Flow', () => {
    it('should write updated file after successful sync', async () => {
      const testStocks: Stock[] = [
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

      const filePath = path.join(tempDir, 'stocks.json')
      await fs.writeFile(filePath, JSON.stringify(testStocks))

      const mockYahoo = {
        quote: vi.fn().mockResolvedValue({ regularMarketPrice: 150 }),
      }

      const mockGitAdapter = {
        add: vi.fn().mockResolvedValue(undefined),
        commit: vi.fn().mockResolvedValue(undefined),
        push: vi.fn().mockResolvedValue(undefined),
      }

      const fileAdapter = new FileSystemAdapter()

      await syncAndUpdateStocks(mockYahoo, fileAdapter, mockGitAdapter, filePath)

      const updatedContent = await fs.readFile(filePath, 'utf-8')
      const updatedStocks = JSON.parse(updatedContent)

      expect(updatedStocks[0].current_price).toBe(150)
      expect(updatedStocks[0].difference).toBe(50)
      expect(updatedStocks[0].last_modified).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    })
  })
})
