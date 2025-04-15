
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  userId: string | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUserId(data.user?.id || null)
      } catch (error) {
        console.error('Error getting user:', error)
        setUserId(null)
      } finally {
        setIsLoading(false)
      }
    }

    getCurrentUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUserId(session?.user?.id || null)
        setIsLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ userId, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
