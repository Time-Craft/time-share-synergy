
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface Offer {
  id: string
  title: string
  description: string
  hours: number
  user: {
    id: string
    name: string
    avatar: string
  }
  status: string
}

export const useExploreOffers = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: offers, isLoading } = useQuery({
    queryKey: ['offers', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('offers')
        .select(`
          *,
          profiles!offers_profile_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('status', 'available')
        
      if (searchQuery) {
        query.ilike('title', `%${searchQuery}%`)
      }
      
      const { data, error } = await query
      if (error) throw error

      return data.map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        hours: offer.hours,
        status: offer.status,
        user: {
          id: offer.profiles?.id || '',
          name: offer.profiles?.username || 'Unknown User',
          avatar: offer.profiles?.avatar_url || '/placeholder.svg'
        }
      })) as Offer[]
    }
  })

  const acceptOffer = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'pending' })
        .eq('id', offerId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    }
  })

  return {
    offers,
    isLoading,
    searchQuery,
    setSearchQuery,
    acceptOffer: acceptOffer.mutate
  }
}
