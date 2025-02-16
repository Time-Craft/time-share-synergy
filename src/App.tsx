
import React, { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "./integrations/supabase/client"
import MainNav from "./components/MainNav"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Login from "./pages/Login"
import Offer from "./pages/Offer"
import Profile from "./pages/Profile"
import Onboarding from "./pages/Onboarding"
import Challenges from "./pages/Challenges"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    // Check current session
    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        console.log('Initial session check:', currentSession)
        setSession(currentSession)
        
        if (currentSession?.user) {
          await checkUserProfile(currentSession.user.id)
        }
      } catch (error) {
        console.error('Session init error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession)
      setSession(newSession)

      if (event === 'SIGNED_IN' && newSession?.user) {
        try {
          // Check if profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', newSession.user.id)
            .single()

          // If no profile exists, create one
          if (!profile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ id: newSession.user.id }])
            
            if (insertError) throw insertError
            setIsNewUser(true)
          } else {
            setIsNewUser(!profile.username)
          }
        } catch (error) {
          console.error('Profile check error:', error)
          setIsNewUser(false)
        }
      } else if (event === 'SIGNED_OUT') {
        setIsNewUser(false)
        queryClient.clear()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      setIsNewUser(!data?.username)
    } catch (error) {
      console.error('Error checking profile:', error)
      setIsNewUser(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-navy animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {session && <MainNav />}
          <Routes>
            {!session ? (
              <Route path="*" element={<Login />} />
            ) : isNewUser ? (
              <>
                <Route path="/onboarding" element={<Onboarding setIsNewUser={setIsNewUser} />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/offer" element={<Offer />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/onboarding" element={<Onboarding setIsNewUser={setIsNewUser} />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
