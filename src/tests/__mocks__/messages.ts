/**
 * Shared mock for messages module
 * Used across tests to ensure string independence and i18n compatibility
 */

import { vi } from 'vitest'

export const createMockMessages = () => ({
  header: {
    title: '[MOCK_HEADER_TITLE]',
    subtitle: '[MOCK_HEADER_SUBTITLE]'
  },
  filters: {
    toggleShow: '[MOCK_TOGGLE_SHOW]',
    toggleHide: '[MOCK_TOGGLE_HIDE]',
    title: '[MOCK_FILTERS_TITLE]',
    reset: '[MOCK_FILTERS_RESET]',
    search: {
      label: '[MOCK_SEARCH_LABEL]',
      placeholder: '[MOCK_SEARCH_PLACEHOLDER]'
    },
    exchange: {
      label: '[MOCK_EXCHANGE_LABEL]',
      allOption: '[MOCK_ALL_OPTION]'
    },
    currency: {
      label: '[MOCK_CURRENCY_LABEL]',
      allOption: '[MOCK_ALL_OPTION]'
    },
    minPrice: {
      label: '[MOCK_MIN_PRICE_LABEL]',
      placeholder: '[MOCK_MIN_PLACEHOLDER]'
    },
    maxPrice: {
      label: '[MOCK_MAX_PRICE_LABEL]',
      placeholder: '[MOCK_MAX_PLACEHOLDER]'
    },
    minPotential: {
      label: '[MOCK_MIN_POTENTIAL_LABEL]',
      placeholder: '[MOCK_MIN_POTENTIAL_PLACEHOLDER]'
    },
    maxPotential: {
      label: '[MOCK_MAX_POTENTIAL_LABEL]',
      placeholder: '[MOCK_MAX_POTENTIAL_PLACEHOLDER]'
    },
    marketCap: {
      label: '[MOCK_MARKET_CAP_LABEL]',
      selectAll: '[MOCK_SELECT_ALL]',
      searchPlaceholder: '[MOCK_MARKET_CAP_SEARCH_PLACEHOLDER]',
      small: '[MOCK_SMALL]',
      mid: '[MOCK_MID]',
      large: '[MOCK_LARGE]'
    }
  },
  table: {
    empty: {
      title: '[MOCK_EMPTY_TITLE]',
      description: '[MOCK_EMPTY_DESCRIPTION]'
    },
    columns: {
      ticker: '[MOCK_TICKER]',
      name: '[MOCK_NAME]',
      exchange: '[MOCK_EXCHANGE]',
      marketCap: '[MOCK_MARKET_CAP]',
      entryPrice: '[MOCK_ENTRY_PRICE]',
      potential: '[MOCK_POTENTIAL]',
      priceTarget12m: '[MOCK_PRICE_TARGET_12M]',
      created: '[MOCK_CREATED]',
      actions: '[MOCK_ACTIONS]'
    },
    actions: {
      details: '[MOCK_DETAILS_BUTTON]'
    }
  },
  modal: {
    sections: {
      pricingHeader: '[MOCK_PRICING_HEADER]',
      highsHeader: '[MOCK_HIGHS_HEADER]',
      notesHeader: '[MOCK_NOTES_HEADER]',
      linksHeader: '[MOCK_LINKS_HEADER]',
      metaHeader: '[MOCK_META_HEADER]'
    },
    labels: {
      entryPrice: '[MOCK_ENTRY_PRICE_LABEL]',
      potential: '[MOCK_POTENTIAL_LABEL]',
      priceTarget6m: '[MOCK_PRICE_TARGET_6M]',
      priceTarget12m: '[MOCK_PRICE_TARGET_12M]',
      highestPrice1m: '[MOCK_HIGHEST_1M]',
      highestPrice2m: '[MOCK_HIGHEST_2M]',
      highestPrice3m: '[MOCK_HIGHEST_3M]',
      highestPrice6m: '[MOCK_HIGHEST_6M]',
      highestPrice12m: '[MOCK_HIGHEST_12M]',
      highestPriceAllTime: '[MOCK_HIGHEST_ALL_TIME]',
      created: '[MOCK_CREATED_LABEL]',
      lastModified: '[MOCK_LAST_MODIFIED]',
      notAvailable: '[MOCK_NOT_AVAILABLE]'
    }
  },
  common: {
    close: '[MOCK_CLOSE]',
    loading: '[MOCK_LOADING]'
  },
  errors: {
    loadStocksFailed: '[MOCK_LOAD_FAILED]'
  }
})

/**
 * Setup messages mock for Vitest
 * Call this in test files before mounting components
 */
export const mockMessages = createMockMessages()

export const setupMessagesMock = () => {
  vi.mock('@/locales/messages', () => ({
    messages: mockMessages
  }))
}
