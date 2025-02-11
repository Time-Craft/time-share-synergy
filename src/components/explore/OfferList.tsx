
import { ScrollArea } from "@/components/ui/scroll-area"
import OfferCard from "./OfferCard"

const OfferList = () => {
  // Mock data - replace with real data from your backend
  const offers = [
    {
      id: '1',
      title: 'Programming Help',
      description: 'Help with React development',
      hours: 2,
      user: {
        name: 'John Doe',
        avatar: '/placeholder.svg'
      },
      status: 'available'
    },
    // Add more mock offers as needed
  ]

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </ScrollArea>
  )
}

export default OfferList
