export type ExampleTableType = {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: string
  actions?: string
}

export type ExampleTableResponseType = {
  count: number
  data: ExampleTableType[]
}

export type ExampleTableFiltersType = {
  search?: string
  dateRange?: null | {
    startDate: string
    endDate: string
  }
}
