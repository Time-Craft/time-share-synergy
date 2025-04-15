
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

// Define a type for the transaction payload
type TransactionPayload = {
  new: {
    provider_id?: string
    user_id?: string
    [key: string]: any
  }
  old: Record<string, any>
  [key: string]: any
}

export const useOfferSubscription = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('offer-management')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers'
        },
        () => {
          console.log('Offer change detected')
          queryClient.invalidateQueries({ queryKey: ['offers'] })
          queryClient.invalidateQueries({ queryKey: ['user-offers'] })
          queryClient.invalidateQueries({ queryKey: ['time-balance'] })
          queryClient.invalidateQueries({ queryKey: ['user-stats'] })
        }
      )
      .subscribe()

    const timeBalancesChannel = supabase
      .channel('time-balances-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_balances'
        },
        () => {
          console.log('Time balance change detected')
          queryClient.invalidateQueries({ queryKey: ['time-balance'] })
          queryClient.invalidateQueries({ queryKey: ['user-stats'] })
        }
      )
      .subscribe()

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        (payload: TransactionPayload) => {
          console.log('Transaction change detected', payload)
          queryClient.invalidateQueries({ queryKey: ['time-balance'] })
          queryClient.invalidateQueries({ queryKey: ['completed-offers'] })
          queryClient.invalidateQueries({ queryKey: ['pending-offers-and-applications'] })
          queryClient.invalidateQueries({ queryKey: ['user-stats'] })
          
          // Make sure we invalidate both the provider and requester's data
          if (payload.new && payload.new.provider_id) {
            queryClient.invalidateQueries({ queryKey: ['user', payload.new.provider_id] })
          }
          if (payload.new && payload.new.user_id) {
            queryClient.invalidateQueries({ queryKey: ['user', payload.new.user_id] })
          }
        }
      )
      .subscribe()

    const applicationsChannel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offer_applications'
        },
        () => {
          console.log('Application change detected')
          queryClient.invalidateQueries({ queryKey: ['pending-offers-and-applications'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(timeBalancesChannel)
      supabase.removeChannel(transactionsChannel)
      supabase.removeChannel(applicationsChannel)
    }
  }, [queryClient])
}
