import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'

export const useApi = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  const headers = useMemo(() => {
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`
    }
    
    return baseHeaders
  }, [token])

  return {
    headers,
    isAuthenticated: !!token,
  }
}
