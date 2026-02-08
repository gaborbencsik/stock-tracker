import { ref, computed, type Ref } from 'vue'
import type { Stock, StockFilters } from '@/types/Stock'
import { messages } from '@/locales/messages'
import stocksData from '@/data/stocks.json'

export function useStocks() {
  const stocks: Ref<Stock[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const filters = ref<StockFilters>({
    search: '',
    exchange: '',
    currency: '',
    minPrice: null,
    maxPrice: null,
    minPotential: null,
    maxPotential: null,
    marketCaps: []
  })

  const loadStocks = async () => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      stocks.value = stocksData as Stock[]
    } catch (e) {
      error.value = messages.errors.loadStocksFailed
      console.error('Error loading stocks:', e)
    } finally {
      loading.value = false
    }
  }

  const filteredStocks = computed(() => {
    return stocks.value.filter(stock => {
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        const matchesSearch = 
          stock.ticker.toLowerCase().includes(searchLower) ||
          stock.name.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.value.exchange && stock.stock_exchange !== filters.value.exchange) {
        return false
      }

      if (filters.value.currency && stock.currency !== filters.value.currency) {
        return false
      }

      if (filters.value.minPrice !== null && stock.entry_price < filters.value.minPrice) {
        return false
      }
      if (filters.value.maxPrice !== null && stock.entry_price > filters.value.maxPrice) {
        return false
      }

      if (filters.value.minPotential !== null && stock.uplift_potential < filters.value.minPotential) {
        return false
      }
      if (filters.value.maxPotential !== null && stock.uplift_potential > filters.value.maxPotential) {
        return false
      }

      if (filters.value.marketCaps.length > 0 && !filters.value.marketCaps.includes(stock.market_cap)) {
        return false
      }

      return true
    })
  })

  const exchanges = computed(() => {
    return Array.from(new Set(stocks.value.map(s => s.stock_exchange))).sort()
  })

  const currencies = computed(() => {
    return Array.from(new Set(stocks.value.map(s => s.currency))).sort()
  })

  const resetFilters = () => {
    filters.value = {
      search: '',
      exchange: '',
      currency: '',
      minPrice: null,
      maxPrice: null,
      minPotential: null,
      maxPotential: null,
      marketCaps: []
    }
  }

  return {
    stocks,
    loading,
    error,
    filters,
    filteredStocks,
    exchanges,
    currencies,
    loadStocks,
    resetFilters
  }
}
