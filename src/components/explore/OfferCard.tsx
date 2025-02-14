
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import OfferHeader from "./OfferHeader"
import OfferStatus from "./OfferStatus"
import { Check, Hourglass, X } from "lucide-react"
import { useApplicationManagement } from "@/hooks/useApplicationManagement"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface OfferCardProps {
  offer: {
    id: string
    title: string
    description: string
    hours: number
    user: {
      id: string
      name: string
      avatar: string
    }
    status: string
  }
  showApplications?: boolean
}

const OfferCard = ({ offer, showApplications = false }: OfferCardProps) => {
  const { 
    applyToOffer, 
    applications, 
    updateApplicationStatus,
    userApplication 
  } = useApplicationManagement(offer.id)

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    }
  })

  const isOwner = currentUser?.id === offer.user.id

  const renderApplyButton = () => {
    if (userApplication) {
      return (
        <Button disabled variant="secondary">
          <Hourglass className="h-4 w-4 mr-1" />
          {userApplication.status === 'pending' ? 'Application Pending' : 
            userApplication.status === 'accepted' ? 'Application Accepted' : 
            'Application Rejected'}
        </Button>
      )
    }

    return (
      <Button 
        onClick={() => applyToOffer(offer.id)}
        disabled={offer.status !== 'available'}
      >
        <Check className="h-4 w-4 mr-1" />
        {offer.status === 'available' ? 'Apply' : 'Not Available'}
      </Button>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <OfferHeader user={offer.user} title={offer.title} hours={offer.hours} />
        <p className="mt-2 text-muted-foreground">{offer.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <OfferStatus status={offer.status} />
          {!isOwner && renderApplyButton()}
        </div>

        {showApplications && applications && applications.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Applications</h4>
            <div className="space-y-2">
              {applications.map((application: any) => (
                <div key={application.id} className="flex items-center justify-between bg-secondary p-2 rounded">
                  <span>{application.profiles.username}</span>
                  {application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => updateApplicationStatus({ 
                          applicationId: application.id, 
                          status: 'accepted' 
                        })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateApplicationStatus({ 
                          applicationId: application.id, 
                          status: 'rejected' 
                        })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {application.status !== 'pending' && (
                    <span className={`capitalize ${
                      application.status === 'accepted' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {application.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OfferCard
