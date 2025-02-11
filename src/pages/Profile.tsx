
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const Profile = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>User Profile</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input placeholder="Your username" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Services Offered</label>
                <Input placeholder="e.g., Programming, Teaching, Gardening" />
              </div>
              
              <Button type="submit">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
