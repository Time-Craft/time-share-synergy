
import { Button } from "@/components/ui/button"
import { Map, List } from "lucide-react"
import SearchBar from "./SearchBar"

interface ExploreHeaderProps {
  view: 'list' | 'map'
  onViewChange: (view: 'list' | 'map') => void
}

const ExploreHeader = ({ view, onViewChange }: ExploreHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
      <h1 className="text-3xl font-bold">Explore Time Offers</h1>
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <SearchBar />
        <div className="flex space-x-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'map' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewChange('map')}
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExploreHeader
