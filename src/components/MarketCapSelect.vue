<template>
  <div class="market-cap-container" @blur="isOpen = false" @keydown.esc="isOpen = false" tabindex="-1">
    <div class="market-cap-wrapper">
      <div class="market-cap-chips-input" @click="isOpen = !isOpen">
        <div v-for="value in modelValue" :key="value" class="market-cap-chip">
          <span class="market-cap-chip-text">{{ formatLabel(value) }}</span>
          <button
            type="button"
            class="market-cap-chip-remove"
            @click.stop="removeValue(value)"
            aria-label="Remove"
          >
            ×
          </button>
        </div>
        <input
          v-if="modelValue.length < 3"
          type="text"
          class="market-cap-input"
          placeholder="Piaci érték"
          readonly
        />
      </div>
    </div>

    <div v-if="isOpen" class="market-cap-dropdown">
      <input
        v-model="searchTerm"
        type="text"
        class="market-cap-search"
        placeholder="Keresés..."
      />

      <label class="market-cap-select-all">
        <input
          type="checkbox"
          :checked="modelValue.length === 3"
          :indeterminate="modelValue.length > 0 && modelValue.length < 3"
          @change="toggleSelectAll"
        />
        Mindet kijelöl
      </label>

      <div class="market-cap-options">
        <label
          v-for="option in filteredOptions"
          :key="option.value"
          class="market-cap-option"
        >
          <input
            type="checkbox"
            :value="option.value"
            :checked="modelValue.includes(option.value)"
            @change="toggleOption(option.value)"
          />
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type MarketCapValue = 'small' | 'mid' | 'large'

interface MarketCapOption {
  value: MarketCapValue
  label: string
}

interface Props {
  modelValue: MarketCapValue[]
}

interface Emits {
  (e: 'update:modelValue', value: MarketCapValue[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)
const searchTerm = ref('')

const options: MarketCapOption[] = [
  { value: 'small', label: 'Small' },
  { value: 'mid', label: 'Mid' },
  { value: 'large', label: 'Large' }
]

const filteredOptions = computed(() => {
  return options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const formatLabel = (value: MarketCapValue): string => {
  const option = options.find(opt => opt.value === value)
  return option?.label || value
}

const toggleOption = (value: MarketCapValue) => {
  if (props.modelValue.includes(value)) {
    emit('update:modelValue', props.modelValue.filter(v => v !== value))
  } else {
    emit('update:modelValue', [...props.modelValue, value])
  }
}

const removeValue = (value: MarketCapValue) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== value))
}

const toggleSelectAll = (e: Event) => {
  const checkbox = e.target as HTMLInputElement
  if (checkbox.checked) {
    emit('update:modelValue', ['small', 'mid', 'large'])
  } else {
    emit('update:modelValue', [])
  }
}
</script>

<style scoped>
.market-cap-container {
  position: relative;
  outline: none;
}

.market-cap-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  position: relative;
}

.market-cap-chips-input {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
  flex: 1;
  min-height: 44px;
  align-items: center;
  cursor: pointer;
}

.market-cap-chips-input:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.market-cap-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #4b5563;
  flex: 1;
  min-width: 80px;
  padding: 0;
}

.market-cap-input::placeholder {
  color: #9ca3af;
}

.market-cap-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #667eea;
  color: white;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.market-cap-chip-text {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.market-cap-chip-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.market-cap-chip-remove:hover {
  transform: scale(1.2);
}

.market-cap-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #667eea;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.market-cap-search {
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
  color: #4b5563;
}

.market-cap-search::placeholder {
  color: #9ca3af;
}

.market-cap-search:focus {
  background-color: #f9fafb;
}

.market-cap-select-all {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  transition: background-color 0.2s ease;
}

.market-cap-select-all:hover {
  background-color: #f9fafb;
}

.market-cap-select-all input {
  cursor: pointer;
  accent-color: #667eea;
}

.market-cap-options {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
}

.market-cap-option {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
  transition: background-color 0.2s ease;
}

.market-cap-option:hover {
  background-color: #f9fafb;
}

.market-cap-option input {
  cursor: pointer;
  accent-color: #667eea;
}
</style>
