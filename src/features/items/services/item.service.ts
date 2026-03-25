import {
  addDoc,
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../../app/firebase'
import type { ItemOption } from '../types/item.types'

interface ReserveItemParams {
  itemId: string
  name: string
  option: ItemOption
}

export const reserveItem = async ({
  itemId,
  name,
  option,
}: ReserveItemParams) => {
  const itemRef = doc(db, 'items', itemId)

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(itemRef)

    if (!snap.exists()) {
      throw new Error('Item no existe')
    }

    const data = snap.data()

    if (data.reserved) {
      throw new Error('Item ya reservado')
    }

    transaction.update(itemRef, {
      reserved: true,
      reservedBy: name,
      reservedOption: option,
    })
  })

  // histórico (fuera de transaction)
  const snap = await getDoc(itemRef)
  const data = snap.data()

  await addDoc(collection(db, 'reservations'), {
    itemId,
    itemName: data?.name ?? '',
    name,
    option,
    createdAt: serverTimestamp(),
  })
}