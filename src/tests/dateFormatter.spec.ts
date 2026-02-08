import { describe, it, expect } from 'vitest'
import { formatDateOnly, formatDateTime, formatDateLocalized } from '@/utils/dateFormatter'

describe('dateFormatter', () => {
  describe('formatDateOnly', () => {
    const cases: [string, string][] = [
      ['2026-01-15T14:22:00Z', '2026-01-15'],
      ['2026-02-08T10:30:00Z', '2026-02-08'],
      ['invalid-date', 'Invalid date'],
      ['', 'Invalid date'],
    ]
    it.each(cases)('should format "%s" to "%s"', (input, expected) => {
      expect(formatDateOnly(input)).toBe(expected)
    })
  })

  describe('formatDateOnly - line 14 isNaN check', () => {
    it('should pass isNaN validation and return formatted date', () => {
      const result = formatDateOnly('2026-12-25T10:30:00Z')
      expect(result).toBe('2026-12-25')
      expect(result).not.toBe('Invalid date')
    })
  })

  describe('formatDateTime', () => {
    const cases: [string, string | RegExp][] = [
      ['2026-01-15T14:22:00Z', /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/],
      ['not-a-date', 'Invalid date'],
      ['2026-01-05T09:05:00Z', /^\d{4}-01-05 \d{2}:05$/],
    ]
    it.each(cases)('should format "%s" correctly', (input, expected) => {
      const result = formatDateTime(input)
      if (expected instanceof RegExp) {
        expect(result).toMatch(expected)
      } else {
        expect(result).toBe(expected)
      }
    })
  })

  describe('formatDateTime - line 38 isNaN check', () => {
    it('should pass isNaN validation and return formatted date with time', () => {
      // Line 38: return 'Invalid date' after isNaN check passes for valid dates
      const result = formatDateTime('2026-12-25T15:45:30Z')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
      expect(result).not.toBe('Invalid date')
    })
  })

  describe('formatDateLocalized', () => {
    const cases: [string, string | string[]][] = [
      ['2026-01-15T14:22:00Z', ['2026', '15']],
      ['invalid', 'Invalid date'],
    ]
    it.each(cases)('should format "%s" correctly', (input, expected) => {
      const result = formatDateLocalized(input)
      if (Array.isArray(expected)) {
        expected.forEach(part => expect(result).toContain(part))
      } else {
        expect(result).toBe(expected)
      }
    })
  })
})
