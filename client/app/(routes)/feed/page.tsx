"use client"
import React, { useState, useEffect } from 'react'
import { useAuth, UserButton, useUser } from '@clerk/nextjs'
import ResearchFundingCard from '@/components/Card'
import Link from 'next/link'
import axios from 'axios'

const page = () => {
  const { user } = useUser()
  const[data,setData]=useState([])
  useEffect(() => {
    if(user){
      axios.get("/api/feed").then((res) => {
        setData(res.data)
      })
    }
  })

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black text-white'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold'>
            Welcome, {user?.firstName} 👋
          </h1>
          <UserButton />
        </div>

        {/* the card component will go here*/}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min'>
          {data.map((item: any) => (
            <Link href={`/projectdetails/${item.id}`} key={item.id}>
              <ResearchFundingCard 
                title={item.name} 
                field={item.field} 
                timeline={item.timeline} 
                potentialImpact={item.potentialImpact} 
                teamSize={item.teamSize} 
                author={item.author} 
                currentFunding={item.currentFunding} 
                goalFunding={item.goalFunding} 
                backers={item.backers} 
                daysLeft={item.daysLeft}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
