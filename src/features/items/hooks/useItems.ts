import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../../app/firebase'
import type { Item } from '../types/item.types'

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'items'), (snapshot) => {
      const data: Item[] = snapshot.docs.map((doc) => {
        const raw = doc.data()

        return {
          id: doc.id,
          name: raw.name,
          image: raw.image,
          status: raw.status,
          description: raw.description || '',
          options: raw.options || [], // 🔥 clave
        }
      })

      setItems(data)
    })

    return () => unsub()
  }, [])

  return { items }
}