/**
 * Message translations/UI strings
 * Structure: hierarchical keys for better organization and i18n compatibility
 */

export const messages = {
  // Header
  header: {
    title: 'Under Value Radar',
    subtitle: 'Személyes portfólió elemzés és nyomon követés'
  },

  // Filters
  filters: {
    toggleShow: 'Szűrők megjelenítése',
    toggleHide: 'Szűrők elrejtése',
    title: 'Szűrők',
    reset: 'Visszaállítás',
    search: {
      label: 'Keresés (Ticker vagy Név)',
      placeholder: 'pl. AAPL, Apple...'
    },
    exchange: {
      label: 'Tőzsde',
      allOption: 'Összes'
    },
    currency: {
      label: 'Deviza',
      allOption: 'Összes'
    },
    minPrice: {
      label: 'Min. ár',
      placeholder: '0'
    },
    maxPrice: {
      label: 'Max. ár',
      placeholder: '∞'
    },
    minPotential: {
      label: 'Min. potenciál (%)',
      placeholder: '-∞'
    },
    maxPotential: {
      label: 'Max. potenciál (%)',
      placeholder: '∞'
    },
    marketCap: {
      label: 'Piaci érték',
      selectAll: 'Mindet kijelöl',
      searchPlaceholder: 'Keresés...',
      small: 'Small',
      mid: 'Mid',
      large: 'Large'
    }
  },

  // Stock Table
  table: {
    empty: {
      title: 'Nincs megjeleníthető részvény',
      description: 'Próbáld meg módosítani a szűrőket'
    },
    columns: {
      ticker: 'Ticker',
      name: 'Név',
      exchange: 'Tőzsde',
      marketCap: 'Market Cap',
      entryPrice: 'Belépési ár',
      potential: 'Potenciál (%)',
      priceTarget12m: '12 hónapos cél',
      created: 'Létrehozva',
      actions: 'Műveletek'
    },
    actions: {
      details: 'Részletek'
    }
  },

  // Stock Modal
  modal: {
    sections: {
      pricingHeader: 'Árcélok',
      highsHeader: 'Történelmi csúcsok',
      notesHeader: 'Jegyzetek',
      linksHeader: 'Linkek',
      metaHeader: 'Metaadatok'
    },
    labels: {
      entryPrice: 'Belépési ár',
      potential: 'Növekedési potenciál',
      priceTarget6m: '6 hónapos cél',
      priceTarget12m: '12 hónapos cél',
      highestPrice1m: '1 hónap',
      highestPrice2m: '2 hónap',
      highestPrice3m: '3 hónap',
      highestPrice6m: '6 hónap',
      highestPrice12m: '12 hónap',
      highestPriceAllTime: 'Mindenkori legmagasabb',
      created: 'Létrehozva:',
      lastModified: 'Utoljára módosítva:',
      notAvailable: 'N/A'
    }
  },

  // Common/General
  common: {
    close: 'Bezárás',
    loading: 'Betöltés...'
  },

  // Errors
  errors: {
    loadStocksFailed: 'Failed to load stocks'
  }
} as const

export type MessageKeys = typeof messages
