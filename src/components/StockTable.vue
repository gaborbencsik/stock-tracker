<template>
  <div class="table-container">
    <div v-if="stocks.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      <h3>{{ $t('table.empty.title') }}</h3>
      <p>{{ $t('table.empty.description') }}</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="stocks-table">
        <thead>
          <tr v-if="currentView === 'basicInfos'">
            <th @click="handleSort('ticker')" class="sortable">
              {{ $t('table.columns.ticker') }}
              <span v-if="sortKey === 'ticker'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('name')" class="sortable">
              {{ $t('table.columns.name') }}
              <span v-if="sortKey === 'name'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('stock_exchange')" class="sortable">
              {{ $t('table.columns.exchange') }}
              <span v-if="sortKey === 'stock_exchange'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('market_cap')" class="sortable">
              {{ $t('table.columns.marketCap') }}
              <span v-if="sortKey === 'market_cap'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('entry_price')" class="sortable">
              {{ $t('table.columns.entryPrice') }}
              <span v-if="sortKey === 'entry_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('uplift_potential')" class="sortable">
              {{ $t('table.columns.potential') }}
              <span v-if="sortKey === 'uplift_potential'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('current_price')" class="sortable">
              {{ $t('table.columns.currentPrice') }}
              <span v-if="sortKey === 'current_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('difference')" class="sortable">
              {{ $t('table.columns.difference') }}
              <span v-if="sortKey === 'difference'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('created_at')" class="sortable">
              {{ $t('table.columns.created') }}
              <span v-if="sortKey === 'created_at'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>{{ $t('table.columns.actions') }}</th>
          </tr>
          <tr v-else-if="currentView === 'priceChanges'">
            <th @click="handleSort('ticker')" class="sortable">
              {{ $t('table.columns.ticker') }}
              <span v-if="sortKey === 'ticker'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('name')" class="sortable">
              {{ $t('table.columns.name') }}
              <span v-if="sortKey === 'name'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('uplift_potential')" class="sortable">
              {{ $t('table.columns.potential') }}
              <span v-if="sortKey === 'uplift_potential'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('entry_price')" class="sortable">
              {{ $t('table.columns.entryPrice') }}
              <span v-if="sortKey === 'entry_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('current_price')" class="sortable">
              {{ $t('table.columns.currentPrice') }}
              <span v-if="sortKey === 'current_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('difference')" class="sortable">
              {{ $t('table.columns.difference') }}
              <span v-if="sortKey === 'difference'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('highest_price')" class="sortable">
              {{ $t('table.columns.highestPrice') }}
              <span v-if="sortKey === 'highest_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>{{ $t('table.columns.maxPriceChange') }}</th>
            <th>{{ $t('table.columns.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in groupedAndSortedStocks" :key="group.ticker">
            <!-- Single Item Group - Render as normal row -->
            <tr 
              v-if="group.isSingleItem"
              class="stock-row"
              @click="handleDetails(group.stocks[0])"
            >
              <!-- Basic Infos View -->
              <template v-if="currentView === 'basicInfos'">
                <td class="ticker-cell" data-label="Ticker">
                  <span class="ticker-badge">{{ group.ticker }}</span>
                </td>
                <td class="name-cell" data-label="Name">{{ group.stocks[0].name }}</td>
                <td class="stock-exchange-cell" data-label="Exchange">{{ group.stocks[0].stock_exchange }}</td>
                <td class="market-cap-cell" data-label="Market Cap">{{ group.stocks[0].market_cap }}</td>
                <td class="entry-price-cell" data-label="Entry Price">{{ formatPrice(group.stocks[0].entry_price) }} {{ group.stocks[0].currency }}</td>
                <td class="potential-cell" data-label="Potential">
                  <span 
                    class="potential-badge"
                    :class="group.stocks[0].uplift_potential >= 0 ? 'positive' : 'negative'"
                  >
                    {{ group.stocks[0].uplift_potential > 0 ? '+' : '' }}{{ group.stocks[0].uplift_potential.toFixed(1) }}%
                  </span>
                </td>
                <td class="current-price-cell" data-label="Current Price">{{ formatPrice(group.stocks[0].current_price) }} {{ group.stocks[0].currency }}</td>
                <td class="difference-cell" data-label="Difference" v-if="group.stocks[0].difference !== null">
                  <span 
                    class="difference-badge"
                    :class="group.stocks[0].difference >= 0 ? 'positive' : 'negative'"
                  >
                    {{ group.stocks[0].difference > 0 ? '+' : '' }}{{ group.stocks[0].difference.toFixed(2) }}%
                  </span>
                </td>
                <td class="difference-cell" data-label="Difference" v-else>-</td>
                <td class="date-cell" data-label="Date">{{ formatDateOnly(group.stocks[0].created_at) }}</td>
                <td class="actions-cell">
                  <button 
                    @click="handleDetails(group.stocks[0])"
                    class="details-button"
                  >
                    {{ $t('table.actions.details') }}
                  </button>
                </td>
              </template>

              <!-- Price Changes View -->
              <template v-else-if="currentView === 'priceChanges'">
                <td class="ticker-cell" data-label="Ticker">
                  <span class="ticker-badge">{{ group.ticker }}</span>
                </td>
                <td class="name-cell" data-label="Name">{{ group.stocks[0].name }}</td>
                <td class="potential-cell" data-label="Potential">
                  <span 
                    class="potential-badge"
                    :class="group.stocks[0].uplift_potential >= 0 ? 'positive' : 'negative'"
                  >
                    {{ group.stocks[0].uplift_potential > 0 ? '+' : '' }}{{ group.stocks[0].uplift_potential.toFixed(1) }}%
                  </span>
                </td>
                <td class="entry-price-cell" data-label="Entry Price">{{ formatPrice(group.stocks[0].entry_price) }} {{ group.stocks[0].currency }}</td>
                <td class="current-price-cell" data-label="Current Price">{{ formatPrice(group.stocks[0].current_price) }} {{ group.stocks[0].currency }}</td>
                <td class="difference-cell" v-if="group.stocks[0].difference !== null">
                  <span 
                    class="difference-badge"
                    :class="group.stocks[0].difference >= 0 ? 'positive' : 'negative'"
                  >
                    {{ group.stocks[0].difference > 0 ? '+' : '' }}{{ group.stocks[0].difference.toFixed(2) }}%
                  </span>
                </td>
                <td class="difference-cell" v-else>-</td>
                <td class="highest-price-cell" data-label="Max Price">{{ formatPrice(group.stocks[0].highest_price) }} {{ group.stocks[0].currency }}</td>
                <td class="max-price-change-cell">
                  <span 
                    class="difference-badge"
                    :class="calculateMaxPriceChange(group.stocks[0]) >= 0 ? 'positive' : 'negative'"
                  >
                    {{ calculateMaxPriceChange(group.stocks[0]) > 0 ? '+' : '' }}{{ calculateMaxPriceChange(group.stocks[0]).toFixed(2) }}%
                  </span>
                </td>
                <td class="actions-cell">
                  <button 
                    @click="handleDetails(group.stocks[0])"
                    class="details-button"
                  >
                    {{ $t('table.actions.details') }}
                  </button>
                </td>
              </template>
            </tr>

            <!-- Multi-Item Group - Render as collapsed or expanded -->
            <template v-else>
              <!-- Collapsed State - Single Collapsible Row -->
              <tr 
                v-if="!isGroupExpanded(group.ticker)"
                class="stock-row stock-row-collapsible"
              >
                <!-- Basic Infos View -->
                <template v-if="currentView === 'basicInfos'">
                  <td class="ticker-cell" data-label="Ticker" @click="toggleGroup(group.ticker, $event)">
                    <div class="ticker-with-toggle">
                      <span class="ticker-badge">{{ group.ticker }}</span>
                      <button 
                        class="toggle-icon"
                        @click="toggleGroup(group.ticker, $event)"
                        :aria-label="$t('table.actions.toggle')"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="name-cell" data-label="Name">{{ group.latestStock.name }}</td>
                  <td class="stock-exchange-cell" data-label="Exchange">{{ group.latestStock.stock_exchange }}</td>
                  <td class="market-cap-cell" data-label="Market Cap">{{ group.latestStock.market_cap }}</td>
                  <td class="entry-price-cell" data-label="Entry Price">{{ formatPrice(group.latestStock.entry_price) }} {{ group.latestStock.currency }}</td>
                  <td class="potential-cell" data-label="Potential">
                    <span 
                      class="potential-badge"
                      :class="group.latestStock.uplift_potential >= 0 ? 'positive' : 'negative'"
                    >
                      {{ group.latestStock.uplift_potential > 0 ? '+' : '' }}{{ group.latestStock.uplift_potential.toFixed(1) }}%
                    </span>
                  </td>
                  <td class="current-price-cell" data-label="Current Price">{{ formatPrice(group.latestStock.current_price) }} {{ group.latestStock.currency }}</td>
                  <td class="difference-cell" data-label="Difference" v-if="group.latestStock.difference !== null">
                    <span 
                      class="difference-badge"
                      :class="group.latestStock.difference >= 0 ? 'positive' : 'negative'"
                    >
                      {{ group.latestStock.difference > 0 ? '+' : '' }}{{ group.latestStock.difference.toFixed(2) }}%
                    </span>
                  </td>
                  <td class="difference-cell" data-label="Difference" v-else>-</td>
                  <td class="date-cell" data-label="Date">{{ formatDateOnly(group.latestStock.created_at) }}</td>
                  <td class="actions-cell">
                    <button 
                      @click="handleDetails(group.latestStock)"
                      class="details-button"
                    >
                      {{ $t('table.actions.details') }}
                    </button>
                  </td>
                </template>

                <!-- Price Changes View -->
                <template v-else-if="currentView === 'priceChanges'">
                  <td class="ticker-cell" data-label="Ticker" @click="toggleGroup(group.ticker, $event)">
                    <div class="ticker-with-toggle">
                      <span class="ticker-badge">{{ group.ticker }}</span>
                      <button 
                        class="toggle-icon"
                        @click="toggleGroup(group.ticker, $event)"
                        :aria-label="$t('table.actions.toggle')"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="name-cell" data-label="Name">{{ group.latestStock.name }}</td>
                  <td class="potential-cell" data-label="Potential">
                    <span 
                      class="potential-badge"
                      :class="group.latestStock.uplift_potential >= 0 ? 'positive' : 'negative'"
                    >
                      {{ group.latestStock.uplift_potential > 0 ? '+' : '' }}{{ group.latestStock.uplift_potential.toFixed(1) }}%
                    </span>
                  </td>
                  <td class="entry-price-cell" data-label="Entry Price">{{ formatPrice(group.latestStock.entry_price) }} {{ group.latestStock.currency }}</td>
                  <td class="current-price-cell" data-label="Current Price">{{ formatPrice(group.latestStock.current_price) }} {{ group.latestStock.currency }}</td>
                  <td class="difference-cell" v-if="group.latestStock.difference !== null">
                    <span 
                      class="difference-badge"
                      :class="group.latestStock.difference >= 0 ? 'positive' : 'negative'"
                    >
                      {{ group.latestStock.difference > 0 ? '+' : '' }}{{ group.latestStock.difference.toFixed(2) }}%
                    </span>
                  </td>
                  <td class="difference-cell" v-else>-</td>
                  <td class="highest-price-cell" data-label="Max Price">{{ formatPrice(group.latestStock.highest_price) }} {{ group.latestStock.currency }}</td>
                  <td class="max-price-change-cell">
                    <span 
                      class="difference-badge"
                      :class="calculateMaxPriceChange(group.latestStock) >= 0 ? 'positive' : 'negative'"
                    >
                      {{ calculateMaxPriceChange(group.latestStock) > 0 ? '+' : '' }}{{ calculateMaxPriceChange(group.latestStock).toFixed(2) }}%
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button 
                      @click="handleDetails(group.latestStock)"
                      class="details-button"
                    >
                      {{ $t('table.actions.details') }}
                    </button>
                  </td>
                </template>
              </tr>

              <!-- Expanded State - Header and Detail Rows -->
              <template v-else>
                <!-- Group Header Row -->
                <tr class="stock-group-header stock-group-header-expanded" @click="toggleGroup(group.ticker, $event)">
                  <td class="ticker-cell" data-label="Ticker">
                    <div class="ticker-with-toggle">
                      <span class="ticker-badge">{{ group.ticker }}</span>
                      <button 
                        class="toggle-icon toggle-icon-open"
                        @click="toggleGroup(group.ticker, $event)"
                        :aria-label="$t('table.actions.toggle')"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td colspan="100" class="group-spacer"></td>
                </tr>
                
                <!-- Group Detail Rows -->
                <tr 
                  v-for="stock in group.stocks" 
                  :key="stock.id"
                  class="stock-row stock-row-in-group stock-row-group-details"
                  @click="handleDetails(stock)"
                >
                  <!-- Basic Infos View -->
                  <template v-if="currentView === 'basicInfos'">
                    <td class="ticker-cell" data-label="Ticker"></td>
                    <td class="name-cell" data-label="Name">{{ stock.name }}</td>
                    <td class="stock-exchange-cell" data-label="Exchange">{{ stock.stock_exchange }}</td>
                    <td class="market-cap-cell" data-label="Market Cap">{{ stock.market_cap }}</td>
                    <td class="entry-price-cell" data-label="Entry Price">{{ formatPrice(stock.entry_price) }} {{ stock.currency }}</td>
                    <td class="potential-cell" data-label="Potential">
                      <span 
                        class="potential-badge"
                        :class="stock.uplift_potential >= 0 ? 'positive' : 'negative'"
                      >
                        {{ stock.uplift_potential > 0 ? '+' : '' }}{{ stock.uplift_potential.toFixed(1) }}%
                      </span>
                    </td>
                    <td class="current-price-cell" data-label="Current Price">{{ formatPrice(stock.current_price) }} {{ stock.currency }}</td>
                    <td class="difference-cell" data-label="Difference" v-if="stock.difference !== null">
                      <span 
                        class="difference-badge"
                        :class="stock.difference >= 0 ? 'positive' : 'negative'"
                      >
                        {{ stock.difference > 0 ? '+' : '' }}{{ stock.difference.toFixed(2) }}%
                      </span>
                    </td>
                    <td class="difference-cell" data-label="Difference" v-else>-</td>
                    <td class="date-cell" data-label="Date">{{ formatDateOnly(stock.created_at) }}</td>
                    <td class="actions-cell">
                      <button 
                        @click="handleDetails(stock)"
                        class="details-button"
                      >
                        {{ $t('table.actions.details') }}
                      </button>
                    </td>
                  </template>

                  <!-- Price Changes View -->
                  <template v-else-if="currentView === 'priceChanges'">
                    <td class="ticker-cell" data-label="Ticker"></td>
                    <td class="name-cell" data-label="Name">{{ stock.name }}</td>
                    <td class="potential-cell" data-label="Potential">
                      <span 
                        class="potential-badge"
                        :class="stock.uplift_potential >= 0 ? 'positive' : 'negative'"
                      >
                        {{ stock.uplift_potential > 0 ? '+' : '' }}{{ stock.uplift_potential.toFixed(1) }}%
                      </span>
                    </td>
                    <td class="entry-price-cell" data-label="Entry Price">{{ formatPrice(stock.entry_price) }} {{ stock.currency }}</td>
                    <td class="current-price-cell" data-label="Current Price">{{ formatPrice(stock.current_price) }} {{ stock.currency }}</td>
                    <td class="difference-cell" v-if="stock.difference !== null">
                      <span 
                        class="difference-badge"
                        :class="stock.difference >= 0 ? 'positive' : 'negative'"
                      >
                        {{ stock.difference > 0 ? '+' : '' }}{{ stock.difference.toFixed(2) }}%
                      </span>
                    </td>
                    <td class="difference-cell" v-else>-</td>
                    <td class="highest-price-cell" data-label="Max Price">{{ formatPrice(stock.highest_price) }} {{ stock.currency }}</td>
                    <td class="max-price-change-cell">
                      <span 
                        class="difference-badge"
                        :class="calculateMaxPriceChange(stock) >= 0 ? 'positive' : 'negative'"
                      >
                        {{ calculateMaxPriceChange(stock) > 0 ? '+' : '' }}{{ calculateMaxPriceChange(stock).toFixed(2) }}%
                      </span>
                    </td>
                    <td class="actions-cell">
                      <button 
                        @click="handleDetails(stock)"
                        class="details-button"
                      >
                        {{ $t('table.actions.details') }}
                      </button>
                    </td>
                  </template>
                </tr>
              </template>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stock } from '@/types/Stock'
import { formatDateOnly } from '@/utils/dateFormatter'

const { t } = useI18n()

interface Props {
  stocks: Stock[]
  currentView: 'basicInfos' | 'priceChanges'
}

interface Emits {
  (e: 'show-details', stock: Stock): void
}

interface StockGroup {
  ticker: string
  stocks: Stock[]
  isSingleItem: boolean
  latestStock: Stock
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

type SortKey = keyof Stock
type SortOrder = 'asc' | 'desc'

const sortKey = ref<SortKey>('created_at')
const sortOrder = ref<SortOrder>('desc')

// Groups are collapsed by default - users can expand by clicking the ticker or toggle icon
const expandedGroups = ref<Map<string, boolean>>(new Map())

const sortedStocks = computed((): Stock[] => {
  const sorted = [...props.stocks].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    // Handle date fields (created_at, last_modified)
    if (sortKey.value === 'created_at' || sortKey.value === 'last_modified') {
      const aTime = new Date(aVal as string).getTime()
      const bTime = new Date(bVal as string).getTime()
      return sortOrder.value === 'asc' 
        ? aTime - bTime
        : bTime - aTime
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder.value === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc'
        ? aVal - bVal
        : bVal - aVal
    }

    return 0
  })

  return sorted
})

const getLatestStock = (stocks: Stock[]): Stock => {
  return stocks.reduce((latest, current) => {
    const latestTime = new Date(latest.created_at).getTime()
    const currentTime = new Date(current.created_at).getTime()
    return currentTime > latestTime ? current : latest
  })
}

const groupedAndSortedStocks = computed((): StockGroup[] => {
  const grouped = new Map<string, Stock[]>()
  
  // Group stocks by ticker, maintaining sorted order
  for (const stock of sortedStocks.value) {
    const ticker = stock.ticker
    if (!grouped.has(ticker)) {
      grouped.set(ticker, [])
    }
    grouped.get(ticker)?.push(stock)
  }
  
  // Convert map to array of StockGroup objects, maintaining insertion order
  return Array.from(grouped, ([ticker, stocks]) => ({
    ticker,
    stocks,
    isSingleItem: stocks.length === 1,
    latestStock: getLatestStock(stocks)
  }))
})

const handleSort = (key: SortKey): void => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const formatPrice = (price: number | null): string => {
  if (price === null) return 'N/A'
  return price.toFixed(2)
}

const calculateMaxPriceChange = (stock: Stock): number => {
  if (stock.highest_price === null || stock.entry_price === null) {
    return 0
  }

  return ((stock.highest_price - stock.entry_price) / stock.entry_price) * 100
}

const toggleGroup = (ticker: string, event: Event): void => {
  event.stopPropagation()
  const isExpanded = expandedGroups.value.get(ticker) ?? false
  expandedGroups.value.set(ticker, !isExpanded)
}

const isGroupExpanded = (ticker: string): boolean => {
  // Groups are collapsed by default (false)
  // Users can expand them by clicking the ticker cell or toggle icon
  return expandedGroups.value.get(ticker) ?? false
}

const handleDetails = (stock: Stock): void => {
  emit('show-details', stock)
}
</script>
