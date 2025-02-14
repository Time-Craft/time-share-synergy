
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export const useApplicationManagement = (offerId?: string) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['offer-applications', offerId],
    queryFn: async () => {
      if (!offerId) return []
      
      const { data, error } = await supabase
        .from('offer_applications')
        .select(`
          *,
          profiles:applicant_id (
            username,
            avatar_url
          )
        `)
        .eq('offer_id', offerId)
      
      if (error) throw error
      return data
    },
    enabled: !!offerId
  })

  const applyToOffer = useMutation({
    mutationFn: async (offerId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('offer_applications')
        .insert({
          offer_id: offerId,
          applicant_id: user.id,
          status: 'pending'
        })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offer-applications'] })
      toast({
        title: "Success",
        description: "Application submitted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application: " + error.message,
        variant: "destructive",
      })
    }
  })

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string, status: 'accepted' | 'rejected' }) => {
      const { error } = await supabase
        .from('offer_applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offer-applications'] })
      toast({
        title: "Success",
        description: "Application status updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status: " + error.message,
        variant: "destructive",
      })
    }
  })

  return {
    applications,
    isLoadingApplications,
    applyToOffer: applyToOffer.mutate,
    updateApplicationStatus: updateApplicationStatus.mutate,
    isApplying: applyToOffer.isPending,
    isUpdating: updateApplicationStatus.isPending
  }
}
