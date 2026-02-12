/**
 * Vue i18n configuration
 * Initializes Vue i18n with support for multiple languages (hu, en)
 * Includes localStorage persistence for language preference
 */

import { createI18n } from 'vue-i18n'
import type { I18n, I18nOptions } from 'vue-i18n'
import hu from './hu/messages.json'
import en from './en/messages.json'

export type MessageSchema = typeof hu

const options: I18nOptions = {
  legacy: false,
  locale: localStorage.getItem('app-language') || 'hu',
  fallbackLocale: 'hu',
  messages: {
    hu,
    en
  },
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
}

const i18n: I18n = createI18n<MessageSchema, 'hu' | 'en'>(options)

export default i18n
