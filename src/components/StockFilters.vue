<template>
  <div class="filters-container">
    <div class="filters-header">
      <h2>{{ messages.filters.title }}</h2>
      <button @click="handleReset" class="reset-button">{{ messages.filters.reset }}</button>
    </div>

    <div class="filters-grid">
      <div class="filter-group">
        <label for="search">{{ messages.filters.search.label }}</label>
        <input
          id="search"
          v-model="localFilters.search"
          type="text"
          :placeholder="messages.filters.search.placeholder"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label for="exchange">{{ messages.filters.exchange.label }}</label>
        <select id="exchange" v-model="localFilters.exchange" class="filter-select">
          <option value="">{{ messages.filters.exchange.allOption }}</option>
          <option v-for="exchange in exchanges" :key="exchange" :value="exchange">
            {{ exchange }}
          </option>
        </select>
      </div>

      <!-- Currency -->
      <div class="filter-group">
        <label for="currency">{{ messages.filters.currency.label }}</label>
        <select id="currency" v-model="localFilters.currency" class="filter-select">
          <option value="">{{ messages.filters.currency.allOption }}</option>
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="minPrice">{{ messages.filters.minPrice.label }}</label>
        <input
          id="minPrice"
          v-model.number="localFilters.minPrice"
          type="number"
          :placeholder="messages.filters.minPrice.placeholder"
          class="filter-input"
          step="0.01"
        />
      </div>

      <div class="filter-group">
        <label for="maxPrice">{{ messages.filters.maxPrice.label }}</label>
        <input
          id="maxPrice"
          v-model.number="localFilters.maxPrice"
          type="number"
          :placeholder="messages.filters.maxPrice.placeholder"
          class="filter-input"
          step="0.01"
        />
      </div>

      <div class="filter-group">
        <label for="minPotential">{{ messages.filters.minPotential.label }}</label>
        <input
          id="minPotential"
          v-model.number="localFilters.minPotential"
          type="number"
          :placeholder="messages.filters.minPotential.placeholder"
          class="filter-input"
          step="0.1"
        />
      </div>

      <div class="filter-group">
        <label for="maxPotential">{{ messages.filters.maxPotential.label }}</label>
        <input
          id="maxPotential"
          v-model.number="localFilters.maxPotential"
          type="number"
          :placeholder="messages.filters.maxPotential.placeholder"
          class="filter-input"
          step="0.1"
        />
      </div>

      <div class="filter-group market-cap-group">
        <label>{{ messages.filters.marketCap.label }}</label>
        <MarketCapSelect
          v-model="localFilters.marketCaps"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue'
import type { StockFilters } from '@/types/Stock'
import MarketCapSelect from '@/components/MarketCapSelect.vue'
import { useMessages } from '@/locales/useMessages'

const { messages } = useMessages()

interface Props {
  filters: StockFilters
  exchanges: string[]
  currencies: string[]
}

interface Emits {
  (e: 'update:filters', value: StockFilters): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFilters = reactive<StockFilters>({ ...props.filters })

watch(
  () => localFilters,
  (newFilters) => {
    emit('update:filters', newFilters)
  },
  { deep: true }
)

const handleReset = () => {
  emit('reset')
}
</script>
