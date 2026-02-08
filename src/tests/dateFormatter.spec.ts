import { describe, it, expect } from 'vitest'
import { formatDateOnly, formatDateTime, formatDateLocalized } from '@/utils/dateFormatter'

describe('dateFormatter', () => {
  describe('formatDateOnly', () => {
    it('should format ISO date string to YYYY-MM-DD', () => {
      const result = formatDateOnly('2026-01-15T14:22:00Z')
      expect(result).toBe('2026-01-15')
    })

    it('should handle different time zones', () => {
      const result = formatDateOnly('2026-02-08T10:30:00Z')
      expect(result).toBe('2026-02-08')
    })

    it('should return "Invalid date" for invalid input', () => {
      const result = formatDateOnly('invalid-date')
      expect(result).toBe('Invalid date')
    })

    it('should return "Invalid date" for empty string', () => {
      const result = formatDateOnly('')
      expect(result).toBe('Invalid date')
    })
  })

  describe('formatDateTime', () => {
    it('should format ISO date string to YYYY-MM-DD HH:MM', () => {
      const result = formatDateTime('2026-01-15T14:22:00Z')
      // Note: This might vary based on timezone, so we check format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    })

    it('should return "Invalid date" for invalid input', () => {
      const result = formatDateTime('not-a-date')
      expect(result).toBe('Invalid date')
    })

    it('should pad single-digit values with zeros', () => {
      const result = formatDateTime('2026-01-05T09:05:00Z')
      expect(result).toMatch(/^\d{4}-01-05 \d{2}:05$/)
    })
  })

  describe('formatDateLocalized', () => {
    it('should format date in localized format', () => {
      const result = formatDateLocalized('2026-01-15T14:22:00Z')
      expect(result).toContain('2026')
      expect(result).toContain('15')
    })

    it('should return "Invalid date" for invalid input', () => {
      const result = formatDateLocalized('invalid')
      expect(result).toBe('Invalid date')
    })
  })
})
