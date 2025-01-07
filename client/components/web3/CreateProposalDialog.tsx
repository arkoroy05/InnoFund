'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWriteContract, useWatchContractEvent } from 'wagmi'
import { PROJECT_DAO_ABI, PROJECT_DAO_ADDRESS } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'

interface CreateProposalDialogProps {
  projectId: string
}

export function CreateProposalDialog({ projectId }: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('GENERAL')
  const { toast } = useToast()

  const { writeContract, isError, isPending, isSuccess } = useWriteContract()

  // Watch for the ProposalCreated event
  useWatchContractEvent({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    eventName: 'ProposalCreated',
    onLogs(logs) {
      console.log('New proposal created:', logs)
      toast({
        title: 'Success!',
        description: 'Your proposal has been created.',
      })
      setOpen(false)
      setTitle('')
      setDescription('')
      setCategory('GENERAL')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await writeContract({
        address: PROJECT_DAO_ADDRESS,
        abi: PROJECT_DAO_ABI,
        functionName: 'createProposal',
        args: [BigInt(projectId), description, category],
      })
    } catch (error) {
      console.error('Failed to create proposal:', error)
      toast({
        title: 'Error',
        description: 'Failed to create proposal. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Proposal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Proposal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Select value={category} onValueChange={setCategory} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="TECHNICAL">Technical</SelectItem>
                <SelectItem value="COMMUNITY">Community</SelectItem>
                <SelectItem value="FINANCIAL">Financial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
