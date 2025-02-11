
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Search, Plus, User, Trophy } from "lucide-react"

const MainNav = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">TimeShare</Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="ghost" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Explore
              </Button>
            </Link>
            <Link to="/offer">
              <Button variant="ghost" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Offer
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link to="/challenges">
              <Button variant="ghost" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Challenges
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <Button variant="ghost">Menu</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MainNav
