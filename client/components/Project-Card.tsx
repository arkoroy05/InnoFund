import { formatDate } from "@/lib/utils"
import { useState } from "react"

interface Project {
  id: string
  title: string
  description: string
  createdAt: Date
  name: string
  about: string
}
interface ProjectCardProps {
  project: Project
  onDelete?: (id: string) => Promise<void>
}
export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return
    
    try {
      setIsDeleting(true)
      await onDelete(project.id)
    } catch (error) {
      console.error('Failed to delete project:', error)
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 mb-4 sm:mb-0">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
            {!showConfirmation ? (
              <button
                onClick={() => setShowConfirmation(true)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                disabled={isDeleting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isDeleting}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Created on {formatDate(project.createdAt)}
          </p>
        </div>
        <div className="sm:w-2/3 sm:pl-6 sm:border-l border-gray-200">
          <p className="text-gray-600">{project.about}</p>
        </div>
      </div>
    </div>
  )
}