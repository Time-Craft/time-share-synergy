
import { useExploreOffers } from "@/hooks/useExploreOffers"
import OfferCard from "./OfferCard"

const OfferList = () => {
  const { offers, isLoading } = useExploreOffers()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No offers found
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard 
          key={offer.id} 
          offer={offer}
        />
      ))}
    </div>
  )
}

export default OfferList
