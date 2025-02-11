
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Search, Plus, User, Trophy } from "lucide-react"

const MainNav = () => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="border-b hidden md:block">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">TimeShare</Link>
            
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
        <div className="flex justify-around items-center p-2">
          <Link to="/" className="flex-1">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'} 
              className="w-full flex flex-col items-center gap-1 h-auto py-2"
              size="sm"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link to="/explore" className="flex-1">
            <Button 
              variant={isActive('/explore') ? 'default' : 'ghost'} 
              className="w-full flex flex-col items-center gap-1 h-auto py-2"
              size="sm"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs">Explore</span>
            </Button>
          </Link>
          <Link to="/offer" className="flex-1">
            <Button 
              variant={isActive('/offer') ? 'default' : 'ghost'} 
              className="w-full flex flex-col items-center gap-1 h-auto py-2"
              size="sm"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">New</span>
            </Button>
          </Link>
          <Link to="/profile" className="flex-1">
            <Button 
              variant={isActive('/profile') ? 'default' : 'ghost'} 
              className="w-full flex flex-col items-center gap-1 h-auto py-2"
              size="sm"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
          <Link to="/challenges" className="flex-1">
            <Button 
              variant={isActive('/challenges') ? 'default' : 'ghost'} 
              className="w-full flex flex-col items-center gap-1 h-auto py-2"
              size="sm"
            >
              <Trophy className="h-5 w-5" />
              <span className="text-xs">Goals</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* Add padding to main content to account for fixed bottom nav on mobile */}
      <div className="pb-16 md:pb-0">
        {/* ... content will be rendered here */}
      </div>
    </>
  )
}

export default MainNav
