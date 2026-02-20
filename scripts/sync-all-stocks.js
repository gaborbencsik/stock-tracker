#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import YahooFinance from 'yahoo-finance2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.dirname(__dirname)
const stocksPath = path.join(projectRoot, 'src/data/stocks.json')

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

function calculatePriceDifference(entryPrice, currentPrice) {
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

function getCurrentTimestamp() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

async function readStocksFile(filePath) {
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

async function writeStocksFile(filePath, stocks) {
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

async function fetchPrice(yahooTicker) {
  const quote = await yahooFinance.quote(yahooTicker)
  
  const price = quote?.regularMarketPrice
  
  if (typeof price !== 'number' || !isFinite(price) || price <= 0) {
    throw new Error(`Invalid or missing price for ${yahooTicker}`)
  }
  
  return price
}

function updateHighestPrice(stock, newPrice) {
  const shouldUpdateHighest = stock.highest_price === null || newPrice > stock.highest_price
  return shouldUpdateHighest ? newPrice : stock.highest_price
}

const GIT_NO_CHANGES_ERROR = 'nothing to commit'

function hasChanges(oldStocks, newStocks) {
  if (oldStocks.length !== newStocks.length) {
    return true
  }

  return oldStocks.some((oldStock, index) => {
    const newStock = newStocks[index]
    return (
      oldStock.current_price !== newStock.current_price ||
      oldStock.difference !== newStock.difference ||
      oldStock.highest_price !== newStock.highest_price
    )
  })
}

function commitAndPush(filePath, projectRoot) {
  try {
    const timestamp = new Date().toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    execSync(`git -C "${projectRoot}" add "${filePath}"`, { stdio: 'pipe' })
    execSync(`git -C "${projectRoot}" commit -m "update data at ${timestamp}"`, { stdio: 'pipe' })
    execSync(`git -C "${projectRoot}" push`, { stdio: 'pipe' })

    return true
  } catch (error) {
    if (error.message?.includes(GIT_NO_CHANGES_ERROR)) {
      return false
    }
    throw error
  }
}

async function syncStockPrices() {
  try {
    console.log('🔄 Starting stock price synchronization...')
    console.log(`📁 Stocks file: ${stocksPath}\n`)

    console.log('📖 Reading stocks.json...')
    const originalStocks = await readStocksFile(stocksPath)
    let updatedStocks = [...originalStocks]

    console.log(`📚 Found ${originalStocks.length} stocks\n`)

    let updatedCount = 0
    let skippedCount = 0

    for (let i = 0; i < updatedStocks.length; i++) {
      const stock = updatedStocks[i]

      if (!stock.yahoo_ticker || stock.yahoo_ticker.trim() === '') {
        console.log(`⏭️  Skipped: ${stock.ticker} (no yahoo_ticker)`)
        skippedCount++
        continue
      }

      const currentPrice = await fetchPrice(stock.yahoo_ticker)
      const difference = calculatePriceDifference(stock.entry_price, currentPrice)
      const highestPrice = updateHighestPrice(stock, currentPrice)

      updatedStocks[i] = {
        ...stock,
        current_price: currentPrice,
        difference,
        highest_price: highestPrice,
        last_modified: getCurrentTimestamp(),
      }

      console.log(`✅ Updated: ${stock.ticker} - ${stock.entry_price} → ${currentPrice} (${difference}%)`)
      updatedCount++
    }

    const changesDetected = hasChanges(originalStocks, updatedStocks)

    if (!changesDetected) {
      console.log('\nℹ️  No price changes detected. Skipping file write and git commit.')
      console.log('\n✅ Synchronization completed (no changes)!')
      return
    }

    console.log('\n💾 Writing updated stocks to file...')
    await writeStocksFile(stocksPath, updatedStocks)
    console.log('✅ File saved successfully')

    console.log('\n📤 Committing and pushing changes...')
    const pushSuccess = commitAndPush(stocksPath, projectRoot)

    if (pushSuccess) {
      console.log('✅ Changes committed and pushed')
    } else {
      console.log('ℹ️  No changes to commit')
    }

    console.log('\n📊 Synchronization Results:')
    console.log(`✅ Updated:  ${updatedCount} stocks`)
    console.log(`⏭️  Skipped:  ${skippedCount} stocks`)
    console.log('\n✨ Stock synchronization completed successfully!')
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    if (process.env.DEBUG) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Run the synchronization
syncStockPrices().catch((error) => {
  console.error('❌ Unhandled error:', error.message)
  process.exit(1)
})
