import {
  createItem,
  updateItem,
  deleteItem,
  markAsOwned,
  resetReservation,
  markAsWanted,
} from '../services/item.service'
import type { ItemOption } from '../types/item.types'

type ItemFormData = {
  name: string
  image: string
  description: string
  status: 'wanted' | 'owned'
  options: ItemOption[]
}

export const useAdminItems = () => {
  const handleCreate = async (data: ItemFormData) => {
    await createItem(data)
  }

  const handleReset = async (id: string) => {
    await resetReservation(id)
  }

  const handleUpdate = async (id: string, data: Partial<ItemFormData>) => {
    await updateItem(id, data)
  }

  const handleDelete = async (id: string) => {
    await deleteItem(id)
  }

  const handleMarkOwned = async (id: string) => {
    await markAsOwned(id)
  }

  const handleMarkWanted = async (id: string) => {
    await markAsWanted(id)
  }

  return {
    handleCreate,
    handleReset,
    handleUpdate,
    handleDelete,
    handleMarkOwned,
    handleMarkWanted,
  }
}