
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import OfferCard from "../explore/OfferCard"
import { usePendingOffers } from "@/hooks/usePendingOffers"

const PendingOffers = () => {
  const { pendingOffers, isLoading, completeOffer } = usePendingOffers()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Loading offers...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {!pendingOffers?.length ? (
              <div className="text-center text-muted-foreground">
                No pending offers
              </div>
            ) : (
              pendingOffers.map((offer) => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  onAccept={() => completeOffer(offer.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default PendingOffers
