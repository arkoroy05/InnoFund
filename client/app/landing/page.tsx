"use client"
import React from 'react'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Canvas'), { ssr: false })
const ThreeEnabled = true;
const Landing = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'> 
      {ThreeEnabled && <div className="absolute inset-0"><Scene /></div>}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-3xl font-sans font-medium">
        Fund your research papers with Crypto
      </div>
    </div>
  )
}

export default Landing

