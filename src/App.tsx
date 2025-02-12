
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

const queryClient = new QueryClient()

const App = () => {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsNewUser(_event === 'SIGNED_IN')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
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
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/offer" element={<Offer />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/onboarding" element={<Onboarding />} />
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

