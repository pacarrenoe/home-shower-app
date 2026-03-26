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

// ✅ NUEVO (no rompe nada)
import { sendReservationEmail } from '../../reservations/services/email.service'

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

  // 🔥 TRANSACTION (NO TOCAR)
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

  // 🔥 DATA ACTUALIZADA
  const snap = await getDoc(itemRef)
  const data = snap.data()

  const itemName = data?.name ?? ''

  // 🔥 RESERVATION (NO TOCAR)
  await addDoc(collection(db, 'reservations'), {
    itemId,
    itemName,
    name,
    option,
    createdAt: serverTimestamp(),
  })

  // ✅ NUEVO → EMAIL (NO AFECTA NADA SI FALLA)
  try {
    await sendReservationEmail({
      name,
      itemName,
      option,
    })
  } catch (error) {
    console.error('Error enviando email:', error)
  }
}

// TODO LO DEMÁS SE MANTIENE IGUAL 👇

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