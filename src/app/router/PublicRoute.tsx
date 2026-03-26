import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function PublicRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null

  // 🔥 SI YA ESTÁ LOGUEADO → LO SACAS DEL LOGIN
  if (user) return <Navigate to="/admin" replace />

  return <>{children}</>
}