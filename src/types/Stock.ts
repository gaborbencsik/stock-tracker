export interface Stock {
  id: number
  ticker: string
  name: string
  stock_exchange: string
  currency: string
  entry_price: number
  uplift_potential: number
  six_months_price_target: number
  twelve_months_price_target: number
  one_month_highest_price: number
  two_months_highest_price: number
  three_months_highest_price: number
  six_months_highest_price: number
  twelve_months_highest_price: number
  highest_price: number
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
}
