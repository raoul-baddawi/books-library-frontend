export function formatDateString(isoDateString: string): string {
  if (!isoDateString) return '-'
  const date = new Date(isoDateString)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${day}/${month}/${year}`
}

export function formatDate(date?: string | number | Date | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateWithHours(date: Date, hasSeconds = false) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  if (hasSeconds) {
    options.second = '2-digit'
  }
  const dateToFormat = new Date(date)

  const dateFormatter = new Intl.DateTimeFormat('fr-FR', options)

  const formattedDate = dateFormatter.format(dateToFormat)

  return formattedDate
}
