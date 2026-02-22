<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            {{ $t('header.title') }}
          </h1>
          <p class="app-subtitle">{{ $t('header.subtitle') }}</p>
        </div>
        <LanguageSwitcher />
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="controls-container">
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
              {{ filtersVisible ? $t('filters.toggleHide') : $t('filters.toggleShow') }}
              <span v-if="activeFiltersCount > 0" class="filter-badge">
                {{ activeFiltersCount }}
              </span>
            </button>
            <div>
              <button 
              class="view-toggle-btn-header" 
              :class="{ active: tableView === 'basicInfos' }"
              @click="switchTableView('basicInfos')"
              >
                {{ $t('table.views.basicInfos') }}
              </button>
              <button 
                class="view-toggle-btn-header" 
                :class="{ active: tableView === 'priceChanges' }"
                @click="switchTableView('priceChanges')"
              >
                {{ $t('table.views.priceChanges') }}
              </button>
            </div>
          
          </div>
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
          :current-view="tableView"
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
import { useI18n } from 'vue-i18n'
import StockTable from './components/StockTable.vue'
import StockModal from './components/StockModal.vue'
import StockFilters from './components/StockFilters.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useStocks } from './composables/useStocks'
import type { Stock, StockFilters as StockFiltersType } from './types/Stock'

const { t } = useI18n()

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
const tableView = ref<'basicInfos' | 'priceChanges'>('basicInfos')

const toggleFilters = (): void => {
  filtersVisible.value = !filtersVisible.value
}

const switchTableView = (view: 'basicInfos' | 'priceChanges'): void => {
  if (tableView.value !== view) {
    tableView.value = view
  }
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
