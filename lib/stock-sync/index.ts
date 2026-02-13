export { 
  calculatePriceDifference,
  updateStockWithPrice,
  updateStockTimestamp,
  comparePrices,
  syncAndUpdateStocks,
  type SyncResult
} from './syncStockPrices'

export { 
  FileSystemAdapter,
  GitCommandAdapter,
  type FileAdapter,
  type GitAdapter
} from './adapters'
