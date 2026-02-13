<template>
  <button
    class="lang-toggle"
    @click="toggleLanguage"
    :aria-label="ariaLabel"
  >
    {{ nextLanguage.toUpperCase() }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch, computed } from 'vue'

const { locale } = useI18n()
const currentLanguage = ref<'hu' | 'en'>(locale.value as 'hu' | 'en' || 'hu')

const nextLanguage = computed((): 'hu' | 'en' => {
  return currentLanguage.value === 'hu' ? 'en' : 'hu'
})

const ariaLabel = computed((): string => {
  return `Switch to ${nextLanguage.value === 'hu' ? 'Hungarian' : 'English'}`
})

const toggleLanguage = (): void => {
  const newLocale = nextLanguage.value
  locale.value = newLocale
  currentLanguage.value = newLocale
  localStorage.setItem('app-language', newLocale)
}

watch(locale, (newLocale) => {
  currentLanguage.value = (newLocale || 'hu') as 'hu' | 'en'
})
</script>

<style scoped>
.lang-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: 40px;
  z-index: 100;
}

.lang-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.lang-toggle:active {
  transform: scale(0.98);
}

/* Mobile viewport (< 768px) */
@media (max-width: 767px) {
  .lang-toggle {
    top: 16px;
    right: 16px;
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>
