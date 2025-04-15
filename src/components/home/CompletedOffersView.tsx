
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCompletedOffers } from "@/hooks/useCompletedOffers"
import CompletedOffers from "@/components/profile/completed-offers"
import { useAuth } from "@/hooks/useAuth"

const CompletedOffersView = () => {
  const { user } = useAuth()
  
  return (
    <Card className="shadow-md mt-8">
      <CardHeader>
        <CardTitle className="text-navy">Completed Offers</CardTitle>
      </CardHeader>
      <CardContent>
        {!user ? (
          <div className="text-muted-foreground text-center py-4">
            Sign in to view your completed offers
          </div>
        ) : (
          <CompletedOffers userId={user.id} />
        )}
      </CardContent>
    </Card>
  )
}

export default CompletedOffersView
