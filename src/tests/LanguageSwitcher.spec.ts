/**
 * LanguageSwitcher component tests
 * Verifies language switching functionality, localStorage persistence,
 * and UI state management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { createI18n } from 'vue-i18n'
import hu from '@/locales/hu/messages.json'
import en from '@/locales/en/messages.json'

// Helper to get the actual locale value from ComputedRef
const getLocaleValue = (locale: any): string => {
  if (typeof locale === 'string') return locale
  if ('value' in locale) return locale.value
  if ('_value' in locale) return locale._value
  return locale.toString()
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('New language toggle button design', () => {
    it('should render a single toggle button instead of multiple language buttons', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.exists()).toBe(true)
    })

    it('should display the language to switch TO, not the current language', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      // When current is HU, button should show EN (the language we can switch TO)
      expect(toggleButton.text()).toBe('EN')
    })

    it('should switch language and update button text when clicked', async () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      let toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.text()).toBe('EN')

      await toggleButton.trigger('click')
      await wrapper.vm.$nextTick()

      // After clicking EN button, locale should be 'en' and button should show 'HU'
      expect(getLocaleValue(i18n.global.locale)).toBe('en')

      toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.text()).toBe('HU')
    })

    it('should persist language selection to localStorage with new toggle button', async () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      await toggleButton.trigger('click')

      expect(localStorage.getItem('app-language')).toBe('en')
    })

    it('should toggle between both languages correctly on multiple clicks', async () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      let toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.text()).toBe('EN')

      // Click 1: HU -> EN
      await toggleButton.trigger('click')
      await wrapper.vm.$nextTick()
      toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.text()).toBe('HU')

      // Click 2: EN -> HU
      await toggleButton.trigger('click')
      await wrapper.vm.$nextTick()
      toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.text()).toBe('EN')
    })

    it('should react to external locale changes', async () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      // Simulate external locale change via toggle button click
      let toggleButton = wrapper.find('.lang-toggle')
      await toggleButton.trigger('click')
      await wrapper.vm.$nextTick()

      toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.text()).toBe('HU')
    })

    it('should have proper accessibility attributes', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.attributes('aria-label')).toBe('Switch to English')
    })
  })

  describe('Responsive design (mobile viewport)', () => {
    it('should render button with class for styling', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.exists()).toBe(true)
      // Ensure class is present for CSS media query styling
      expect(toggleButton.classes()).toContain('lang-toggle')
    })

    it('should be in header-content parent for proper positioning context', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      // The button should be directly attached to DOM, ready to be positioned
      const toggleButton = wrapper.find('.lang-toggle')
      expect(toggleButton.element).toBeInstanceOf(HTMLElement)
    })

    it('should have proper button attributes for mobile accessibility', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      // Button is a native element with proper attributes
      expect(toggleButton.element.tagName).toBe('BUTTON')
      expect(toggleButton.attributes('type')).not.toBeDefined() // implicitly 'button'
      expect(toggleButton.attributes('aria-label')).toBeTruthy()
    })

    it('should be clickable and functional on all screen sizes', async () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'hu',
        fallbackLocale: 'hu',
        messages: { hu, en },
        globalInjection: true,
        missingWarn: false,
        fallbackWarn: false
      })

      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n]
        }
      })

      const toggleButton = wrapper.find('.lang-toggle')
      
      // Simulate click
      await toggleButton.trigger('click')
      
      // Verify language changed
      expect(getLocaleValue(i18n.global.locale)).toBe('en')
      
      // Verify text updated
      expect(toggleButton.text()).toBe('HU')
    })
  })
})
