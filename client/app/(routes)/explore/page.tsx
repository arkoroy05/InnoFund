"use client"
import { useState, useEffect } from 'react'
import React from 'react'
import FundingCard from '@/components/FundingCard'
import { Search } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Input } from '@/components/ui/input'


interface Author {
  username: string;
  name: string;
  photoURL: string;
}

interface Project {
  id: string;
  name: string;
  designation?: string;
  timeline: string;
  links: string[];
  about?: string;
  createdAt: string;
  author: Author;
  currentFunding: number;
  goalAmount: number;
  userAnonimity: boolean;
}

const ExplorePage = () => {
  const { address } = useAccount()
  //address variable is accessable here


  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/feed")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch projects')
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])


  const projectClick = (project: Project) => {
    
  }

  if (isLoading) {
    return (
      <div className="relative top-[3.5rem] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-3xl">getting those innovations for you</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative top-[3.5rem] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative top-[3.5rem] min-h-screen">
      <h1 className="text-4xl font-bold my-6 mx-20 flex items-center">
        Explore <Search className="h-8 w-8 mx-2" />
      </h1>
      <div className='mx-20'>
      <Input placeholder="Search"  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-20 mt-5">
        {projects.filter((project) => project?.name.toLowerCase().startsWith(searchTerm.toLowerCase())).map((project) => (
          <FundingCard
            key={Number(project.id)}
            id={project.id}
            title={project?.name || "No title provided."}
            field={project?.designation || "No field provided."}
            desc={project?.about || "No description provided."}
            timeposted={new Date(project?.createdAt) || null}
            author={project?.author || "no author present"}
            currentFunding={project?.currentFunding || 0}
            primaryLink={project?.links[0] || "/explore"}
            goalFunding={project?.goalAmount || 0}
            userAnonimity={project?.userAnonimity || false}
            completionTime={new Date(project?.timeline) || null}
          /> 
        ))}
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">quite empty innit?</p>
        </div>
      )}
    </div>
  )
}

export default ExplorePage
