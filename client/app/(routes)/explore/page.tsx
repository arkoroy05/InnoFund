"use client"
import { useState, useEffect } from 'react'
import React from 'react'
import FundingCard from '@/components/FundingCard'
import { Search } from 'lucide-react'

interface Author {
  username: string;
  name: string;
  photoURL: string;
}

interface Project {
  id: string;
  name: string;
  field: string;
  desc?: string;
  timePosted: string;
  author?: Author;
  currentFunding: number;
  goalFunding: number;
  primaryLink?: string;
  userAnonimity: boolean;
}

const ExplorePage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        console.log(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch projects')
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <div className="relative top-[3.5rem] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-xl">Loading projects...</div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-20">
        {projects.map((project) => (
          <FundingCard
            key={Number(project.id)}
            title={project.name}
            field={project.designation}
            desc={project.about || "No description provided."}
            timeposted={new Date(project.timePosted)}
            author={project.author}
            currentFunding={project.currentFunding}
            primaryLink={project.links[0] || "/explore"}
            goalFunding={project.goalAmount}
            userAnonimity={project.userAnonimity}
          />
        ))}
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No projects found.</p>
        </div>
      )}
    </div>
  )
}

export default ExplorePage
