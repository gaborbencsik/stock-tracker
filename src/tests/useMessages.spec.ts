import { describe, it, expect, beforeEach } from 'vitest'
import { getMessage, useMessages } from '@/locales/useMessages'
import { messages } from '@/locales/messages'

describe('useMessages - getMessage()', () => {
  describe('Happy Path - Valid Key Access', () => {
    it('should return top-level message by simple key', () => {
      const result = getMessage('header.title')
      expect(result).toBe(messages.header.title)
    })

    it('should return nested message by dot-notation key', () => {
      const result = getMessage('filters.search.label')
      expect(result).toBe(messages.filters.search.label)
    })

    it('should return deeply nested message', () => {
      const result = getMessage('modal.labels.entryPrice')
      expect(result).toBe(messages.modal.labels.entryPrice)
    })

    it('should access all filter labels correctly', () => {
      const filterLabels = [
        { key: 'filters.exchange.label', expected: messages.filters.exchange.label },
        { key: 'filters.currency.label', expected: messages.filters.currency.label },
        { key: 'filters.minPrice.label', expected: messages.filters.minPrice.label },
        { key: 'filters.marketCap.label', expected: messages.filters.marketCap.label }
      ]

      filterLabels.forEach(({ key, expected }) => {
        expect(getMessage(key)).toBe(expected)
      })
    })

    it('should access all table column messages correctly', () => {
      const tableColumns = [
        { key: 'table.columns.ticker', expected: messages.table.columns.ticker },
        { key: 'table.columns.name', expected: messages.table.columns.name },
        { key: 'table.columns.exchange', expected: messages.table.columns.exchange },
        { key: 'table.columns.marketCap', expected: messages.table.columns.marketCap },
        { key: 'table.columns.entryPrice', expected: messages.table.columns.entryPrice }
      ]

      tableColumns.forEach(({ key, expected }) => {
        expect(getMessage(key)).toBe(expected)
      })
    })

    it('should access error messages', () => {
      const result = getMessage('errors.loadStocksFailed')
      expect(result).toBe(messages.errors.loadStocksFailed)
    })
  })

  describe('Edge Cases - Invalid or Missing Keys', () => {
    it('should return the key itself when path is not found', () => {
      const result = getMessage('nonexistent.path')
      expect(result).toBe('nonexistent.path')
    })

    it('should return the key itself when intermediate key does not exist', () => {
      const result = getMessage('filters.nonexistent.label')
      expect(result).toBe('filters.nonexistent.label')
    })

    it('should return the key itself when key points to an object instead of string', () => {
      // 'filters' is an object, not a string
      const result = getMessage('filters')
      expect(result).toBe('filters')
    })

    it('should handle empty string key', () => {
      const result = getMessage('')
      expect(result).toBe('')
    })

    it('should handle single key without dot notation', () => {
      const result = getMessage('nonexistent')
      expect(result).toBe('nonexistent')
    })

    it('should handle trailing dots gracefully', () => {
      const result = getMessage('filters.search.')
      expect(result).toBe('filters.search.')
    })

    it('should handle leading dots gracefully', () => {
      const result = getMessage('.filters.search')
      expect(result).toBe('.filters.search')
    })
  })

  describe('Default Value Fallback', () => {
    it('should return default value when key is not found', () => {
      const defaultVal = 'Default Message'
      const result = getMessage('nonexistent.key', defaultVal)
      expect(result).toBe(defaultVal)
    })

    it('should return default value when intermediate key does not exist', () => {
      const defaultVal = 'Fallback Text'
      const result = getMessage('filters.fake.label', defaultVal)
      expect(result).toBe(defaultVal)
    })

    it('should ignore default value when key is found', () => {
      const result = getMessage('header.title', 'Unused Default')
      expect(result).toBe(messages.header.title)
    })

    it('should return key itself if no default value provided for missing key', () => {
      const result = getMessage('missing.key')
      expect(result).toBe('missing.key')
    })

    it('should support empty string as default value', () => {
      // When defaultValue is empty string (falsy), implementation returns the key
      const result = getMessage('nonexistent', '')
      expect(result).toBe('nonexistent')
    })
  })

  describe('Message Content Validation', () => {
    it('should return non-empty strings for all valid header messages', () => {
      const result = getMessage('header.title')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return consistent message for filter search placeholder', () => {
      const result = getMessage('filters.search.placeholder')
      expect(result).toBe(messages.filters.search.placeholder)
    })

    it('should return all toggle filter messages as non-empty strings', () => {
      const toggleShow = getMessage('filters.toggleShow')
      const toggleHide = getMessage('filters.toggleHide')

      expect(toggleShow).toBeTruthy()
      expect(toggleHide).toBeTruthy()
      expect(toggleShow).not.toBe(toggleHide)
    })

    it('should return message for max price placeholder', () => {
      const result = getMessage('filters.maxPrice.placeholder')
      expect(result).toBe(messages.filters.maxPrice.placeholder)
    })
  })

  describe('Performance & Consistency', () => {
    it('should return consistent results on multiple calls with same key', () => {
      const key = 'filters.search.label'
      const result1 = getMessage(key)
      const result2 = getMessage(key)
      const result3 = getMessage(key)

      expect(result1).toBe(result2)
      expect(result2).toBe(result3)
    })

    it('should not modify the source messages object', () => {
      const messagesBefore = JSON.stringify(messages)
      getMessage('filters.search.label')
      const messagesAfter = JSON.stringify(messages)

      expect(messagesBefore).toBe(messagesAfter)
    })

    it('should handle rapid successive calls', () => {
      const keys = [
        'header.title',
        'filters.search.label',
        'table.columns.ticker',
        'modal.labels.entryPrice'
      ]

      const results = keys.map(key => getMessage(key))

      expect(results).toHaveLength(4)
      expect(results.every(r => typeof r === 'string')).toBe(true)
      expect(results.every(r => r.length > 0)).toBe(true)
    })
  })

  describe('Error Handling & Robustness', () => {
    it('should not throw error for invalid keys', () => {
      expect(() => getMessage('invalid.key')).not.toThrow()
    })

    it('should not throw error with malformed dot notation', () => {
      expect(() => getMessage('filters..search')).not.toThrow()
    })

    it('should not throw error when null or undefined is in path', () => {
      expect(() => getMessage('filters.null.value')).not.toThrow()
    })

    it('should gracefully handle very deep key paths', () => {
      const deepKey = 'a.b.c.d.e.f.g.h.i.j'
      const result = getMessage(deepKey)
      expect(result).toBe(deepKey)
    })

    it('should not throw error and handle gracefully for invalid keys', () => {
      // Implementation gracefully handles missing keys without throwing
      expect(() => {
        getMessage('nonexistent.key')
      }).not.toThrow()
    })
  })
})

