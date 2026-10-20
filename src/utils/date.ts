/**
 * Returns a local date string in YYYY-MM-DD format, avoiding UTC day-shifting.
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses a YYYY-MM-DD string into a local Date object.
 */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

/**
 * Returns a readable date string like "Tuesday, 20 October" or "Tuesday, 20 October 2026".
 */
export function formatDisplayDate(dateStr: string, includeYear = false): string {
  try {
    const date = parseLocalDate(dateStr)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      ...(includeYear ? { year: 'numeric' } : {})
    }
    return date.toLocaleDateString('en-GB', options)
  } catch {
    return dateStr
  }
}

/**
 * Returns a short display date like "20 Oct".
 */
export function formatShortDate(dateStr: string): string {
  try {
    const date = parseLocalDate(dateStr)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

/**
 * Formats duration in minutes into a human readable string like "1h 20m" or "45m".
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 0) minutes = 0
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Gets the Monday start date (YYYY-MM-DD) of the week containing the given date string.
 */
export function getMondayOfWeek(dateStr: string): string {
  const date = parseLocalDate(dateStr)
  const day = date.getDay()
  // Sunday is 0, Monday is 1, ..., Saturday is 6
  const diffToMonday = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diffToMonday)
  return formatLocalDate(date)
}

/**
 * Gets the Sunday end date (YYYY-MM-DD) of the week.
 */
export function getSundayOfWeek(mondayStr: string): string {
  const date = parseLocalDate(mondayStr)
  date.setDate(date.getDate() + 6)
  return formatLocalDate(date)
}

/**
 * Generates an array of the last N Monday start dates up to the current week.
 */
export function getLastNWeeksMondays(numWeeks = 8, fromDateStr?: string): string[] {
  const currentMonday = getMondayOfWeek(fromDateStr || formatLocalDate())
  const mondays: string[] = []
  const date = parseLocalDate(currentMonday)

  for (let i = numWeeks - 1; i >= 0; i--) {
    const wDate = new Date(date)
    wDate.setDate(wDate.getDate() - i * 7)
    mondays.push(formatLocalDate(wDate))
  }
  return mondays
}

/**
 * Checks if a task is overdue based on targetDate and today's date.
 */
export function isTaskOverdue(targetDate?: string, status?: string, todayStr?: string): boolean {
  if (!targetDate || status === 'completed' || status === 'skipped') return false
  const today = todayStr || formatLocalDate()
  return targetDate < today
}
