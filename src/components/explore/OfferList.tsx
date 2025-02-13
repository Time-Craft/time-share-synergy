
import { ScrollArea } from "@/components/ui/scroll-area"
import { useExploreOffers } from "@/hooks/useExploreOffers"
import OfferCard from "./OfferCard"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const OfferList = () => {
  const { offers, isLoading, acceptOffer } = useExploreOffers()

  // Get current user's ID to filter out their own offers
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    }
  })

  if (isLoading) {
    return <div className="p-4 text-center">Loading offers...</div>
  }

  const filteredOffers = offers?.filter(offer => {
    const isOwnOffer = currentUser && offer.user.id === currentUser.id
    return !isOwnOffer
  })

  if (!filteredOffers?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No offers available at the moment
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4 p-4">
        {filteredOffers.map((offer) => (
          <OfferCard 
            key={offer.id} 
            offer={offer}
            onAccept={() => acceptOffer(offer.id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

export default OfferList