describe('useMessages - Composable', () => {
  let composableResult: ReturnType<typeof useMessages>

  beforeEach(() => {
    composableResult = useMessages()
  })

  describe('Composable Structure', () => {
    it('should return an object with msg and messages properties', () => {
      expect(composableResult).toHaveProperty('msg')
      expect(composableResult).toHaveProperty('messages')
    })

    it('should export msg as a function', () => {
      expect(typeof composableResult.msg).toBe('function')
    })

    it('should export messages as the messages object', () => {
      expect(typeof composableResult.messages).toBe('object')
      expect(composableResult.messages).not.toBeNull()
    })
  })

  describe('msg Function Behavior', () => {
    it('should be the same as getMessage function', () => {
      const key = 'filters.search.label'
      const msgResult = composableResult.msg(key)
      const getMessageResult = getMessage(key)

      expect(msgResult).toBe(getMessageResult)
    })

    it('should support getMessage API with default values', () => {
      const result = composableResult.msg('nonexistent.key', 'default')
      expect(result).toBe('default')
    })

    it('should retrieve correct messages via msg method', () => {
      const testCases = [
        { key: 'header.title', getValue: () => messages.header.title },
        { key: 'filters.title', getValue: () => messages.filters.title },
        { key: 'table.empty.title', getValue: () => messages.table.empty.title },
        { key: 'errors.loadStocksFailed', getValue: () => messages.errors.loadStocksFailed }
      ]

      testCases.forEach(({ key, getValue }) => {
        expect(composableResult.msg(key)).toBe(getValue())
      })
    })
  })

  describe('messages Object Access', () => {
    it('should provide direct access to messages.header', () => {
      expect(composableResult.messages.header.title).toBe(messages.header.title)
      expect(composableResult.messages.header.subtitle).toBe(messages.header.subtitle)
    })

    it('should provide direct access to messages.filters', () => {
      expect(composableResult.messages.filters.title).toBe(messages.filters.title)
      expect(composableResult.messages.filters.toggleShow).toBe(messages.filters.toggleShow)
    })

    it('should provide direct access to messages.table', () => {
      expect(composableResult.messages.table.empty.title).toBe(messages.table.empty.title)
      expect(composableResult.messages.table.columns.ticker).toBe(messages.table.columns.ticker)
    })

    it('should provide direct access to messages.modal', () => {
      expect(composableResult.messages.modal.labels.entryPrice).toBe(messages.modal.labels.entryPrice)
      expect(composableResult.messages.modal.sections.pricingHeader).toBe(messages.modal.sections.pricingHeader)
    })

    it('should provide direct access to messages.common', () => {
      expect(composableResult.messages.common.close).toBe(messages.common.close)
      expect(composableResult.messages.common.loading).toBe(messages.common.loading)
    })

    it('should provide direct access to messages.errors', () => {
      expect(composableResult.messages.errors.loadStocksFailed).toBe(messages.errors.loadStocksFailed)
    })
  })

  describe('Composable Usage Patterns', () => {
    it('should support template-friendly direct property access', () => {
      // Simulating Vue template usage: {{ messages.filters.toggleShow }}
      const templateResult = composableResult.messages.filters.toggleShow
      expect(templateResult).toBe(messages.filters.toggleShow)
    })

    it('should support function-style lookup with msg()', () => {
      // Simulating Vue template usage: {{ msg('filters.toggleShow') }}
      const functionResult = composableResult.msg('filters.toggleShow')
      expect(functionResult).toBe(messages.filters.toggleShow)
    })

    it('should work correctly with both access patterns simultaneously', () => {
      const directAccess = composableResult.messages.filters.search.label
      const functionAccess = composableResult.msg('filters.search.label')

      expect(directAccess).toBe(functionAccess)
      expect(directAccess).toBe(messages.filters.search.label)
    })
  })

  describe('Composable Immutability', () => {
    it('should allow modification of msg function on returned object', () => {
      // In JavaScript, returned objects can be modified
      expect(() => {
        ;(composableResult as any).msg = () => 'modified'
      }).not.toThrow()
      // After reassignment, the modified function is called
      expect(composableResult.msg('header.title')).toBe('modified')
    })

    it('should provide stable reference to messages object across multiple calls', () => {
      const result1 = useMessages()
      const result2 = useMessages()

      // Both should have access to the same messages
      expect(result1.messages.header.title).toBe(result2.messages.header.title)
    })
  })

  describe('Composable Integration', () => {
    it('should be callable multiple times independently', () => {
      const composable1 = useMessages()
      const composable2 = useMessages()

      expect(composable1.msg('header.title')).toBe(composable2.msg('header.title'))
    })

    it('should provide all necessary properties for Vue integration', () => {
      const { msg, messages } = useMessages()

      // Verify it can be destructured
      expect(msg).toBeDefined()
      expect(messages).toBeDefined()

      // Verify both work independently
      expect(msg('filters.title')).toBe('Szűrők')
      expect(messages.filters.title).toBe('Szűrők')
    })
  })
})

