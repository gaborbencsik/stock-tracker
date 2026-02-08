/**
 * Formats a date string to display only the date (no time)
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDateOnly(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    return date.toISOString().split('T')[0]
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Formats a date string to display date and time
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (YYYY-MM-DD HH:MM)
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Formats a date string in a localized format (Hungarian)
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (YYYY. MMM. DD.)
 */
export function formatDateLocalized(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}
