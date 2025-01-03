'use client'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CalendarIcon, PlusCircle, X, Paperclip } from 'lucide-react'
import { format } from 'date-fns'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  about: z.string().min(10, {
    message: 'About section must be at least 10 characters.',
  }),
  teamMembers: z.array(z.string()).min(1, {
    message: 'Please add at least one team member.',
  }),
  timeline: z.date({
    required_error: 'Please select a completion date.',
  }),
  links: z.array(z.string().url({ message: 'Please enter a valid URL.' })).optional(),
  citations: z.string().optional(),
  goalAmount: z.number().positive({
    message: 'Goal amount must be a positive number.',
  }),
  pdfs: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })
    )
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateProjectForm() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState([''])
  const [links, setLinks] = useState([''])
  const [pdfs, setPdfs] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      about: '',
      teamMembers: [''],
      timeline: new Date(),
      links: [''],
      citations: '',
      goalAmount: 0,
      pdfs: [],
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      setError(null)
      
      // Create FormData object
      const formData = new FormData()
      
      // Add all regular form fields
      formData.append('name', values.name)
      formData.append('about', values.about)
      // Filter out empty team members
      const filteredTeamMembers = values.teamMembers.filter(member => member.trim() !== '')
      filteredTeamMembers.forEach(member => formData.append('teamMembers[]', member))
      formData.append('timeline', values.timeline.toISOString())
      
      // Filter out empty links
      if (values.links) {
        const filteredLinks = values.links.filter(link => link.trim() !== '')
        filteredLinks.forEach(link => formData.append('links[]', link))
      }
      
      // Only append citations if it exists
      if (values.citations) {
        formData.append('citations', values.citations)
      }
      
      formData.append('goalAmount', values.goalAmount.toString())
      
      // Add PDF files with proper error handling
      for (let i = 0; i < pdfs.length; i++) {
        const pdf = pdfs[i]
        if (pdf.size > MAX_FILE_SIZE) {
          throw new Error(`File ${pdf.name} exceeds the 5MB size limit`)
        }
        if (!ACCEPTED_FILE_TYPES.includes(pdf.type)) {
          throw new Error(`File ${pdf.name} is not a PDF`)
        }
        formData.append(`pdfs[]`, pdf)
      }
      const requestBody = {
        name: values.name,
        about: values.about,
        teamMembers: values.teamMembers.filter(member => member.trim() !== ''),
        timeline: values.timeline.toISOString(),
        links: values.links ? values.links.filter(link => link.trim() !== '') : [],
        citations: values.citations || '',
        goalAmount: values.goalAmount,
        pdfs: pdfs.map(pdf => ({
          name: pdf.name,
          size: pdf.size,
          type: pdf.type
        }))
      }


      // Submit to API with proper error handling
      const response = await axios.post('/api/projects', requestBody).catch(error => {
        console.error('Failed to create project:', error)
        throw error
      })

      if (response.status !== 200) {
        throw new Error('Failed to create project')
      }

      // Redirect on success
      router.push('/projects')
      router.refresh()
      
    } catch (error) {
      console.error('Failed to create project:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ''])
  }

  const removeTeamMember = (index: number) => {
    const newTeamMembers = teamMembers.filter((_, i) => i !== index)
    setTeamMembers(newTeamMembers)
  }

  const addLink = () => {
    setLinks([...links, ''])
  }

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) =>
          file.size <= MAX_FILE_SIZE && ACCEPTED_FILE_TYPES.includes(file.type)
      )
      setPdfs((prevPdfs) => [...prevPdfs, ...validFiles])
      form.setValue(
        'pdfs',
        validFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      )
    }
  }

  const removePdf = (index: number) => {
    setPdfs((prevPdfs) => prevPdfs.filter((_, i) => i !== index))
    form.setValue(
      'pdfs',
      pdfs
        .filter((_, i) => i !== index)
        .map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} className="max-w-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Project</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your project"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="Enter team member name"
                            value={member}
                            onChange={(e) => {
                              const newTeamMembers = [...teamMembers];
                              newTeamMembers[index] = e.target.value;
                              setTeamMembers(newTeamMembers);
                              field.onChange(newTeamMembers.filter(Boolean));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeTeamMember(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <Button type="button" variant="outline" onClick={addTeamMember}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project Completion Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date("2100-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Links</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {links.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="https://example.com"
                            value={link}
                            onChange={(e) => {
                              const newLinks = [...links]
                              newLinks[index] = e.target.value
                              setLinks(newLinks)
                              field.onChange(newLinks.filter(Boolean))
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLink(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <Button type="button" variant="outline" onClick={addLink}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="citations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add your citations here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Amount (AVAX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter goal amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full md:w-64 space-y-8">
            <FormField
              control={form.control}
              name="pdfs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach PDFs</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handleFileChange}
                      />
                      {pdfs.map((pdf, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm truncate">{pdf.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removePdf(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Attach relevant PDF documents (max 5MB each)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Project'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

