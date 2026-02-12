import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stocksPath = path.join(__dirname, '../src/data/stocks.json')

/**
 * Calculates the percentage difference between current_price and entry_price.
 * Formula: ((current_price - entry_price) / entry_price) * 100
 *
 * @param {number | null | undefined} entryPrice - The initial price
 * @param {number | null | undefined} currentPrice - The current price
 * @returns {number | null} Percentage difference rounded to 2 decimal places, or null if prices are missing
 * @throws {Error} If entry price is zero
 */
export function calculatePriceDifference(entryPrice, currentPrice) {
    console.debug(`Calculating difference: entryPrice=${entryPrice}, currentPrice=${currentPrice}`)
  if (entryPrice === null || entryPrice === undefined || currentPrice === null || currentPrice === undefined) {
    return null
  }

  if (entryPrice === 0) {
    throw new Error('Entry price cannot be zero')
  }

  const percentageDifference = ((currentPrice - entryPrice) / entryPrice) * 100
  // Round to 2 decimal places
  return Math.round(percentageDifference * 100) / 100
}

/**
 * Reads stocks from JSON file
 *
 * @param {string} filePath - Path to stocks JSON file
 * @returns {Promise<Array>} Stocks array
 */
export async function readStocksFile(filePath = stocksPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(new Error(`Failed to read stocks file: ${err.message}`))
        return
      }

      try {
        const stocks = JSON.parse(data)
        resolve(stocks)
      } catch (parseErr) {
        reject(new Error(`Failed to parse JSON: ${parseErr.message}`))
      }
    })
  })
}

/**
 * Writes updated stocks to JSON file
 *
 * @param {Array} stocks - Updated stocks array
 * @param {string} filePath - Path to write to
 * @returns {Promise<void>} Promise that resolves when file is written
 */
export async function writeStocksFile(stocks, filePath = stocksPath) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(stocks, null, 2)
    fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
      if (err) {
        reject(new Error(`Failed to write stocks file: ${err.message}`))
        return
      }
      resolve()
    })
  })
}

/**
 * Main function to update stocks.json with difference values
 *
 * @param {string} filePath - Path to stocks.json file
 * @param {boolean} verbose - Whether to print debug information
 * @returns {Promise<Object>} Result object with updatedCount and hasChanges flag
 */
export async function updateStocksDifference(filePath = stocksPath, verbose = true) {
  try {
    if (verbose) console.log('📖 Reading stocks.json...')
    const stocks = await readStocksFile(filePath)

    if (!Array.isArray(stocks)) {
      throw new Error('Stocks data must be an array')
    }

    let updatedCount = 0
    const originalJSON = JSON.stringify(stocks)
    
    const updatedStocks = stocks.map((stock) => {
      try {
        console.log(stock.yahoo_ticker, stock.entry_price, stock.current_price)
        const difference = calculatePriceDifference(stock.entry_price, stock.current_price)

        if (difference !== null) {
          stock.difference = difference
          updatedCount++
        }
      } catch (error) {
        if (verbose) console.warn(`⚠️  Skipping stock ${stock.ticker}: ${error.message}`)
      }

      return stock
    })

    const hasChanges = originalJSON !== JSON.stringify(updatedStocks)

    if (hasChanges) {
      if (verbose) console.log('💾 Writing updated stocks.json...')
      await writeStocksFile(updatedStocks, filePath)
    }

    if (verbose) {
      console.log(`✅ Successfully updated ${updatedCount}/${stocks.length} stocks with difference values`)
      if (hasChanges) {
        console.log(`📁 File saved: ${filePath}`)
      } else {
        console.log('ℹ️  No changes detected')
      }
    }

    return { updatedCount, hasChanges, stocks: updatedStocks }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    throw error
  }
}

// CLI: Run the script when called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateStocksDifference()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
