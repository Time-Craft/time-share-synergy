
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Offer = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Create New Offer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <Input placeholder="e.g., Programming, Gardening, Teaching" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Amount (hours)</label>
              <Input type="number" min="1" placeholder="1" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your service offer..." />
            </div>
            
            <Button type="submit" className="w-full">
              Create Offer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Offer
