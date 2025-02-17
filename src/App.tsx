import React, { useEffect, useState, Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "./integrations/supabase/client"
import MainNav from "./components/MainNav"

// Lazy load route components
const Home = React.lazy(() => import("./pages/Home"))
const Explore = React.lazy(() => import("./pages/Explore"))
const Login = React.lazy(() => import("./pages/Login"))
const Offer = React.lazy(() => import("./pages/Offer"))
const Profile = React.lazy(() => import("./pages/Profile"))
const Onboarding = React.lazy(() => import("./pages/Onboarding"))
const Challenges = React.lazy(() => import("./pages/Challenges"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
})

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream">
    <div className="text-navy animate-pulse">Loading...</div>
  </div>
)

const App = () => {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    let mounted = true

    const initSession = async () => {
      try {
        // First, try to get the session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          // If there's an error getting the session, clear it
          await supabase.auth.signOut()
          if (mounted) {
            setSession(null)
            setIsLoading(false)
          }
          return
        }

        if (mounted) {
          setSession(currentSession)
          
          if (currentSession?.user) {
            await checkUserProfile(currentSession.user.id)
          }
        }
      } catch (error) {
        console.error('Session init error:', error)
        // On any error, ensure we're in a clean state
        if (mounted) {
          setSession(null)
          setIsLoading(false)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initSession()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event)
      
      if (mounted) {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setSession(null)
          setIsNewUser(false)
          queryClient.clear()
          return
        }

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession) {
          setSession(newSession)
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', newSession.user.id)
              .single()

            if (profileError) throw profileError

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
        }
      }
    })

    return () => {
      mounted = false
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
    return <LoadingFallback />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {session && <MainNav />}
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
