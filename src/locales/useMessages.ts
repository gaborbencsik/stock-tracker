/**
 * Message helper utility for accessing translated strings
 * Provides type-safe access to all UI strings
 */

import { messages } from './messages'

/**
 * Get a message by dot-notation key path
 * @param key - Dot-notation path to the message (e.g., 'filters.search.label')
 * @param defaultValue - Fallback value if key is not found
 * @returns The translated message string
 */
export function getMessage(
  key: string,
  defaultValue?: string
): string {
  try {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue || key
      }
    }

    return typeof value === 'string' ? value : (defaultValue || key)
  } catch (error) {
    console.warn(`Message not found: ${key}`)
    return defaultValue || key
  }
}

/**
 * Composable for Vue components - provides reactive access to messages
 * Usage in Vue: const { msg } = useMessages()
 *              {{ msg('filters.search.label') }}
 */
export function useMessages() {
  return {
    msg: getMessage,
    messages
  }
}
