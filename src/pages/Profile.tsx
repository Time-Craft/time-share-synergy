
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"

const Profile = () => {
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [services, setServices] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setServices(profile.services?.join(', ') || '')
    }
  }, [profile])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          services: services.split(',').map(s => s.trim()),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-4rem)] pb-20 md:pb-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {username?.substring(0, 2).toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>User Profile</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Services Offered</label>
                <Input 
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="e.g., Programming, Teaching, Gardening" 
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple services with commas
                </p>
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
