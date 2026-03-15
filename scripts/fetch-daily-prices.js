#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YahooFinance from 'yahoo-finance2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.dirname(__dirname)
const stocksPath = path.join(projectRoot, 'src/data/stocks.json')
const pricesPath = path.join(projectRoot, 'src/data/prices.json')

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

export function extractUniqueTickers(stocks) {
  const seen = new Set()
  for (const stock of stocks) {
    const ticker = stock.yahoo_ticker?.trim()
    if (ticker) {
      seen.add(ticker)
    }
  }
  return Array.from(seen)
}

export function buildTodayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function mergePricesForDate(existing, dateKey, newPrices) {
  return { ...existing, [dateKey]: newPrices }
}

export function buildPriceRecord(results) {
  return results.reduce((acc, { ticker, price }) => {
    if (price !== null) {
      acc[ticker] = price
    }
    return acc
  }, {})
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null
    }
    throw new Error(`Failed to read ${filePath}: ${error.message}`)
  }
}

async function writeJsonFile(filePath, data) {
  const dir = path.dirname(filePath)
  await fs.promises.mkdir(dir, { recursive: true })
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function fetchTickerPrice(ticker) {
  try {
    const quote = await yahooFinance.quote(ticker)
    const price = quote?.regularMarketPrice

    if (typeof price !== 'number' || !isFinite(price) || price <= 0) {
      console.warn(`  Warning: Invalid price for ${ticker}, skipping.`)
      return { ticker, price: null }
    }

    return { ticker, price }
  } catch (error) {
    console.warn(`  Warning: Failed to fetch price for ${ticker}: ${error.message}`)
    return { ticker, price: null }
  }
}

async function fetchDailyPrices() {
  try {
    console.log('Reading stocks.json...')
    const stocks = await readJsonFile(stocksPath)
    if (!Array.isArray(stocks)) {
      throw new Error('stocks.json must contain an array')
    }

    const tickers = extractUniqueTickers(stocks)
    console.log(`Found ${tickers.length} unique ticker(s): ${tickers.join(', ')}\n`)

    console.log('Fetching prices from Yahoo Finance...')
    const results = await Promise.all(tickers.map(fetchTickerPrice))

    const successCount = results.filter((r) => r.price !== null).length
    const failCount = results.length - successCount
    console.log(`Fetched: ${successCount} succeeded, ${failCount} failed\n`)

    const priceRecord = buildPriceRecord(results)
    const dateKey = buildTodayKey(new Date())

    console.log(`Reading existing prices.json (if any)...`)
    const existing = (await readJsonFile(pricesPath)) ?? {}

    const merged = mergePricesForDate(existing, dateKey, priceRecord)

    console.log(`Writing prices.json for ${dateKey}...`)
    await writeJsonFile(pricesPath, merged)

    console.log(`Done. ${Object.keys(priceRecord).length} price(s) written for ${dateKey}.`)
  } catch (error) {
    console.error(`Fatal error: ${error.message}`)
    if (process.env.DEBUG) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

fetchDailyPrices().catch((error) => {
  console.error(`Unhandled error: ${error.message}`)
  process.exit(1)
})
