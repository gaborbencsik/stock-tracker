import { ref, computed, type Ref } from 'vue'
import type { Stock, StockFilters } from '@/types/Stock'
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
    maxPotential: null
  })

  // Load stocks from JSON
  const loadStocks = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 100))
      stocks.value = stocksData as Stock[]
    } catch (e) {
      error.value = 'Failed to load stocks'
      console.error('Error loading stocks:', e)
    } finally {
      loading.value = false
    }
  }

  // Filtered stocks based on current filters
  const filteredStocks = computed(() => {
    return stocks.value.filter(stock => {
      // Search filter (ticker or name)
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        const matchesSearch = 
          stock.ticker.toLowerCase().includes(searchLower) ||
          stock.name.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Exchange filter
      if (filters.value.exchange && stock.stock_exchange !== filters.value.exchange) {
        return false
      }

      // Currency filter
      if (filters.value.currency && stock.currency !== filters.value.currency) {
        return false
      }

      // Price range filter
      if (filters.value.minPrice !== null && stock.entry_price < filters.value.minPrice) {
        return false
      }
      if (filters.value.maxPrice !== null && stock.entry_price > filters.value.maxPrice) {
        return false
      }

      // Potential range filter
      if (filters.value.minPotential !== null && stock.uplift_potential < filters.value.minPotential) {
        return false
      }
      if (filters.value.maxPotential !== null && stock.uplift_potential > filters.value.maxPotential) {
        return false
      }

      return true
    })
  })

  // Get unique exchanges
  const exchanges = computed(() => {
    return Array.from(new Set(stocks.value.map(s => s.stock_exchange))).sort()
  })

  // Get unique currencies
  const currencies = computed(() => {
    return Array.from(new Set(stocks.value.map(s => s.currency))).sort()
  })

  // Reset filters
  const resetFilters = () => {
    filters.value = {
      search: '',
      exchange: '',
      currency: '',
      minPrice: null,
      maxPrice: null,
      minPotential: null,
      maxPotential: null
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
