import type { Stock } from '../../src/types/Stock'

export interface FileAdapter {
  read(filePath: string): Promise<Stock[]>
  write(filePath: string, stocks: Stock[]): Promise<void>
}

export interface GitAdapter {
  add(filePath: string): Promise<void>
  commit(message: string): Promise<void>
  push(): Promise<void>
}

interface YahooQuote {
  symbol?: string
  regularMarketPrice?: number
}

export interface SyncResult {
  updatedCount: number
  skippedCount: number
  errorCount: number
  hasChanges: boolean
  timestamp: string
}

export function calculatePriceDifference(entryPrice: number, currentPrice: number): number {
  if (typeof entryPrice !== 'number' || !isFinite(entryPrice)) {
    throw new Error('Entry price must be a valid number')
  }

  if (typeof currentPrice !== 'number' || !isFinite(currentPrice)) {
    throw new Error('Current price must be a valid number')
  }

  if (entryPrice === 0) {
    throw new Error('Entry price cannot be zero')
  }

  const difference = ((currentPrice - entryPrice) / entryPrice) * 100
  return Math.round(difference * 100) / 100
}

export function updateStockWithPrice(stock: Stock, newPrice: number): Stock {
  if (typeof newPrice !== 'number' || newPrice < 0) {
    throw new Error('Price must be positive')
  }

  const difference = calculatePriceDifference(stock.entry_price, newPrice)

  return {
    ...stock,
    current_price: newPrice,
    difference,
  }
}

export function updateStockTimestamp(stock: Stock): Stock {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}`

  return {
    ...stock,
    last_modified: timestamp,
  }
}

export function comparePrices(oldStocks: Stock[], newStocks: Stock[]): boolean {
  if (oldStocks.length !== newStocks.length) {
    return true
  }

  return oldStocks.some((oldStock, index) => {
    const newStock = newStocks[index]
    return (
      oldStock.current_price !== newStock.current_price ||
      oldStock.difference !== newStock.difference
    )
  })
}

export async function syncAndUpdateStocks(
  yahooFinance: { quote: (symbol: string) => Promise<YahooQuote> },
  fileAdapter: FileAdapter,
  gitAdapter: GitAdapter,
  filePath: string = './src/data/stocks.json'
): Promise<SyncResult> {
  const timestamp = new Date().toISOString()
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  // Read original stocks
  const originalStocks = await fileAdapter.read(filePath)
  let updatedStocks = [...originalStocks]

  // Fetch prices and update stocks
  for (let i = 0; i < updatedStocks.length; i++) {
    const stock = updatedStocks[i]

    if (!stock.yahoo_ticker || stock.yahoo_ticker.trim() === '') {
      skippedCount++
      continue
    }

    try {
      const quote = await yahooFinance.quote(stock.yahoo_ticker)

      if (quote.regularMarketPrice === null || quote.regularMarketPrice === undefined) {
        errorCount++
        continue
      }

      const priceUpdated = updateStockWithPrice(stock, quote.regularMarketPrice)
      const timestampUpdated = updateStockTimestamp(priceUpdated)

      updatedStocks[i] = timestampUpdated
      updatedCount++
    } catch (error) {
      errorCount++
      continue
    }
  }

  const hasChanges = comparePrices(originalStocks, updatedStocks)

  if (hasChanges) {
    await fileAdapter.write(filePath, updatedStocks)

    const commitTimestamp = new Date().toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    await gitAdapter.add(filePath)
    await gitAdapter.commit(`update data at ${commitTimestamp}`)
    await gitAdapter.push()
  }

  return {
    updatedCount,
    skippedCount,
    errorCount,
    hasChanges,
    timestamp,
  }
}
