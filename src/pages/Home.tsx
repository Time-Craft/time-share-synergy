
import React from "react"
import HomeHeader from "@/components/home/HomeHeader"
import QuickStats from "@/components/home/QuickStats"
import PendingOffers from "@/components/home/PendingOffers"
import StatsCards from "@/components/home/StatsCards"
import { useOfferSubscription } from "@/hooks/useOfferSubscription"

const Home = () => {
  // Use the offer subscription hook to enable real-time updates
  useOfferSubscription()
  
  return (
    <div className="container mx-auto p-6">
      <HomeHeader />
      <QuickStats />
      <div className="space-y-6">
        <PendingOffers />
        <StatsCards />
      </div>
    </div>
  )
}

export default Home
