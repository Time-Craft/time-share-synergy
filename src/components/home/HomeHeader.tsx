
import { useQuery } from "@tanstack/react-query"

const HomeHeader = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => ({ name: 'User' }), // Replace with actual user fetch
  })

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">Welcome back, {user?.name}</h1>
      <p className="text-muted-foreground mt-2">
        Here's what's happening with your time exchanges
      </p>
    </div>
  )
}

export default HomeHeader
