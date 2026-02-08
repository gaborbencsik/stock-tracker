import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MarketCapSelect from '@/components/MarketCapSelect.vue'
import { messages } from '@/locales/messages'

vi.mock('@/locales/useMessages', () => ({
  useMessages: () => ({
    messages,
    msg: (key: string) => key
  })
}))

describe('MarketCapSelect', () => {
  const defaultProps = {
    modelValue: [] as Array<'small' | 'mid' | 'large'>
  }

  const createComponent = (props = {}) => {
    return mount(MarketCapSelect, {
      props: {
        ...defaultProps,
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the input field', () => {
      const wrapper = createComponent()
      expect(wrapper.find('.market-cap-input').exists()).toBe(true)
    })

    it('should display "Piaci érték" placeholder when no values selected', () => {
      const wrapper = createComponent()
      const input = wrapper.find('.market-cap-input')
      expect(input.attributes('placeholder')).toBeTruthy()
    })

    it('should not show dropdown by default', () => {
      const wrapper = createComponent()
      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(false)
    })
  })

  describe('dropdown toggle', () => {
    it('should show dropdown when input area clicked', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(true)
    })

    it('should hide dropdown when input area clicked again', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')
      await chipsInput.trigger('click')

      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(false)
    })

    it('should hide dropdown when clicking outside', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')
      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(true)

      await wrapper.find('.market-cap-container').trigger('blur')

      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(false)
    })
  })

  describe('search functionality', () => {
    it('should render search input when dropdown is open', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      expect(wrapper.find('.market-cap-search').exists()).toBe(true)
      expect(wrapper.find('.market-cap-search').attributes('placeholder')).toBe('Keresés...')
    })

    it('should filter options based on search term', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const search = wrapper.find('.market-cap-search')
      await search.setValue('mid')

      const options = wrapper.findAll('.market-cap-option')
      expect(options.length).toBe(1)
      expect(options[0].text()).toContain('Mid')
    })

    it('should show all options when search is empty', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const search = wrapper.find('.market-cap-search')
      await search.setValue('mid')
      await search.setValue('')

      const options = wrapper.findAll('.market-cap-option')
      expect(options.length).toBe(3)
    })
  })

  describe('select all functionality', () => {
    it('should render select all checkbox', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const selectAll = wrapper.find('.market-cap-select-all')
      expect(selectAll.exists()).toBe(true)
      expect(selectAll.text()).toContain('Mindet kijelöl')
    })

    it('should select all options when select all is clicked', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const selectAllCheckbox = wrapper.find('.market-cap-select-all input')
      await selectAllCheckbox.setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')!
      expect((emitted[emitted.length - 1][0] as string[]).length).toBe(3)
    })

    it('should deselect all options when select all is unchecked', async () => {
      const wrapper = createComponent({ modelValue: ['small', 'mid', 'large'] })
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const selectAllCheckbox = wrapper.find('.market-cap-select-all input')
      await selectAllCheckbox.setValue(false)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')!
      expect((emitted[emitted.length - 1][0] as string[]).length).toBe(0)
    })
  })

  describe('option selection', () => {
    it('should render checkboxes for each option', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const checkboxes = wrapper.findAll('.market-cap-option input[type="checkbox"]')
      expect(checkboxes.length).toBe(3)
    })

    it('should emit update:modelValue when option is selected', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const checkbox = wrapper.findAll('.market-cap-option input[type="checkbox"]')[0]
      await checkbox.setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')!
      expect(emitted[emitted.length - 1][0]).toContain('small')
    })

    it('should allow multiple selections', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')

      const checkboxes = wrapper.findAll('.market-cap-option input[type="checkbox"]')
      await checkboxes[0].setValue(true)
      
      // Update props after first selection to reflect parent update
      await wrapper.setProps({ modelValue: ['small'] })
      
      await checkboxes[1].setValue(true)

      const emitted = wrapper.emitted('update:modelValue')!
      expect((emitted[emitted.length - 1][0] as string[]).length).toBe(2)
    })
  })

  describe('chips display', () => {
    it('should display selected values as chips', async () => {
      const wrapper = createComponent({ modelValue: ['small', 'large'] })

      const chips = wrapper.findAll('.market-cap-chip')
      expect(chips.length).toBe(2)
    })

    it('should have remove button on each chip', async () => {
      const wrapper = createComponent({ modelValue: ['small'] })

      const chip = wrapper.find('.market-cap-chip')
      const removeBtn = chip.find('.market-cap-chip-remove')
      expect(removeBtn.exists()).toBe(true)
    })

    it('should remove value when chip remove button clicked', async () => {
      const wrapper = createComponent({ modelValue: ['small', 'large'] })

      const removeBtn = wrapper.find('.market-cap-chip-remove')
      await removeBtn.trigger('click')

      const emitted = wrapper.emitted('update:modelValue')!
      expect(emitted[emitted.length - 1][0]).toEqual(['large'])
    })

    it('should display correct chip text', async () => {
      const wrapper = createComponent({ modelValue: ['small', 'mid'] })

      const chips = wrapper.findAll('.market-cap-chip')
      expect(chips[0].text()).toContain('Small')
      expect(chips[1].text()).toContain('Mid')
    })
  })

  describe('keyboard navigation', () => {
    it('should close dropdown on Escape key', async () => {
      const wrapper = createComponent()
      const chipsInput = wrapper.find('.market-cap-chips-input')

      await chipsInput.trigger('click')
      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(true)

      await wrapper.find('.market-cap-container').trigger('keydown.esc')

      expect(wrapper.find('.market-cap-dropdown').exists()).toBe(false)
    })
  })
})
