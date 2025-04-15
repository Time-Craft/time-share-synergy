
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export interface CompletedOffer {
  id: string
  service: string
  hours: number
  created_at: string
  claimed: boolean
  user_id: string
  provider_id: string
  offer_id?: string
}

export const useCompletedOffers = (userId: string | null) => {
  const [localClaimed, setLocalClaimed] = useState<Record<string, boolean>>({})

  // Fetch offers completed FOR the user (where they received the service)
  const { 
    data: completedForYou = [], 
    isLoading: forYouLoading,
    refetch: refetchForYou
  } = useQuery({
    queryKey: ['completed-offers', userId],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching completed offers:', error)
        throw error
      }

      return data as CompletedOffer[]
    },
    enabled: !!userId
  })

  // Record which offers have been marked as claimed
  useEffect(() => {
    if (completedForYou?.length) {
      const claimed: Record<string, boolean> = {}
      completedForYou.forEach(offer => {
        claimed[offer.id] = offer.claimed || false
      })
      setLocalClaimed(claimed)
    }
  }, [completedForYou])

  // Function to mark an offer as claimed
  const setOfferAsClaimed = async (offerId: string) => {
    if (!userId) return
    
    try {
      // Update local state immediately for UI responsiveness
      setLocalClaimed(prev => ({
        ...prev,
        [offerId]: true
      }))

      // Update the transaction in the database
      const { error } = await supabase
        .from('transactions')
        .update({ claimed: true })
        .eq('id', offerId)

      if (error) {
        throw error
      }

      toast.success('Credits claimed successfully')
      refetchForYou()
    } catch (error: any) {
      console.error('Error claiming credits:', error)
      // Revert local state if update fails
      setLocalClaimed(prev => ({
        ...prev,
        [offerId]: false
      }))
      toast.error('Failed to claim credits')
    }
  }

  return {
    completedForYou,
    forYouLoading,
    localClaimed,
    setOfferAsClaimed
  }
}
