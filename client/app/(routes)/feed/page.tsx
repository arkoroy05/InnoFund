"use client"
import React, { useEffect } from 'react'
import { useAuth, UserButton, useUser } from '@clerk/nextjs'
import ResearchFundingCard from '@/components/Card'
import Link from 'next/link'

const page = () => {
  const { user } = useUser()
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black text-white'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold'>
            Welcome, {user?.firstName} 👋
          </h1>
          <UserButton />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min'>
        <Link href={`/projectdetails/name`} className="transition-transform hover:scale-105">
            <ResearchFundingCard
              title='name' 
              field='field' 
              timeline='timeline' 
              potentialImpact='potentialImpact' 
              teamSize={100} 
              author={{name:'author name',credentials:'author credentials'}} 
              currentFunding={25} 
              goalFunding={50} 
              backers={1} 
              daysLeft={1}
            />
          </Link>
          <ResearchFundingCard 
            title='name' 
            field='field' 
            timeline='timeline' 
            potentialImpact='potentialImpact' 
            teamSize={100} 
            author={{name:'author name',credentials:'author credentials'}} 
            currentFunding={25} 
            goalFunding={50} 
            backers={1} 
            daysLeft={1}
          />
          <ResearchFundingCard 
            title='name' 
            field='field' 
            timeline='timeline' 
            potentialImpact='potentialImpact' 
            teamSize={100} 
            author={{name:'author name',credentials:'author credentials'}} 
            currentFunding={25} 
            goalFunding={50} 
            backers={1} 
            daysLeft={1}
          />
        </div>
      </div>
    </div>
  )
}

export default page
