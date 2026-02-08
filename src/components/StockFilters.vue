<template>
  <div class="filters-container">
    <div class="filters-header">
      <h2>Szűrők</h2>
      <button @click="handleReset" class="reset-button">Visszaállítás</button>
    </div>

    <div class="filters-grid">
      <div class="filter-group">
        <label for="search">Keresés (Ticker vagy Név)</label>
        <input
          id="search"
          v-model="localFilters.search"
          type="text"
          placeholder="pl. AAPL, Apple..."
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label for="exchange">Tőzsde</label>
        <select id="exchange" v-model="localFilters.exchange" class="filter-select">
          <option value="">Összes</option>
          <option v-for="exchange in exchanges" :key="exchange" :value="exchange">
            {{ exchange }}
          </option>
        </select>
      </div>

      <!-- Currency -->
      <div class="filter-group">
        <label for="currency">Deviza</label>
        <select id="currency" v-model="localFilters.currency" class="filter-select">
          <option value="">Összes</option>
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="minPrice">Min. ár</label>
        <input
          id="minPrice"
          v-model.number="localFilters.minPrice"
          type="number"
          placeholder="0"
          class="filter-input"
          step="0.01"
        />
      </div>

      <div class="filter-group">
        <label for="maxPrice">Max. ár</label>
        <input
          id="maxPrice"
          v-model.number="localFilters.maxPrice"
          type="number"
          placeholder="∞"
          class="filter-input"
          step="0.01"
        />
      </div>

      <div class="filter-group">
        <label for="minPotential">Min. potenciál (%)</label>
        <input
          id="minPotential"
          v-model.number="localFilters.minPotential"
          type="number"
          placeholder="-∞"
          class="filter-input"
          step="0.1"
        />
      </div>

      <div class="filter-group">
        <label for="maxPotential">Max. potenciál (%)</label>
        <input
          id="maxPotential"
          v-model.number="localFilters.maxPotential"
          type="number"
          placeholder="∞"
          class="filter-input"
          step="0.1"
        />
      </div>

      <div class="filter-group market-cap-group">
        <label>Piaci érték</label>
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
