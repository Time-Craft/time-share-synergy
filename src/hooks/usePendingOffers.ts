
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface PendingOffer {
  id: string
  title: string
  description: string
  hours: number
  user: {
    name: string
    avatar: string
  }
  status: string
}

export const usePendingOffers = () => {
  const queryClient = useQueryClient()

  const { data: pendingOffers, isLoading } = useQuery({
    queryKey: ['pending-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('status', 'pending')
      
      if (error) throw error
      return data as PendingOffer[]
    }
  })

  const completeOffer = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'completed' })
        .eq('id', offerId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-offers'] })
    }
  })

  return {
    pendingOffers,
    isLoading,
    completeOffer: completeOffer.mutate
  }
}
