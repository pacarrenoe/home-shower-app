export type ItemStatus = 'wanted' | 'owned'

export interface ItemOption {
  id: string
  store: string
  price: number
  url: string
}

export interface ReservedOption {
  id: string
  store: string
  price: number
  url: string
}

export interface Item {
  id: string
  name: string
  image: string
  description: string
  status: ItemStatus
  options: ItemOption[]
  reserved: boolean
  reservedBy: string | null
  reservedOption: ReservedOption | null
}