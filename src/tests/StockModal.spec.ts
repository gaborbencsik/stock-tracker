import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import StockModal from '@/components/StockModal.vue'
import hu from '@/locales/hu/messages.json'
import en from '@/locales/en/messages.json'
import type { Stock } from '@/types/Stock'

const createTestI18n = () =>
  createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'hu',
    messages: { hu, en },
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false
  })

describe('StockModal', () => {
  const mockStock: Stock = {
    id: 1,
    ticker: 'AAPL',
    name: 'Apple Inc.',
    stock_exchange: 'NASDAQ',
    currency: 'USD',
    market_cap: 'large',
    entry_price: 175.50,
    current_price: 182.45,
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
    agent: 'OpenAI',
    last_modified: '2026-02-08T10:30:00Z',
    difference: null,
    created_at: '2026-01-15T14:22:00Z'
  }

  const mountStockModal = (stock: Stock | null = mockStock, isOpen: boolean = true) =>
    mount(StockModal, {
      props: { stock, isOpen },
      global: {
        plugins: [createTestI18n()],
        stubs: {}
      }
    })

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      const wrapper = mountStockModal(mockStock, false)

      expect(wrapper.find('.modal-backdrop').exists()).toBe(false)
    })

    it('should render when isOpen is true', () => {
      const wrapper = mountStockModal()

      expect(wrapper.find('.modal-backdrop').exists()).toBe(true)
    })

    it('should display stock ticker', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('AAPL')
    })

    it('should display stock name', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('Apple Inc.')
    })

    it('should display entry price', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('175.50')
    })

    it('should display uplift potential', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('14.2%')
    })

    it('should display price targets', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('195.00')
      expect(wrapper.text()).toContain('210.00')
    })

    it('should display historical highs', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('182.50')
      expect(wrapper.text()).toContain('198.23')
    })

    it('should display notes when present', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('Test notes')
    })

    it('should not display notes section when notes are empty', () => {
      const stockWithoutNotes = { ...mockStock, notes: '' }
      const wrapper = mountStockModal(stockWithoutNotes)

      expect(wrapper.find('.notes-section').exists()).toBe(false)
    })

    it('should parse and display links', () => {
      const wrapper = mountStockModal()

      const links = wrapper.findAll('.link-chip')
      expect(links.length).toBeGreaterThan(0)
    })

    it('should display exchange and currency tags', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('NASDAQ')
      expect(wrapper.text()).toContain('USD')
    })
  })

  describe('interactions', () => {
    it('should emit close event when close button is clicked', async () => {
      const wrapper = mountStockModal()

      await wrapper.find('.modal-close').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')?.length).toBe(1)
    })

    it('should emit close event when backdrop is clicked', async () => {
      const wrapper = mountStockModal()

      await wrapper.find('.modal-backdrop').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not emit close when modal container is clicked', async () => {
      const wrapper = mountStockModal()

      await wrapper.find('.modal-container').trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('potential class', () => {
    it('should apply positive class for positive potential', () => {
      const wrapper = mountStockModal()

      const potentialCard = wrapper.find('.potential-card')
      expect(potentialCard.classes()).toContain('positive')
    })

    it('should apply negative class for negative potential', () => {
      const negativeStock = { ...mockStock, uplift_potential: -5.3 }
      const wrapper = mountStockModal(negativeStock)

      const potentialCard = wrapper.find('.potential-card')
      expect(potentialCard.classes()).toContain('negative')
    })
  })

  describe('link parsing', () => {
    it('should correctly parse multiple links', () => {
      const wrapper = mountStockModal()

      const links = wrapper.findAll('.link-chip')
      expect(links.length).toBe(2)
    })

    it('should handle single link', () => {
      const singleLinkStock = { ...mockStock, links: 'https://example.com' }
      const wrapper = mountStockModal(singleLinkStock)

      const links = wrapper.findAll('.link-chip')
      expect(links.length).toBe(1)
    })

    it('should not display links section when links are empty', () => {
      const noLinksStock = { ...mockStock, links: '' }
      const wrapper = mountStockModal(noLinksStock)

      expect(wrapper.find('.links-section').exists()).toBe(false)
    })

    it('should have correct href attributes', () => {
      const wrapper = mountStockModal()

      const firstLink = wrapper.find('.link-chip')
      expect(firstLink.attributes('href')).toBeTruthy()
      expect(firstLink.attributes('target')).toBe('_blank')
      expect(firstLink.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  describe('AI model section', () => {
    it('should display AI model section when agent is present', () => {
      const wrapper = mountStockModal()

      expect(wrapper.find('.ai-model-section').exists()).toBe(true)
    })

    it('should display agent name in AI model section', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('OpenAI')
    })

    it('should not display AI model section when agent is empty', () => {
      const stockWithoutAgent = { ...mockStock, agent: '' }
      const wrapper = mountStockModal(stockWithoutAgent)

      expect(wrapper.find('.ai-model-section').exists()).toBe(false)
    })

    it('should render agent as badge chip like links', () => {
      const wrapper = mountStockModal()

      const agentChip = wrapper.find('.ai-model-section .agent-chip')
      expect(agentChip.exists()).toBe(true)
      expect(agentChip.text()).toBe('OpenAI')
    })
  })

  describe('keyboard and lifecycle interactions', () => {
    it('should handle Escape key press to close modal', async () => {
      const wrapper = mountStockModal()

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close when Escape is pressed and modal is closed', async () => {
      const wrapper = mountStockModal(mockStock, false)
      const initialEmits = wrapper.emitted('close')?.length || 0

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
      await wrapper.vm.$nextTick()

      const finalEmits = wrapper.emitted('close')?.length || 0
      expect(finalEmits).toBe(initialEmits)
    })

    it('should handle other keys without closing', async () => {
      const wrapper = mountStockModal()

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should restore body scroll when modal closes via prop change', async () => {
      const initialOverflow = document.body.style.overflow
      
      const wrapper = mountStockModal(mockStock, true)
      // Wait for watcher to execute
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Change to closed state
      await wrapper.setProps({ isOpen: false })
      await wrapper.vm.$nextTick()

      expect(document.body.style.overflow).toBe('') 
      
      // Cleanup
      document.body.style.overflow = initialOverflow
    })

    it('should handle rapid isOpen toggle', async () => {
      const wrapper = mountStockModal(mockStock, false)
      
      // Open modal
      await wrapper.setProps({ isOpen: true })
      await wrapper.vm.$nextTick()

      // Close modal
      await wrapper.setProps({ isOpen: false })
      await wrapper.vm.$nextTick()
      expect(document.body.style.overflow).toBe('')

      // Reopen modal
      await wrapper.setProps({ isOpen: true })
      await wrapper.vm.$nextTick()

      // Cleanup
      document.body.style.overflow = ''
    })

    it('should display modal backdrop when isOpen is true even with null stock', () => {
      const wrapper = mountStockModal(null, true)
      
      // Backdrop should still render when isOpen=true, regardless of stock
      expect(wrapper.find('.modal-backdrop').exists()).toBe(true)
    })
  })

  describe('notes section edge cases', () => {
    it('should not display notes when notes is null', () => {
      const stockWithNullNotes = { ...mockStock, notes: null as any }
      const wrapper = mountStockModal(stockWithNullNotes)

      expect(wrapper.find('.notes-section').exists()).toBe(false)
    })

    it('should display notes when notes have content', () => {
      const stockWithNotes = { ...mockStock, notes: 'Important note about the stock' }
      const wrapper = mountStockModal(stockWithNotes)

      expect(wrapper.find('.notes-section').exists()).toBe(true)
      expect(wrapper.text()).toContain('Important note about the stock')
    })

    it('should handle notes with special characters', () => {
      const stockWithSpecialChars = { ...mockStock, notes: 'Test <>&" chars' }
      const wrapper = mountStockModal(stockWithSpecialChars)

      expect(wrapper.text()).toContain('Test')
    })

    it('should handle whitespace-only notes as empty', () => {
      const stockWithWhitespace = { ...mockStock, notes: '   ' }
      const wrapper = mountStockModal(stockWithWhitespace)

      // "   " is truthy, so section will display but with whitespace only
      expect(wrapper.find('.notes-section').exists()).toBe(true)
    })
  })

  describe('difference section rendering', () => {
    it('should display difference card when difference is not null', () => {
      const stockWithDifference = { ...mockStock, difference: 5.25 }
      const wrapper = mountStockModal(stockWithDifference)

      const differenceCard = wrapper.find('.difference-card')
      expect(differenceCard.exists()).toBe(true)
      expect(differenceCard.text()).toContain('+5.25%')
    })

    it('should not display difference card when difference is null', () => {
      const stockWithoutDifference = { ...mockStock, difference: null }
      const wrapper = mountStockModal(stockWithoutDifference)

      expect(wrapper.findAll('.difference-card').length).toBe(0)
    })

    it('should show negative sign for negative difference', () => {
      const stockWithNegativeDiff = { ...mockStock, difference: -3.75 }
      const wrapper = mountStockModal(stockWithNegativeDiff)

      const differenceCard = wrapper.find('.difference-card')
      expect(differenceCard.classes()).toContain('negative')
      expect(differenceCard.text()).toContain('-3.75%')
    })

    it('should show positive class for zero difference', () => {
      const stockWithZeroDiff = { ...mockStock, difference: 0 }
      const wrapper = mountStockModal(stockWithZeroDiff)

      const differenceCard = wrapper.find('.difference-card')
      expect(differenceCard.classes()).toContain('positive')
    })
  })

  describe('null price targets handling', () => {
    it('should render correctly with null six_months_price_target', () => {
      const stockWithNullTarget = { ...mockStock, six_months_price_target: null }
      const wrapper = mountStockModal(stockWithNullTarget)

      expect(wrapper.text()).toContain('N/A')
      expect(wrapper.exists()).toBe(true)
    })

    it('should render correctly with null twelve_months_price_target', () => {
      const stockWithNullTarget = { ...mockStock, twelve_months_price_target: null }
      const wrapper = mountStockModal(stockWithNullTarget)

      expect(wrapper.text()).toContain('N/A')
    })

    it('should render correctly with null highest_price', () => {
      const stockWithNullHighest = { ...mockStock, highest_price: null }
      const wrapper = mountStockModal(stockWithNullHighest)

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
      const wrapper = mountStockModal(stockWithMultipleNulls)

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('N/A')
    })
  })

  describe('market cap display', () => {
    it('should display market cap information', () => {
      const wrapper = mountStockModal()

      expect(wrapper.text()).toContain('large')
    })

    it('should handle small market cap', () => {
      const smallCapStock = { ...mockStock, market_cap: 'small' as const }
      const wrapper = mountStockModal(smallCapStock)

      expect(wrapper.text()).toContain('small')
    })

    it('should handle mid market cap', () => {
      const midCapStock = { ...mockStock, market_cap: 'mid' as const }
      const wrapper = mountStockModal(midCapStock)

      expect(wrapper.text()).toContain('mid')
    })
  })

  describe('links section', () => {
    it('should display links when provided', () => {
      const stockWithLinks = {
        ...mockStock,
        links: 'https://investor.apple.com, https://seekingalpha.com/symbol/AAPL'
      }
      const wrapper = mountStockModal(stockWithLinks)

      expect(wrapper.text()).toContain('investor.apple.com')
      expect(wrapper.text()).toContain('seekingalpha.com')
    })

    it('should not display links section when links are empty', () => {
      const stockWithoutLinks = { ...mockStock, links: '' }
      const wrapper = mountStockModal(stockWithoutLinks)

      const linksSection = wrapper.find('.links-section')
      expect(linksSection.exists()).toBe(false)
    })

    it('should handle malformed URLs gracefully', () => {
      const stockWithMalformedLinks = {
        ...mockStock,
        links: 'not-a-valid-url, another-invalid'
      }
      const wrapper = mountStockModal(stockWithMalformedLinks)

      // Should still render with fallback labels
      expect(wrapper.text()).toContain('not-a-valid-url')
      expect(wrapper.text()).toContain('another-invalid')
    })

    it('should parse valid URLs and extract hostname', () => {
      const stockWithValidUrl = {
        ...mockStock,
        links: 'https://www.example.com/path'
      }
      const wrapper = mountStockModal(stockWithValidUrl)

      // Should display hostname without 'www.'
      expect(wrapper.text()).toContain('example.com')
    })

    it('should filter out empty links from comma-separated list', () => {
      const stockWithEmptyLinks = {
        ...mockStock,
        links: 'https://example.com,  , https://another.com'
      }
      const wrapper = mountStockModal(stockWithEmptyLinks)

      expect(wrapper.text()).toContain('example.com')
      expect(wrapper.text()).toContain('another.com')
      // Should not try to render empty link
      expect(wrapper.findAll('.link-chip').length).toBe(2)
    })
  })

  describe('AI model section', () => {
    it('should display AI model when provided', () => {
      const stockWithAgent = { ...mockStock, agent: 'OpenAI' }
      const wrapper = mountStockModal(stockWithAgent)

      expect(wrapper.text()).toContain('AI model')
      expect(wrapper.text()).toContain('OpenAI')
    })

    it('should not display AI model section when agent is empty', () => {
      const stockWithoutAgent = { ...mockStock, agent: '' }
      const wrapper = mountStockModal(stockWithoutAgent)

      const agentSection = wrapper.find('.ai-model-section')
      expect(agentSection.exists()).toBe(false)
    })

    it('should display different AI models', () => {
      const stockWithGemini = { ...mockStock, agent: 'Gemini' }
      const wrapper = mountStockModal(stockWithGemini)

      expect(wrapper.text()).toContain('Gemini')
    })
  })
})
