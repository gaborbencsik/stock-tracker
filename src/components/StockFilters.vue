<template>
  <div class="filters-container">
    <div class="filters-header">
      <h2>{{ $t('filters.title') }}</h2>
      <button @click="handleReset" class="reset-button">{{ $t('filters.reset') }}</button>
    </div>

    <div class="filters-grid">
      <div class="filter-group">
        <label for="search">{{ $t('filters.search.label') }}</label>
        <input
          id="search"
          v-model="localFilters.search"
          type="text"
          :placeholder="$t('filters.search.placeholder')"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label for="exchange">{{ $t('filters.exchange.label') }}</label>
        <select id="exchange" v-model="localFilters.exchange" class="filter-select">
          <option value="">{{ $t('filters.exchange.allOption') }}</option>
          <option v-for="exchange in exchanges" :key="exchange" :value="exchange">
            {{ exchange }}
          </option>
        </select>
      </div>

      <!-- Currency -->
      <div class="filter-group">
        <label for="currency">{{ $t('filters.currency.label') }}</label>
        <select id="currency" v-model="localFilters.currency" class="filter-select">
          <option value="">{{ $t('filters.currency.allOption') }}</option>
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="minPrice">{{ $t('filters.minPrice.label') }}</label>
        <input
          id="minPrice"
          v-model.number="localFilters.minPrice"
          type="number"
          :placeholder="$t('filters.minPrice.placeholder')"
          class="filter-input"
          step="0.01"
        />
      </div>

      <div class="filter-group">
        <label for="maxPrice">{{ $t('filters.maxPrice.label') }}</label>
        <input
          id="maxPrice"
          v-model.number="localFilters.maxPrice"
          type="number"
          :placeholder="$t('filters.maxPrice.placeholder')"
          class="filter-input"
          step="0.01"
        />
      </div>

      <div class="filter-group">
        <label for="minPotential">{{ $t('filters.minPotential.label') }}</label>
        <input
          id="minPotential"
          v-model.number="localFilters.minPotential"
          type="number"
          :placeholder="$t('filters.minPotential.placeholder')"
          class="filter-input"
          step="0.1"
        />
      </div>

      <div class="filter-group">
        <label for="maxPotential">{{ $t('filters.maxPotential.label') }}</label>
        <input
          id="maxPotential"
          v-model.number="localFilters.maxPotential"
          type="number"
          :placeholder="$t('filters.maxPotential.placeholder')"
          class="filter-input"
          step="0.1"
        />
      </div>

      <div class="filter-group market-cap-group">
        <label>{{ $t('filters.marketCap.label') }}</label>
        <MarketCapSelect
          v-model="localFilters.marketCaps"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { StockFilters } from '@/types/Stock'
import MarketCapSelect from '@/components/MarketCapSelect.vue'

useI18n()

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
