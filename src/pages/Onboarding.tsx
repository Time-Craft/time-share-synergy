
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

const Onboarding = () => {
  const [username, setUsername] = useState("")
  const [services, setServices] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            username,
            services,
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile completed successfully!",
      })

      navigate("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose a Username</label>
                <Input 
                  placeholder="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">What services can you offer?</label>
                <Input 
                  placeholder="e.g., Programming, Teaching, Gardening" 
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                />
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
