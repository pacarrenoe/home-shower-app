import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../app/firebase'

export const createReservation = async (data: {
  name: string
  itemName: string
  optionId: string
}) => {
  await addDoc(collection(db, 'reservations'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}