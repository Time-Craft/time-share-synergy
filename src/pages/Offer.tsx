
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useOfferManagement } from "@/hooks/useOfferManagement"

const Offer = () => {
  const navigate = useNavigate()
  const { createOffer, isCreating } = useOfferManagement()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [hours, setHours] = useState("")
  const [serviceType, setServiceType] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await createOffer({
      title,
      description,
      hours: Number(hours),
      serviceType
    })

    navigate('/profile')
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Create New Offer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <Input 
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="e.g., Programming, Gardening, Teaching" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your offer a clear title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Amount (hours)</label>
              <Input 
                type="number" 
                min="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="1" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your service offer..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Offer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Offer