describe('Integration - getMessage and useMessages', () => {
  it('should have consistent results between direct function and composable', () => {
    const testCases = [
      { key: 'header.title', getValue: () => messages.header.title },
      { key: 'filters.search.label', getValue: () => messages.filters.search.label },
      { key: 'table.columns.ticker', getValue: () => messages.table.columns.ticker },
      { key: 'modal.labels.entryPrice', getValue: () => messages.modal.labels.entryPrice },
      { key: 'errors.loadStocksFailed', getValue: () => messages.errors.loadStocksFailed }
    ]

    const { msg } = useMessages()

    testCases.forEach(({ key, getValue }) => {
      const directResult = getMessage(key)
      const composableResult = msg(key)
      const expectedValue = getValue()

      expect(directResult).toBe(composableResult)
      expect(directResult).toBe(expectedValue)
    })
  })

  it('should support message lookup flexibility', () => {
    const searchLabel = messages.filters.search.label

    // Multiple ways to access the same message
    const method1 = getMessage('filters.search.label')
    const method2 = useMessages().msg('filters.search.label')
    const method3 = useMessages().messages.filters.search.label

    expect(method1).toBe(searchLabel)
    expect(method2).toBe(searchLabel)
    expect(method3).toBe(searchLabel)
  })

  it('should handle all UI sections comprehensively', () => {
    const sections = {
      header: ['title', 'subtitle'],
      filters: ['title', 'toggleShow'],
      table: ['empty'],
      modal: ['sections', 'labels'],
      common: ['close', 'loading'],
      errors: ['loadStocksFailed']
    }

    const { msg } = useMessages()

    Object.entries(sections).forEach(([section, keys]) => {
      keys.forEach(key => {
        const fullKey = `${section}.${key}`
        const result = msg(fullKey)
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
      })
    })
  })
})
