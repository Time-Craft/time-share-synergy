
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search offers..." 
        className="pl-10"
        onChange={(e) => console.log('Search:', e.target.value)}
      />
    </div>
  )
}

export default SearchBar
