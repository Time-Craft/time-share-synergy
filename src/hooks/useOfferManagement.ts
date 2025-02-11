
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface OfferInput {
  title: string
  description: string
  hours: number
  serviceType: string
}

export const useOfferManagement = () => {
  const queryClient = useQueryClient()

  const createOffer = useMutation({
    mutationFn: async (offer: OfferInput) => {
      const { error } = await supabase
        .from('offers')
        .insert([{ ...offer, status: 'available' }])
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    }
  })

  const updateOffer = useMutation({
    mutationFn: async ({ id, ...updates }: OfferInput & { id: string }) => {
      const { error } = await supabase
        .from('offers')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    }
  })

  const deleteOffer = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    }
  })

  return {
    createOffer: createOffer.mutate,
    updateOffer: updateOffer.mutate,
    deleteOffer: deleteOffer.mutate,
    isCreating: createOffer.isPending,
    isUpdating: updateOffer.isPending,
    isDeleting: deleteOffer.isPending
  }
}
