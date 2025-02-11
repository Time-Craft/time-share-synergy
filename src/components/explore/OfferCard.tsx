
import { Card, CardContent } from "@/components/ui/card"
import OfferHeader from "./OfferHeader"
import OfferActions from "./OfferActions"
import OfferStatus from "./OfferStatus"

interface OfferCardProps {
  offer: {
    id: string
    title: string
    description: string
    hours: number
    user: {
      name: string
      avatar: string
    }
    status: string
  }
}

const OfferCard = ({ offer }: OfferCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <OfferHeader user={offer.user} title={offer.title} hours={offer.hours} />
        <p className="mt-2 text-muted-foreground">{offer.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <OfferStatus status={offer.status} />
          <OfferActions offerId={offer.id} />
        </div>
      </CardContent>
    </Card>
  )
}

export default OfferCard
