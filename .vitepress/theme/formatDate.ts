// Displayed date format, e.g. "14 Jun, 2026". Uses the native
// Intl.DateTimeFormat (no extra dependency) rather than hand-parsing the
// string, so real calendar rules (leap years, days-per-month, etc.) are
// handled correctly instead of silently trusting whatever numbers were
// typed. timeZone: 'UTC' matters here: "YYYY-MM-DD" parses as UTC
// midnight, and formatting it back in the viewer's local timezone can
// roll the displayed day back by one west of UTC - forcing UTC on both
// ends keeps the displayed date exactly what was authored.
const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(dateStr: string): string {
  const parts = formatter.formatToParts(new Date(dateStr))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('day')} ${get('month')}, ${get('year')}`
}
