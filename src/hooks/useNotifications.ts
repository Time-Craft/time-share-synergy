
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
  createdAt: string
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('broadcast', { event: 'notification' }, ({ payload }) => {
        const notification = payload as Notification
        setNotifications(prev => [notification, ...prev])
        toast({
          title: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
          description: notification.message,
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [toast])

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  return {
    notifications,
    markAsRead
  }
}
