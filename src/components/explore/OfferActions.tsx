
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface OfferActionsProps {
  offerId: string
}

const OfferActions = ({ offerId }: OfferActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => console.log('Declined offer:', offerId)}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button 
        size="sm"
        onClick={() => console.log('Accepted offer:', offerId)}
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default OfferActions
