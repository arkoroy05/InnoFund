"use client"
import React from 'react'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Canvas'), { ssr: false })
const Landing = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'> 
      <Scene /> 
    </div>
  )
}

export default Landing

