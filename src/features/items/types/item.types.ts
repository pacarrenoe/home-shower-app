export type ItemStatus = 'wanted' | 'owned'

export type ItemOption = {
  store: string
  price: number
  url: string
}

export type Item = {
  id: string
  name: string
  image: string
  status: ItemStatus
  description?: string
  options: ItemOption[]
}