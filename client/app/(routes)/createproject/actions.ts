'use server'

import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  // Here you would typically save the project data to your database
  // and handle file uploads

  // Extract form data
  const name = formData.get('name') as string
  const about = formData.get('about') as string
  const teamMembers = formData.getAll('teamMembers') as string[]
  const timeline = new Date(formData.get('timeline') as string)
  const links = formData.getAll('links') as string[]
  const citations = formData.get('citations') as string
  const goalAmount = Number(formData.get('goalAmount'))

  // Handle PDF uploads
  const pdfs: { name: string; size: number; type: string }[] = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('pdf-') && value instanceof File) {
      pdfs.push({
        name: value.name,
        size: value.size,
        type: value.type,
      })
      // Here you would typically upload the file to a storage service
      // For example: await uploadToStorage(value)
    }
  }

  // Log the project data (replace with database insertion in a real app)
  console.log('Creating project:', {
    name,
    about,
    teamMembers,
    timeline,
    links,
    citations,
    goalAmount,
    pdfs,
  })

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Revalidate the projects page
  revalidatePath('/projects')

  return { success: true }
}

