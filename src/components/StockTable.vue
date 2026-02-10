<template>
  <div class="table-container">
    <div v-if="stocks.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      <h3>{{ messages.table.empty.title }}</h3>
      <p>{{ messages.table.empty.description }}</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="stocks-table">
        <thead>
          <tr>
            <th @click="handleSort('ticker')" class="sortable">
              {{ messages.table.columns.ticker }}
              <span v-if="sortKey === 'ticker'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('name')" class="sortable">
              {{ messages.table.columns.name }}
              <span v-if="sortKey === 'name'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('stock_exchange')" class="sortable">
              {{ messages.table.columns.exchange }}
              <span v-if="sortKey === 'stock_exchange'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('market_cap')" class="sortable">
              {{ messages.table.columns.marketCap }}
              <span v-if="sortKey === 'market_cap'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('entry_price')" class="sortable">
              {{ messages.table.columns.entryPrice }}
              <span v-if="sortKey === 'entry_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('uplift_potential')" class="sortable">
              {{ messages.table.columns.potential }}
              <span v-if="sortKey === 'uplift_potential'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('current_price')" class="sortable">
              {{ messages.table.columns.currentPrice }}
              <span v-if="sortKey === 'current_price'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('difference')" class="sortable">
              {{ messages.table.columns.difference }}
              <span v-if="sortKey === 'difference'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('twelve_months_price_target')" class="sortable">
              {{ messages.table.columns.priceTarget12m }}
              <span v-if="sortKey === 'twelve_months_price_target'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="handleSort('created_at')" class="sortable">
              {{ messages.table.columns.created }}
              <span v-if="sortKey === 'created_at'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>{{ messages.table.columns.actions }}</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="stock in sortedStocks" 
            :key="stock.id"
            class="stock-row"
          >
            <td class="ticker-cell">
              <span class="ticker-badge">{{ stock.ticker }}</span>
            </td>
            <td class="name-cell">{{ stock.name }}</td>
            <td>{{ stock.stock_exchange }}</td>
            <td class="market-cap-cell">{{ stock.market_cap }}</td>
            <td class="price-cell">{{ formatPrice(stock.entry_price) }} {{ stock.currency }}</td>
            <td>
              <span 
                class="potential-badge"
                :class="stock.uplift_potential >= 0 ? 'positive' : 'negative'"
              >
                {{ stock.uplift_potential > 0 ? '+' : '' }}{{ stock.uplift_potential.toFixed(1) }}%
              </span>
            </td>
            <td class="price-cell">{{ formatPrice(stock.current_price) }} {{ stock.currency }}</td>
            <td class="price-cell" v-if="stock.difference !== null">
              <span 
                class="difference-badge"
                :class="stock.difference >= 0 ? 'positive' : 'negative'"
              >
                {{ stock.difference > 0 ? '+' : '' }}{{ stock.difference.toFixed(2) }}%
              </span>
            </td>
            <td class="price-cell" v-else>-</td>
            <td class="price-cell">{{ formatPrice(stock.twelve_months_price_target) }} {{ stock.currency }}</td>
            <td class="date-cell">{{ formatDateOnly(stock.created_at) }}</td>
            <td>
              <button 
                @click="handleDetails(stock)"
                class="details-button"
              >
                {{ messages.table.actions.details }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Stock } from '@/types/Stock'
import { formatDateOnly } from '@/utils/dateFormatter'
import { useMessages } from '@/locales/useMessages'

const { messages } = useMessages()

interface Props {
  stocks: Stock[]
}

interface Emits {
  (e: 'show-details', stock: Stock): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

type SortKey = keyof Stock
type SortOrder = 'asc' | 'desc'

const sortKey = ref<SortKey>('created_at')
const sortOrder = ref<SortOrder>('desc')

const sortedStocks = computed(() => {
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

const handleSort = (key: SortKey) => {
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

const handleDetails = (stock: Stock) => {
  emit('show-details', stock)
}
</script>
