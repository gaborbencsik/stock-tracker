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

  it('should render language buttons for both supported languages', () => {
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

    const buttons = wrapper.findAll('.lang-btn')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toContain('HU')
    expect(buttons[1].text()).toContain('EN')
  })

  it('should mark current locale as active', () => {
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

    const buttons = wrapper.findAll('.lang-btn')
    expect(buttons[0].classes()).toContain('active')
    expect(buttons[1].classes()).not.toContain('active')
  })

  it('should change locale when language button is clicked', async () => {
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

    const enButton = wrapper.findAll('.lang-btn')[1]
    await enButton.trigger('click')

    expect(getLocaleValue(i18n.global.locale)).toBe('en')
  })

  it('should persist language selection to localStorage', async () => {
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

    const enButton = wrapper.findAll('.lang-btn')[1]
    await enButton.trigger('click')

    expect(localStorage.getItem('app-language')).toBe('en')
  })

  it('should update active state after language change', async () => {
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

    let buttons = wrapper.findAll('.lang-btn')
    expect(buttons[0].classes()).toContain('active')
    expect(buttons[1].classes()).not.toContain('active')

    const enButton = buttons[1]
    await enButton.trigger('click')
    await wrapper.vm.$nextTick()

    buttons = wrapper.findAll('.lang-btn')
    expect(buttons[0].classes()).not.toContain('active')
    expect(buttons[1].classes()).toContain('active')
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

    // Simulate external locale change via click on en button
    const enButton = wrapper.findAll('.lang-btn')[1]
    await enButton.trigger('click')
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('.lang-btn')
    expect(buttons[1].classes()).toContain('active')
  })
})
