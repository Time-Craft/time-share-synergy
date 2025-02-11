
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface OfferInput {
  title: string
  description: string
  hours: number
  serviceType: string
}

export const useOfferManagement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createOffer = useMutation({
    mutationFn: async (offer: OfferInput) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('offers')
        .insert([{ 
          ...offer, 
          status: 'available',
          user_id: user.user.id,
          created_at: new Date().toISOString()
        }])
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      toast({
        title: "Success",
        description: "Offer created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create offer: " + error.message,
        variant: "destructive",
      })
    }
  })

  const updateOffer = useMutation({
    mutationFn: async ({ id, ...updates }: OfferInput & { id: string }) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('offers')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.user.id) // Ensure user owns the offer
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      toast({
        title: "Success",
        description: "Offer updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update offer: " + error.message,
        variant: "destructive",
      })
    }
  })

  const deleteOffer = useMutation({
    mutationFn: async (offerId: string) => {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)
        .eq('user_id', user.user.id) // Ensure user owns the offer
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete offer: " + error.message,
        variant: "destructive",
      })
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
