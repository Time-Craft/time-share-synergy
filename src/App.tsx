
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
    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)

        if (currentSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentSession.user.id)
            .single()
          
          setIsNewUser(!data?.username)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        // If there's an error, we clear the session to be safe
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event)
      setSession(newSession)

      if (event === 'SIGNED_IN' && newSession?.user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', newSession.user.id)
            .single()
          
          setIsNewUser(!data?.username)
        } catch (error) {
          console.error('Error checking profile:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        setIsNewUser(false)
        // Clear any cached data when signing out
        queryClient.clear()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-navy">Loading...</div>
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
