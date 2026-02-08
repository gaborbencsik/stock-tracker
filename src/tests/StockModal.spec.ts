import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StockModal from '@/components/StockModal.vue'
import { messages } from '@/locales/messages'
import type { Stock } from '@/types/Stock'

vi.mock('@/locales/useMessages', () => ({
  useMessages: () => ({
    messages,
    msg: (key: string) => key
  })
}))

describe('StockModal', () => {
  const mockStock: Stock = {
    id: 1,
    ticker: 'AAPL',
    name: 'Apple Inc.',
    stock_exchange: 'NASDAQ',
    currency: 'USD',
    market_cap: 'large',
    entry_price: 175.50,
    uplift_potential: 14.2,
    six_months_price_target: 195.00,
    twelve_months_price_target: 210.00,
    one_month_highest_price: 182.50,
    two_months_highest_price: 185.30,
    three_months_highest_price: 187.20,
    six_months_highest_price: 190.50,
    twelve_months_highest_price: 195.00,
    highest_price: 198.23,
    notes: 'Test notes',
    links: 'https://investor.apple.com, https://seekingalpha.com/symbol/AAPL',
    last_modified: '2026-02-08T10:30:00Z',
    created_at: '2026-01-15T14:22:00Z'
  }

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: false
        }
      })

      expect(wrapper.find('.modal-backdrop').exists()).toBe(false)
    })

    it('should render when isOpen is true', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.find('.modal-backdrop').exists()).toBe(true)
    })

    it('should display stock ticker', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('AAPL')
    })

    it('should display stock name', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('Apple Inc.')
    })

    it('should display entry price', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('175.50')
    })

    it('should display uplift potential', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('14.2%')
    })

    it('should display price targets', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('195.00')
      expect(wrapper.text()).toContain('210.00')
    })

    it('should display historical highs', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('182.50')
      expect(wrapper.text()).toContain('198.23')
    })

    it('should display notes when present', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('Test notes')
    })

    it('should not display notes section when notes are empty', () => {
      const stockWithoutNotes = { ...mockStock, notes: '' }
      const wrapper = mount(StockModal, {
        props: {
          stock: stockWithoutNotes,
          isOpen: true
        }
      })

      expect(wrapper.find('.notes-section').exists()).toBe(false)
    })

    it('should parse and display links', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      const links = wrapper.findAll('.link-chip')
      expect(links.length).toBeGreaterThan(0)
    })

    it('should display exchange and currency tags', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('NASDAQ')
      expect(wrapper.text()).toContain('USD')
    })
  })

  describe('interactions', () => {
    it('should emit close event when close button is clicked', async () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      await wrapper.find('.modal-close').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')?.length).toBe(1)
    })

    it('should emit close event when backdrop is clicked', async () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      await wrapper.find('.modal-backdrop').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not emit close when modal container is clicked', async () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      await wrapper.find('.modal-container').trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('potential class', () => {
    it('should apply positive class for positive potential', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      const potentialCard = wrapper.find('.potential-card')
      expect(potentialCard.classes()).toContain('positive')
    })

    it('should apply negative class for negative potential', () => {
      const negativeStock = { ...mockStock, uplift_potential: -5.3 }
      const wrapper = mount(StockModal, {
        props: {
          stock: negativeStock,
          isOpen: true
        }
      })

      const potentialCard = wrapper.find('.potential-card')
      expect(potentialCard.classes()).toContain('negative')
    })
  })

  describe('link parsing', () => {
    it('should correctly parse multiple links', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      const links = wrapper.findAll('.link-chip')
      expect(links.length).toBe(2)
    })

    it('should handle single link', () => {
      const singleLinkStock = { ...mockStock, links: 'https://example.com' }
      const wrapper = mount(StockModal, {
        props: {
          stock: singleLinkStock,
          isOpen: true
        }
      })

      const links = wrapper.findAll('.link-chip')
      expect(links.length).toBe(1)
    })

    it('should not display links section when links are empty', () => {
      const noLinksStock = { ...mockStock, links: '' }
      const wrapper = mount(StockModal, {
        props: {
          stock: noLinksStock,
          isOpen: true
        }
      })

      expect(wrapper.find('.links-section').exists()).toBe(false)
    })

    it('should have correct href attributes', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      const firstLink = wrapper.find('.link-chip')
      expect(firstLink.attributes('href')).toBeTruthy()
      expect(firstLink.attributes('target')).toBe('_blank')
      expect(firstLink.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  describe('null price targets handling', () => {
    it('should render correctly with null six_months_price_target', () => {
      const stockWithNullTarget = { ...mockStock, six_months_price_target: null }
      const wrapper = mount(StockModal, {
        props: {
          stock: stockWithNullTarget,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('N/A')
      expect(wrapper.exists()).toBe(true)
    })

    it('should render correctly with null twelve_months_price_target', () => {
      const stockWithNullTarget = { ...mockStock, twelve_months_price_target: null }
      const wrapper = mount(StockModal, {
        props: {
          stock: stockWithNullTarget,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('N/A')
    })

    it('should render correctly with null highest_price', () => {
      const stockWithNullHighest = { ...mockStock, highest_price: null }
      const wrapper = mount(StockModal, {
        props: {
          stock: stockWithNullHighest,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('Mindenkori legmagasabb')
      expect(wrapper.text()).toContain('N/A')
    })

    it('should render correctly with multiple null price fields', () => {
      const stockWithMultipleNulls = {
        ...mockStock,
        six_months_price_target: null,
        twelve_months_price_target: null,
        one_month_highest_price: null,
        three_months_highest_price: null
      }
      const wrapper = mount(StockModal, {
        props: {
          stock: stockWithMultipleNulls,
          isOpen: true
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('N/A')
    })
  })

  describe('market cap display', () => {
    it('should display market cap information', () => {
      const wrapper = mount(StockModal, {
        props: {
          stock: mockStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('large')
    })

    it('should handle small market cap', () => {
      const smallCapStock = { ...mockStock, market_cap: 'small' as const }
      const wrapper = mount(StockModal, {
        props: {
          stock: smallCapStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('small')
    })

    it('should handle mid market cap', () => {
      const midCapStock = { ...mockStock, market_cap: 'mid' as const }
      const wrapper = mount(StockModal, {
        props: {
          stock: midCapStock,
          isOpen: true
        }
      })

      expect(wrapper.text()).toContain('mid')
    })
  })
})
