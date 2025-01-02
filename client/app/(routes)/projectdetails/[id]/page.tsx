"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useReadMore } from '@/hooks/useReadMore'
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Team } from '@/components/Team'



const Page = ({ params }: { params: { id: string } }) => {
  const [isHovered, setIsHovered] = useState(false);

  const projectName = "NAME OF PROJECT"
  const projectDescription = "EcoHarvest is an innovative project aimed at revolutionizing farming practices through sustainable methods and cutting-edge technology. Our goal is to increase crop yields while minimizing environmental impact. We focus on implementing smart irrigation systems, organic pest control, and soil health management techniques. By leveraging IoT devices and AI-driven analytics, we empower farmers to make data-driven decisions, optimize resource usage, and adapt to changing climate conditions. Join us in creating a greener, more productive agricultural future!"
  const author = { name: "Dr. Emily Green", designation: "Agricultural Scientist & Sustainability Expert" }
  const citations = [
    "Smith, J. et al. (2022). 'Sustainable Farming Practices in the Digital Age', Journal of Agricultural Innovation, 15(2), 78-95.",
    "Brown, A. (2023). 'The Impact of IoT on Modern Agriculture', Tech in Farming Quarterly, 8(1), 112-128."
  ]
  const links = [
    { name: "Project Website", url: "https:google.com" },
    { name: "Research Paper", url: "https:google.com" },
    { name: "Partner Organizations", url: "hhttps:google.com" }
  ]
  const teamMembers = [
    { name: "Dr. Emily Green", role: "Project Lead", avatarUrl: "/placeholder.svg?height=100&width=100" },
    { name: "John Smith", role: "Agricultural Engineer", avatarUrl: "/placeholder.svg?height=100&width=100" },
    { name: "Sarah Johnson", role: "Data Scientist", avatarUrl: "/placeholder.svg?height=100&width=100" },
    { name: "Michael Chen", role: "IoT Specialist", avatarUrl: "/placeholder.svg?height=100&width=100" }
  ]
  const { displayText, isExpanded, toggleReadMore, shouldShowReadMore } = useReadMore(projectDescription, 200)

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-4xl font-bold mb-6 text-white">{projectName}</h1>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Project Description</h2>
                <p className="text-gray-700">
                  {displayText}
                  {shouldShowReadMore && (
                    <Button
                      variant="link"
                      onClick={toggleReadMore}
                      className="pl-1 text-green-600 hover:text-green-800"
                    >
                      {isExpanded ? (
                        <>Less <ChevronUp className="ml-1 h-4 w-4" /></>
                      ) : (
                        <>More <ChevronDown className="ml-1 h-4 w-4" /></>
                      )}
                    </Button>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-700">Author</h2>
                <p className="text-gray-700 font-medium">{author.name}</p>
                <p className="text-gray-600">{author.designation}</p>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-700">Team Members</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member, index) => (
                    <Team key={index} {...member} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-700">Citations</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {citations.map((citation, index) => (
                    <li key={index} className="text-gray-700">{citation}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1">
            <div className="sticky top-8">
              <Button
                className="w-full mb-8 py-6 text-lg font-semibold transition-all duration-300 ease-in-out"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Donate in AVAX
              </Button>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-green-700">Relevant Links</h2>
                  <ul className="space-y-2">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {link.name}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
