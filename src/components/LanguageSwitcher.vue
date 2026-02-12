<template>
  <div class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang"
      :class="{ active: currentLanguage === lang }"
      @click="changeLanguage(lang)"
      class="lang-btn"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

const { locale } = useI18n()
const languages = ['hu', 'en']
const currentLanguage = ref(locale.value || 'hu')

const changeLanguage = (lang: string): void => {
  locale.value = lang as 'hu' | 'en'
  currentLanguage.value = lang
  localStorage.setItem('app-language', lang)
}

watch(locale, (newLocale) => {
  currentLanguage.value = newLocale || 'hu'
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 0.875rem;
  font-weight: 500;
}

.lang-btn.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.lang-btn:hover {
  border-color: #007bff;
}
</style>
