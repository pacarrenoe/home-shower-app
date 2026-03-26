import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../../app/firebase'

export const uploadImage = async (file: File) => {
  const fileRef = ref(storage, `items/${Date.now()}-${file.name}`)

  await uploadBytes(fileRef, file)

  return await getDownloadURL(fileRef)
}