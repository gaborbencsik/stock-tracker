<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-container" @click.stop>
        <button class="modal-close" @click="close" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div v-if="stock" class="modal-content">
          <div class="modal-header">
            <div class="ticker-badge">{{ stock.ticker }}</div>
            <h2 class="stock-name">{{ stock.name }}</h2>
            <div class="stock-meta">
              <span class="exchange-tag">{{ stock.stock_exchange }}</span>
              <span class="currency-tag">{{ stock.currency }}</span>
            </div>
          </div>

          <div class="pricing-section">
            <div class="entry-price-card">
              <label>Belépési ár</label>
              <div class="price-value">{{ formatPrice(stock.entry_price) }} {{ stock.currency }}</div>
            </div>
            <div class="potential-card" :class="potentialClass">
              <label>Növekedési potenciál</label>
              <div class="potential-value">{{ stock.uplift_potential > 0 ? '+' : '' }}{{ stock.uplift_potential.toFixed(1) }}%</div>
            </div>
          </div>

          <div class="targets-section">
            <h3>Árcélok</h3>
            <div class="targets-grid">
              <div class="target-card">
                <label>6 hónapos cél</label>
                <div class="target-value">{{ formatPrice(stock.six_months_price_target) }} {{ stock.currency }}</div>
              </div>
              <div class="target-card">
                <label>12 hónapos cél</label>
                <div class="target-value">{{ formatPrice(stock.twelve_months_price_target) }} {{ stock.currency }}</div>
              </div>
            </div>
          </div>

          <div class="highs-section">
            <h3>Történelmi csúcsok</h3>
            <div class="highs-timeline">
              <div class="high-item">
                <label>1 hónap</label>
                <span>{{ formatPrice(stock.one_month_highest_price) }}</span>
              </div>
              <div class="high-item">
                <label>2 hónap</label>
                <span>{{ formatPrice(stock.two_months_highest_price) }}</span>
              </div>
              <div class="high-item">
                <label>3 hónap</label>
                <span>{{ formatPrice(stock.three_months_highest_price) }}</span>
              </div>
              <div class="high-item">
                <label>6 hónap</label>
                <span>{{ formatPrice(stock.six_months_highest_price) }}</span>
              </div>
              <div class="high-item">
                <label>12 hónap</label>
                <span>{{ formatPrice(stock.twelve_months_highest_price) }}</span>
              </div>
              <div class="high-item highlight">
                <label>Mindenkori legmagasabb</label>
                <span>{{ formatPrice(stock.highest_price) }}</span>
              </div>
            </div>
          </div>

          <div v-if="stock.notes" class="notes-section">
            <h3>Jegyzetek</h3>
            <p>{{ stock.notes }}</p>
          </div>

          <div v-if="parsedLinks.length > 0" class="links-section">
            <h3>Linkek</h3>
            <div class="links-grid">
              <a 
                v-for="(link, index) in parsedLinks" 
                :key="index"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="link-chip"
              >
                {{ link.label }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="meta-section">
            <div class="meta-item">
              <label>Létrehozva:</label>
              <span>{{ formatDateTime(stock.created_at) }}</span>
            </div>
            <div class="meta-item">
              <label>Utoljára módosítva:</label>
              <span>{{ formatDateTime(stock.last_modified) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import type { Stock } from '@/types/Stock'
import { formatDateTime } from '@/utils/dateFormatter'

interface Props {
  stock: Stock | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const potentialClass = computed(() => {
  if (!props.stock) return ''
  return props.stock.uplift_potential >= 0 ? 'positive' : 'negative'
})

const parsedLinks = computed(() => {
  if (!props.stock?.links) return []
  
  return props.stock.links
    .split(',')
    .map(link => link.trim())
    .filter(link => link.length > 0)
    .map(url => {
      try {
        const urlObj = new URL(url)
        return {
          url,
          label: urlObj.hostname.replace('www.', '')
        }
      } catch {
        return { url, label: url }
      }
    })
})

const formatPrice = (price: number | null): string => {
  if (price === null) return 'N/A'
  return price.toFixed(2)
}

const close = () => {
  emit('close')
}

const handleBackdropClick = () => {
  close()
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>
