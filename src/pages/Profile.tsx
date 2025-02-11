
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

const Profile = () => {
  const [username, setUsername] = useState("")
  const [services, setServices] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
        return
      }

      if (data) {
        setUsername(data.username)
        setServices(data.services)
      }
    }

    loadProfile()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          services,
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
      return
    }
    navigate("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>User Profile</CardTitle>
                </div>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input 
                  placeholder="Your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Services Offered</label>
                <Input 
                  placeholder="e.g., Programming, Teaching, Gardening" 
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                />
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
