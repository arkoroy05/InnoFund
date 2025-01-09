'use client'

import { useState, useMemo, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWriteContract, useWatchContractEvent, useAccount, useReadContract } from 'wagmi'
import { PROJECT_DAO_ABI, PROJECT_DAO_ADDRESS, REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS, FUNDING_CONTRACT_ABI, FUNDING_CONTRACT_ADDRESS } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'
import { formatEther, parseEther } from 'viem'

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

  // Sanitize project ID
  const safeProjectId = useMemo(() => {
    const sanitized = projectId.replace(/[^0-9]/g, '')
    return sanitized || '0'
  }, [projectId])

  // Read user's token balance
  const { data: tokenBalance } = useReadContract({
    address: REWARD_TOKEN_ADDRESS,
    abi: REWARD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  })

  // Read project details to check if user is creator
  const { data: projectDetails } = useReadContract({
    address: FUNDING_CONTRACT_ADDRESS,
    abi: FUNDING_CONTRACT_ABI,
    functionName: 'getProject',
    args: [BigInt(safeProjectId)],
    enabled: !!safeProjectId && !!address && safeProjectId !== '0',
  })

  // Debug logging
  useEffect(() => {
    if (projectDetails) {
      console.log('Project Details:', {
        name: projectDetails[0],
        description: projectDetails[1],
        creator: projectDetails[2],
        currentAddress: address,
        isCreator: projectDetails[2] === address
      })
    }
  }, [projectDetails, address])

  const isProjectCreator = projectDetails && address && projectDetails[2].toLowerCase() === address.toLowerCase()
  const hasEnoughTokens = tokenBalance && tokenBalance > BigInt(0)
  const canCreateProposal = isProjectCreator || hasEnoughTokens

  // Debug logging for access control
  useEffect(() => {
    console.log('Access Control:', {
      address,
      projectCreator: projectDetails?.[2],
      isProjectCreator,
      hasEnoughTokens,
      canCreateProposal,
      tokenBalance: tokenBalance ? formatEther(tokenBalance) : '0'
    })
  }, [address, projectDetails, isProjectCreator, hasEnoughTokens, canCreateProposal, tokenBalance])

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
        description: 'Please connect your wallet to create a proposal',
        variant: 'destructive',
      })
      return
    }

    if (!isProjectCreator && (!tokenBalance || tokenBalance === BigInt(0))) {
      toast({
        title: 'Error',
        description: 'You need reward tokens to create a proposal',
        variant: 'destructive',
      })
      return
    }

    try {
      if (!safeProjectId || safeProjectId === '0') {
        throw new Error('Invalid project ID')
      }

      await writeContract({
        address: PROJECT_DAO_ADDRESS,
        abi: PROJECT_DAO_ABI,
        functionName: 'createProposal',
        args: [BigInt(safeProjectId), title, description],
      })
    } catch (error) {
      console.error('Error creating proposal:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create proposal',
        variant: 'destructive',
      })
    }
  }

  // Debug logging for render conditions
  useEffect(() => {
    console.log('Render Conditions:', {
      safeProjectId,
      projectDetailsExist: !!projectDetails,
      addressExists: !!address,
      shouldRender: canCreateProposal
    })
  }, [safeProjectId, projectDetails, address, canCreateProposal])

  if (!canCreateProposal) {
    console.log('Component not rendered because canCreateProposal is false')
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {isProjectCreator ? 'Create Proposal (Project Creator)' : 'Create Proposal (Token Holder)'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Proposal</DialogTitle>
          {!isProjectCreator && hasEnoughTokens && (
            <p className="text-sm text-muted-foreground">
              Token Balance: {formatEther(tokenBalance || BigInt(0))} tokens
            </p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="TECHNICAL">Technical</SelectItem>
                <SelectItem value="FINANCIAL">Financial</SelectItem>
                <SelectItem value="GOVERNANCE">Governance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Proposal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
