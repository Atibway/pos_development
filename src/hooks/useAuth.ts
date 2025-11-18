import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation, useLogoutMutation, useGetProfileQuery } from '@/services/authApi'
import { setCredentials, logout as logoutAction, setLoading, setError } from '@/features/auth/authSlice'
import type { RootState } from '@/app/store'
import type { LoginRequest } from '@/types/api'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()
  const { refetch: refetchProfile } = useGetProfileQuery()

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      
      const response = await loginMutation(credentials).unwrap()
      dispatch(setCredentials(response))
      
      return { success: true }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed'
      dispatch(setError(errorMessage))
      return { success: false, error: errorMessage }
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, loginMutation])

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logoutAction())
    }
  }, [dispatch, logoutMutation])

  const refreshProfile = useCallback(async () => {
    try {
      const { data: user } = await refetchProfile()
      if (user) {
        dispatch(setCredentials({ user, token: auth.token!, refreshToken: '' }))
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }, [dispatch, refetchProfile, auth.token])

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || loginLoading,
    error: auth.error,
    
    // Actions
    login,
    logout,
    refreshProfile,
  }
}
