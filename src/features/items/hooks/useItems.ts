import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../../app/firebase'
import type { Item, ItemOption } from '../types/item.types'

const normalizeOptions = (rawOptions: unknown): ItemOption[] => {
  if (!Array.isArray(rawOptions)) return []

  return rawOptions.map((option, index) => {
    const raw = option as Partial<ItemOption>

    return {
      id: raw.id ?? String(index + 1),
      store: raw.store ?? '',
      price: typeof raw.price === 'number' ? raw.price : 0,
      url: raw.url ?? '',
    }
  })
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('name', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextItems: Item[] = snapshot.docs.map((doc) => {
        const raw = doc.data()

        return {
          id: doc.id,
          name: raw.name ?? '',
          image: raw.image ?? '',
          description: raw.description ?? '',
          status: raw.status === 'owned' ? 'owned' : 'wanted',
          options: normalizeOptions(raw.options),
          reserved: Boolean(raw.reserved),
          reservedBy: raw.reservedBy ?? null,
          reservedOption: raw.reservedOption
            ? {
                id: raw.reservedOption.id ?? '',
                store: raw.reservedOption.store ?? '',
                price:
                  typeof raw.reservedOption.price === 'number'
                    ? raw.reservedOption.price
                    : 0,
                url: raw.reservedOption.url ?? '',
              }
            : null,
        }
      })

      setItems(nextItems)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { items, loading }
}