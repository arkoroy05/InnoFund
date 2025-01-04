import { formatDate } from "@/lib/utils"

interface Project {
  id: number
  title: string
  description: string
  createdAt: Date
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <p className="text-sm text-gray-500">
        Created on {formatDate(project.createdAt)}
      </p>
    </div>
  )
}

