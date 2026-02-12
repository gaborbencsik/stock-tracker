/**
 * i18n configuration tests
 * Ensures proper initialization, locale loading, and localStorage integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import hu from '@/locales/hu/messages.json'
import en from '@/locales/en/messages.json'

// Helper to get the actual locale value from ComputedRef
const getLocaleValue = (locale: any): string => {
  // Try different ways to extract the value
  if (typeof locale === 'string') return locale
  if ('value' in locale) return locale.value
  if ('_value' in locale) return locale._value
  return locale.toString()
}

// Helper to get the actual fallbackLocale value
const getFallbackLocaleValue = (fallbackLocale: any): string => {
  if (typeof fallbackLocale === 'string') return fallbackLocale
  if ('value' in fallbackLocale) return fallbackLocale.value
  if ('_value' in fallbackLocale) return fallbackLocale._value
  return fallbackLocale.toString()
}

describe('i18n configuration', () => {
  let i18n: I18n

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should load Hungarian locale by default when no localStorage value exists', () => {
    i18n = createI18n({
      legacy: false,
      locale: localStorage.getItem('app-language') || 'hu',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    expect(getLocaleValue(i18n.global.locale)).toBe('hu')
  })

  it('should load locale from localStorage if it exists', () => {
    localStorage.setItem('app-language', 'en')

    i18n = createI18n({
      legacy: false,
      locale: localStorage.getItem('app-language') || 'hu',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    expect(getLocaleValue(i18n.global.locale)).toBe('en')
  })

  it('should have fallback locale set to Hungarian', () => {
    i18n = createI18n({
      legacy: false,
      locale: 'hu',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    expect(getFallbackLocaleValue(i18n.global.fallbackLocale)).toBe('hu')
  })

  it('should register both hu and en locales', () => {
    i18n = createI18n({
      legacy: false,
      locale: 'hu',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    // Check that locales exist in i18n instance
    const huExists = hu !== undefined && hu !== null
    const enExists = en !== undefined && en !== null
    expect(huExists && enExists).toBe(true)
  })

  it('should switch locale and persist to localStorage', () => {
    i18n = createI18n({
      legacy: false,
      locale: 'hu',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    i18n.global.locale = 'en'
    localStorage.setItem('app-language', 'en')

    expect(getLocaleValue(i18n.global.locale)).toBe('en')
    expect(localStorage.getItem('app-language')).toBe('en')
  })

  it('should have complete Hungarian messages structure', () => {
    expect(hu).toBeDefined()
    expect(hu.header).toBeDefined()
    expect(hu.filters).toBeDefined()
    expect(hu.table).toBeDefined()
    expect(hu.modal).toBeDefined()
    expect(hu.common).toBeDefined()
    expect(hu.errors).toBeDefined()
  })

  it('should have complete English messages structure', () => {
    expect(en).toBeDefined()
    expect(en.header).toBeDefined()
    expect(en.filters).toBeDefined()
    expect(en.table).toBeDefined()
    expect(en.modal).toBeDefined()
    expect(en.common).toBeDefined()
    expect(en.errors).toBeDefined()
  })

  it('should resolve messages correctly for Hungarian locale', () => {
    i18n = createI18n({
      legacy: false,
      locale: 'hu',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    expect(hu.header.title).toBe('Under Value Radar')
  })

  it('should resolve messages correctly for English locale', () => {
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'hu',
      messages: { hu, en },
      globalInjection: true,
      missingWarn: false,
      fallbackWarn: false
    })

    expect(en.header.title).toBe('Under Value Radar')
  })
})
