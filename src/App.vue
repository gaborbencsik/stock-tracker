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
        <div class="filters-toggle-container">
          <button class="filters-toggle-btn" @click="toggleFilters">
            <svg 
              class="toggle-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
              :style="{ transform: filtersVisible ? 'rotate(180deg)' : 'rotate(0deg)' }"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
            {{ filtersVisible ? 'Szűrők elrejtése' : 'Szűrők megjelenítése' }}
            <span v-if="activeFiltersCount > 0" class="filter-badge">
              {{ activeFiltersCount }}
            </span>
          </button>
        </div>

        <Transition name="slide-fade">
          <StockFilters
            v-if="filtersVisible"
            :filters="filters"
            :exchanges="exchanges"
            :currencies="currencies"
            @update:filters="updateFilters"
            @reset="resetFilters"
          />
        </Transition>

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
import { ref, computed, onMounted } from 'vue'
import StockTable from './components/StockTable.vue'
import StockModal from './components/StockModal.vue'
import StockFilters from './components/StockFilters.vue'
import { useStocks } from './composables/useStocks'
import type { Stock, StockFilters as StockFiltersType } from './types/Stock'

const {
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
const filtersVisible = ref(false)

const toggleFilters = (): void => {
  filtersVisible.value = !filtersVisible.value
}

const activeFiltersCount = computed((): number => {
  const { search, exchange, currency, minPrice, maxPrice, minPotential, maxPotential } = filters.value
  let count = 0
  
  if (search) count++
  if (exchange) count++
  if (currency) count++
  if (minPrice !== null) count++
  if (maxPrice !== null) count++
  if (minPotential !== null) count++
  if (maxPotential !== null) count++
  
  return count
})

const showStockDetails = (stock: Stock): void => {
  selectedStock.value = stock
  isModalOpen.value = true
}

const closeModal = (): void => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedStock.value = null
  }, 300)
}

const updateFilters = (newFilters: StockFiltersType): void => {
  Object.assign(filters.value, newFilters)
}

onMounted((): void => {
  loadStocks()
})
</script>
