
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

const Onboarding = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to TimeShare</h1>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose a Username</label>
                <Input placeholder="username" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">What services can you offer?</label>
                <Input placeholder="e.g., Programming, Teaching, Gardening" />
              </div>
              
              <Button type="submit" className="w-full">
                Complete Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Onboarding
