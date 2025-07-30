'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSessionContext, useUser } from '@supabase/auth-helpers-react'
import { User } from '@supabase/auth-helpers-nextjs'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabaseClient } = useSessionContext()
  const user = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabaseClient.auth])

  const signOut = async () => {
    await supabaseClient.auth.signOut()
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}