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
          <!-- Header Section -->
          <div class="modal-header">
            <div class="ticker-badge">{{ stock.ticker }}</div>
            <h2 class="stock-name">{{ stock.name }}</h2>
            <div class="stock-meta">
              <span class="exchange-tag">{{ stock.stock_exchange }}</span>
              <span class="currency-tag">{{ stock.currency }}</span>
            </div>
          </div>

          <!-- Pricing Section -->
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

          <!-- Price Targets -->
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

          <!-- Historical Highs -->
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

          <!-- Notes Section -->
          <div v-if="stock.notes" class="notes-section">
            <h3>Jegyzetek</h3>
            <p>{{ stock.notes }}</p>
          </div>

          <!-- Links Section -->
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

          <!-- Meta Information -->
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

const formatPrice = (price: number): string => {
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
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-content {
  padding: 40px;
  color: white;
}

.modal-header {
  text-align: center;
  margin-bottom: 40px;
}

.ticker-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 16px;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.stock-name {
  font-size: 32px;
  font-weight: 700;
  margin: 16px 0;
  background: linear-gradient(135deg, #fff 0%, #a8b8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stock-meta {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

.exchange-tag,
.currency-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pricing-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.entry-price-card,
.potential-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.entry-price-card:hover,
.potential-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.entry-price-card label,
.potential-card label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price-value,
.potential-value {
  font-size: 32px;
  font-weight: 700;
}

.potential-card.positive {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-color: rgba(34, 197, 94, 0.3);
}

.potential-card.positive .potential-value {
  color: #22c55e;
}

.potential-card.negative {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.potential-card.negative .potential-value {
  color: #ef4444;
}

.targets-section,
.highs-section,
.notes-section,
.links-section {
  margin-bottom: 40px;
}

h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.targets-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.target-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.target-card label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.target-value {
  font-size: 24px;
  font-weight: 700;
  color: #60a5fa;
}

.highs-timeline {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.high-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.high-item:last-child {
  border-bottom: none;
}

.high-item label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.high-item span {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.high-item.highlight {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%);
  border-radius: 8px;
  margin-top: 8px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.high-item.highlight label {
  color: #fbbf24;
  font-weight: 600;
}

.high-item.highlight span {
  color: #fbbf24;
  font-size: 20px;
}

.notes-section p {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  border-left: 4px solid #667eea;
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.link-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: white;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.link-chip:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  transform: translateY(-2px);
}

.link-chip svg {
  width: 16px;
  height: 16px;
}

.meta-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  display: flex;
  gap: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.meta-item {
  display: flex;
  gap: 8px;
}

.meta-item label {
  font-weight: 600;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    padding: 24px;
  }

  .stock-name {
    font-size: 24px;
  }

  .pricing-section,
  .targets-grid {
    grid-template-columns: 1fr;
  }

  .meta-section {
    flex-direction: column;
    gap: 12px;
  }
}
