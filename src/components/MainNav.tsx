import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const MainNav = () => {
  const { supabaseClient } = useSessionContext()

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
  }

  return (
    <div className="bg-cream border-b border-gray-200 py-4">
      <div className="container mx-auto flex items-center justify-between">
        
        <Link to="/" className="text-xl font-bold text-navy hover:text-teal transition-colors">TimeCraft</Link>

        
        <div className="flex items-center space-x-4">
          <Link to="/explore">
            <Button variant="ghost">Explore</Button>
          </Link>
          <Link to="/challenges">
            <Button variant="ghost">Challenges</Button>
          </Link>
          <Link to="/profile">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MainNav
