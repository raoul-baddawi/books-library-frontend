export type BookTableType = {
  id: number
  name: string
  description: string
  genre: string
  authorName: string
  createdAt: string
  actions?: string
}

export type BookTableResponseType = {
  count: number
  data: BookTableType[]
}

export type BookTableFiltersType = {
  search?: string
  dateRange?: null | {
    startDate: string
    endDate: string
  }
}
