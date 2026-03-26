import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function FirebaseProvider({ children }: Props) {
  return <>{children}</>
}