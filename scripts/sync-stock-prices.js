#!/usr/bin/env node
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { updateStocksDifference } from './calculate-price-diff.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const stocksPath = path.join(__dirname, '../src/data/stocks.json')

/**
 * Gets current timestamp in ISO 8601 format for commit message
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  return new Date().toISOString()
}

/**
 * Checks if there are git changes in the specified file
 * @param {string} filePath - Path to file to check
 * @returns {boolean} True if file has changes
 */
function hasGitChanges(filePath) {
  try {
    const status = execSync(`git -C ${projectRoot} status --porcelain "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return status.trim().length > 0
  } catch (error) {
    // If git command fails, assume there are changes
    return true
  }
}

/**
 * Stages, commits and pushes changes to git
 * @param {string} commitMessage - Message for commit
 * @returns {boolean} True if push was successful
 */
function commitAndPush(commitMessage) {
  try {
    // Stage the file
    execSync(`git -C ${projectRoot} add "${stocksPath}"`, { stdio: 'pipe' })

    // Commit
    execSync(`git -C ${projectRoot} commit -m "${commitMessage}"`, { stdio: 'pipe' })

    // Push to current branch
    execSync(`git -C ${projectRoot} push`, { stdio: 'pipe' })

    console.log('✅ Changes committed and pushed successfully')
    return true
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('ℹ️  No changes to commit')
      return false
    }
    console.error('❌ Failed to commit/push:', error.message)
    throw error
  }
}

/**
 * Main sync function
 */
async function syncStockPrices() {
  try {
    console.log('🔄 Starting stock price synchronization...')
    const timestamp = getTimestamp()

    // Update stock prices using existing calculate-price-diff logic
    const result = await updateStocksDifference(stocksPath, true)

    // Check if there are changes to commit
    if (!result.hasChanges) {
      console.log('ℹ️  No price changes detected. Skipping commit.')
      process.exit(0)
    }

    // Create commit message with timestamp
    const commitMessage = `chore: sync stock prices [${timestamp}]`

    console.log(`📝 Committing changes: "${commitMessage}"`)

    // Commit and push
    commitAndPush(commitMessage)

    console.log('✨ Stock price sync completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Stock price sync failed:', error.message)
    process.exit(1)
  }
}

// Run the sync
syncStockPrices()
