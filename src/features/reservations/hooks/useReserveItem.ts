import { useState } from 'react'
import { reserveItem } from '../../items/services/item.service'
import type { ItemOption } from '../../items/types/item.types'

export const useReserveItem = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleReserve = async (
    itemId: string,
    name: string,
    option: ItemOption,
  ) => {
    setLoading(true)
    setError('')

    try {
      await reserveItem({ itemId, name, option })
      return true
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo registrar la reserva'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError('')

  return {
    handleReserve,
    loading,
    error,
    clearError,
  }
}