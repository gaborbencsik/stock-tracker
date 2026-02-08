export interface Stock {
  id: number
  ticker: string
  name: string
  stock_exchange: string
  currency: string
  market_cap: 'small' | 'mid' | 'large'
  entry_price: number
  uplift_potential: number
  six_months_price_target: number | null
  twelve_months_price_target: number | null
  one_month_highest_price: number | null
  two_months_highest_price: number | null
  three_months_highest_price: number | null
  six_months_highest_price: number | null
  twelve_months_highest_price: number | null
  highest_price: number | null
  notes: string
  links: string
  last_modified: string
  created_at: string
}

export interface StockFilters {
  search: string
  exchange: string
  currency: string
  minPrice: number | null
  maxPrice: number | null
  minPotential: number | null
  maxPotential: number | null
  marketCaps: Array<'small' | 'mid' | 'large'>
}
