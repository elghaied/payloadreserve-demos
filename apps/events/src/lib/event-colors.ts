const EVENT_TYPE_COLORS: Record<string, string> = {
  'concert': '#e53e3e',
  'theater': '#d69e2e',
  'theatre': '#d69e2e',
  'exhibition': '#3182ce',
  'exposition': '#3182ce',
  'film screening': '#805ad5',
  'projection': '#805ad5',
  'workshop': '#38a169',
  'atelier': '#38a169',
  'dance performance': '#dd6b20',
  'spectacle de danse': '#dd6b20',
}

export function getEventTypeColor(name: string): string {
  return EVENT_TYPE_COLORS[name.toLowerCase()] ?? '#666666'
}

const SPECIALTY_COLORS: Record<string, string> = {
  'musician': '#e53e3e',
  'actor': '#d69e2e',
  'visual-artist': '#3182ce',
  'filmmaker': '#805ad5',
  'dancer': '#dd6b20',
  'speaker': '#38a169',
}

export function getSpecialtyColor(specialty: string): string {
  return SPECIALTY_COLORS[specialty] ?? '#666666'
}

export const EVENT_TYPE_COLOR_LIST = [
  '#e53e3e', '#d69e2e', '#3182ce', '#805ad5', '#38a169', '#dd6b20',
]
