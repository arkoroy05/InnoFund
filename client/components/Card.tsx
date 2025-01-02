"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Users, TrendingUp, Award } from 'lucide-react'

interface ResearchFundingCardProps {
  title: string
  field: string
  timeline: string
  potentialImpact: string
  teamSize: number
  author?: {
    name: string
    credentials: string
  }
  currentFunding: number
  goalFunding: number
  backers: number
  daysLeft: number
}
export default function ResearchFundingCard({
    title,
    field,
    timeline,
    potentialImpact,
    teamSize,
    author,
    currentFunding,
    goalFunding,
    backers,
    daysLeft
  }: ResearchFundingCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const progress = (currentFunding / goalFunding) * 100
    const fundedPercentage = Math.round(progress)
  return (
    <Card 
    className="w-full max-w-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-br from-green-900 to-black dark:from-gray-800 dark:to-gray-900"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <CardHeader className="relative pb-2">
      <div className="absolute top-2 right-2 flex space-x-2">
        <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
          {daysLeft} days ago
        </Badge>
      </div>
      <CardTitle className="text-2xl font-bold text-white dark:text-gray-100 mb-2">{title}</CardTitle>
      <div className="flex items-center space-x-2 mb-2">
        <Avatar className="h-8 w-8">
          {author?.avatar ? (
            <AvatarImage src={author.avatar} alt={author.name || 'Author'} />
          ) : (
            <AvatarFallback>{author?.name?.[0] || 'A'}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <span className="text-sm font-medium text-white dark:text-gray-300">{author?.name}</span>
          <p className="text-xs text-white dark:text-gray-400">{author?.credentials}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-white dark:text-gray-400" />
                <span className="text-sm text-white dark:text-gray-300">{timeline}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Timeline of the research</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-white dark:text-gray-400" />
                <span className="text-xs text-white dark:text-gray-300">{teamSize} researchers</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Size of the research team</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-white dark:text-gray-400" />
                <span className="text-sm text-white dark:text-gray-300">{field}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{potentialImpact}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-white dark:text-gray-400" />
                <span className="text-sm text-white dark:text-gray-300">{backers} backers</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of project backers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-2">
        <Progress value={progress} className="h-2 bg-blue-200 dark:bg-blue-700" />
        <div className="flex justify-between text-sm font-medium text-white dark:text-gray-300">
          <span>{currentFunding} AVAX raised</span>
          <span>Goal: {goalFunding} AVAX</span>
        </div>
      </div>
      <div className="mt-2 text-right text-sm text-white dark:text-gray-400">
        {fundedPercentage}% funded
      </div>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full py-6 text-lg font-semibold transition-all duration-300 ease-in-out ${
            isHovered ? 'bg-red-600 text-white' : 'bg-white text-blue-600'
          }`}
          style={{
            boxShadow: isHovered ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <svg
            className="w-6 h-6 mr-2 inline-block"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M200 400C310.457 400 400 310.457 400 200C400 89.5431 310.457 0 200 0C89.5431 0 0 89.5431 0 200C0 310.457 89.5431 400 200 400Z"
              fill={isHovered ? "white" : "#E84142"}
            />
            <path
              d="M200.12 61L200 103.97V268.79L200.12 268.91L279.06 221.41L200.12 61Z"
              fill={isHovered ? "#E84142" : "white"}
            />
            <path
              d="M200.12 61L121.17 221.41L200.12 268.91V171.52V61Z"
              fill={isHovered ? "#E84142" : "white"}
              fillOpacity="0.8"
            />
            <path
              d="M200.12 339L200 339.13V339.14L279.08 239.63L200.12 287.09V339Z"
              fill={isHovered ? "#E84142" : "white"}
            />
            <path
              d="M200.12 339.14V287.09L121.17 239.63L200.12 339.14Z"
              fill={isHovered ? "#E84142" : "white"}
              fillOpacity="0.8"
            />
          </svg>
          Donate with AVAX
        </Button>
      </CardFooter>
    </Card>
  )
}

