<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          Részvény Követő
        </h1>
        <p class="app-subtitle">Személyes portfólió elemzés és nyomon követés</p>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <StockFilters
          :filters="filters"
          :exchanges="exchanges"
          :currencies="currencies"
          @update:filters="updateFilters"
          @reset="resetFilters"
        />

        <div class="stocks-summary">
          <div class="summary-card">
            <span class="summary-label">Összes részvény</span>
            <span class="summary-value">{{ stocks.length }}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Szűrt eredmények</span>
            <span class="summary-value">{{ filteredStocks.length }}</span>
          </div>
        </div>

        <StockTable
          :stocks="filteredStocks"
          @show-details="showStockDetails"
        />
      </div>
    </main>

    <StockModal
      :stock="selectedStock"
      :is-open="isModalOpen"
      @close="closeModal"
    />

    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StockTable from './components/StockTable.vue'
import StockModal from './components/StockModal.vue'
import StockFilters from './components/StockFilters.vue'
import { useStocks } from './composables/useStocks'
import type { Stock, StockFilters as StockFiltersType } from './types/Stock'

const {
  stocks,
  loading,
  filters,
  filteredStocks,
  exchanges,
  currencies,
  loadStocks,
  resetFilters
} = useStocks()

const selectedStock = ref<Stock | null>(null)
const isModalOpen = ref(false)

const showStockDetails = (stock: Stock) => {
  selectedStock.value = stock
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedStock.value = null
  }, 300)
}

const updateFilters = (newFilters: StockFiltersType) => {
  Object.assign(filters.value, newFilters)
}

onMounted(() => {
  loadStocks()
})
</script>
