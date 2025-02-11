
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./integrations/supabase/client"
import MainNav from "./components/MainNav"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Offer from "./pages/Offer"
import Profile from "./pages/Profile"
import Onboarding from "./pages/Onboarding"
import Challenges from "./pages/Challenges"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
        
        setIsNewUser(!data)
      }
    }
    
    checkUserProfile()
  }, [session])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (isNewUser) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <MainNav />
                  <Home />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <>
                  <MainNav />
                  <Explore />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer"
            element={
              <ProtectedRoute>
                <>
                  <MainNav />
                  <Offer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <MainNav />
                  <Profile />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <>
                  <MainNav />
                  <Challenges />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
