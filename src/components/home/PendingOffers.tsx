
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import OfferCard from "../explore/OfferCard"

const PendingOffers = () => {
  // Mock data - replace with real data from your backend
  const pendingOffers = [
    {
      id: '1',
      title: 'Programming Help',
      description: 'Help with React development',
      hours: 2,
      user: {
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      status: 'pending'
    },
    // Add more mock offers as needed
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {pendingOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default PendingOffers
