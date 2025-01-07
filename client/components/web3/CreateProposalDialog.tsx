'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWriteContract, useWatchContractEvent, useAccount, useReadContract } from 'wagmi'
import { PROJECT_DAO_ABI, PROJECT_DAO_ADDRESS, REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'
import { parseEther } from 'viem'

interface CreateProposalDialogProps {
  projectId: string
}

export function CreateProposalDialog({ projectId }: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('GENERAL')
  const { toast } = useToast()
  const { address } = useAccount()

  const { writeContract, isError, isPending, isSuccess } = useWriteContract()

  // Read user's token balance
  const { data: tokenBalance } = useReadContract({
    address: REWARD_TOKEN_ADDRESS,
    abi: REWARD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
  })

  // Watch for the ProposalCreated event
  useWatchContractEvent({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    eventName: 'ProposalCreated',
    onLogs(logs) {
      console.log('New proposal created:', logs)
      toast({
        title: 'Success!',
        description: 'Your proposal has been created. Voting will start after a short delay.',
      })
      setOpen(false)
      setTitle('')
      setDescription('')
      setCategory('GENERAL')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      })
      return
    }

    if (!tokenBalance || tokenBalance === BigInt(0)) {
      toast({
        title: 'Error',
        description: 'You need to hold reward tokens to create a proposal.',
        variant: 'destructive',
      })
      return
    }

    if (!title || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      })
      return
    }

    const proposalDescription = `${title}\n\n${description}`
    
    try {
      // Create an empty proposal since we're just doing polls
      const targets: `0x${string}`[] = []
      const values: bigint[] = []
      const calldatas: `0x${string}`[] = []

      await writeContract({
        address: PROJECT_DAO_ADDRESS,
        abi: PROJECT_DAO_ABI,
        functionName: 'propose',
        args: [targets, values, calldatas, proposalDescription],
      })

      toast({
        title: 'Creating Proposal',
        description: 'Please wait while your proposal is being created...',
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
        <Button variant="outline">Create Poll</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Poll</DialogTitle>
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
                <SelectItem value="FUND_ALLOCATION">Fund Allocation</SelectItem>
                <SelectItem value="RESEARCH_DIRECTION">Research Direction</SelectItem>
                <SelectItem value="EMERGENCY">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Poll'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
