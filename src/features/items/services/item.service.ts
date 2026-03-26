import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
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

export const createItem = async (data: {
  name: string
  image: string
  description: string
  status: 'wanted' | 'owned'
  options: ItemOption[]
}) => {
  return addDoc(collection(db, 'items'), {
    ...data,
    reserved: false,
    reservedBy: null,
    reservedOption: null,
    createdAt: serverTimestamp(),
  })
}

export const updateItem = async (
  id: string,
  data: Partial<{
    name: string
    image: string
    description: string
    status: 'wanted' | 'owned'
    options: ItemOption[]
    reserved: boolean
    reservedBy: string | null
    reservedOption: ItemOption | null
  }>,
) => {
  return updateDoc(doc(db, 'items', id), data)
}

export const deleteItem = async (id: string) => {
  return deleteDoc(doc(db, 'items', id))
}

export const markAsOwned = async (id: string) => {
  return updateDoc(doc(db, 'items', id), {
    status: 'owned',
    reserved: false,
    reservedBy: null,
    reservedOption: null,
  })
}

export const resetReservation = async (id: string) => {
  return updateDoc(doc(db, 'items', id), {
    reserved: false,
    reservedBy: null,
    reservedOption: null,
  })
}

export const markAsWanted = async (id: string) => {
  return updateDoc(doc(db, 'items', id), {
    status: 'wanted',
  })
}