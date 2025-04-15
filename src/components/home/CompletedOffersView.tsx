
import { useState, useEffect } from "react"
import { useCompletedOffers } from "@/hooks/useCompletedOffers"
import CompletedOffersList from "@/components/profile/completed-offers/CompletedOffersList"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

const CompletedOffersView = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  
  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user?.id) {
        setUserId(data.user.id)
      }
    }
    
    fetchUserId()
  }, [])

  // Set up realtime subscription for transactions
  useEffect(() => {
    if (!userId) return
    
    const transactionsChannel = supabase
      .channel('home-transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          console.log('Transactions update received on home page')
          queryClient.invalidateQueries({ queryKey: ['completed-offers', userId] })
          queryClient.refetchQueries({ queryKey: ['completed-offers', userId] })
        }
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(transactionsChannel)
    }
  }, [queryClient, userId])

  const { 
    completedForYou, 
    forYouLoading, 
    localClaimed, 
    setOfferAsClaimed 
  } = useCompletedOffers(userId)

  // Only show if there are completed offers
  if (!completedForYou || completedForYou.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Recently Completed</h2>
      <CompletedOffersList
        offers={completedForYou}
        isLoading={forYouLoading}
        isForYou={true}
        localClaimed={localClaimed}
        onClaimed={setOfferAsClaimed}
      />
    </div>
  )
}

export default CompletedOffersView
