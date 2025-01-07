'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { PROJECT_DAO_ABI, PROJECT_DAO_ADDRESS } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/progress'

interface ProposalCardProps {
  proposalId: bigint
  projectId: string
}

export function ProposalCard({ proposalId, projectId }: ProposalCardProps) {
  const { toast } = useToast()
  const [vote, setVote] = useState<'for' | 'against' | 'abstain' | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  const { data: proposalData, isError: proposalError } = useReadContract({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'proposalDetails',
    args: [proposalId],
  })

  const { data: voteCounts, isError: voteCountsError } = useReadContract({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'proposalVotes',
    args: [proposalId],
  })

  const { writeContract } = useWriteContract()

  // Watch for the ProposalVoted event
  useWatchContractEvent({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    eventName: 'ProposalVoted',
    onLogs(logs) {
      console.log('Vote cast:', logs)
      toast({
        title: 'Vote Cast Successfully',
        description: 'Your vote has been recorded on the blockchain.',
        variant: 'default',
      })
      setVote(null)
      setIsVoting(false)
    },
  })

  const handleVote = async (voteType: 'for' | 'against' | 'abstain') => {
    try {
      setIsVoting(true)
      await writeContract({
        address: PROJECT_DAO_ADDRESS,
        abi: PROJECT_DAO_ABI,
        functionName: 'castVote',
        args: [proposalId, voteType === 'for' ? 1 : voteType === 'against' ? 0 : 2],
      })
    } catch (error) {
      console.error('Error casting vote:', error)
      toast({
        title: 'Error Casting Vote',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
      setIsVoting(false)
    }
  }

  if (!proposalData || !voteCounts) return null

  const [title, description, deadline, status] = proposalData
  const [forVotes, againstVotes, abstainVotes] = voteCounts
  const totalVotes = Number(forVotes) + Number(againstVotes) + Number(abstainVotes)
  const forPercentage = totalVotes > 0 ? (Number(forVotes) / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (Number(againstVotes) / totalVotes) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>For: {forVotes.toString()}</span>
            <span>Against: {againstVotes.toString()}</span>
            <span>Abstain: {abstainVotes.toString()}</span>
          </div>
          <Progress value={forPercentage} className="bg-red-200">
            <div
              className="h-full bg-green-500"
              style={{ width: `${forPercentage}%` }}
            />
            <div
              className="h-full bg-red-500"
              style={{ width: `${againstPercentage}%` }}
            />
          </Progress>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Status: {status}
          </p>
          <p className="text-sm text-muted-foreground">
            Deadline: {new Date(Number(deadline) * 1000).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => handleVote('for')}
          disabled={isVoting || status !== 'Active'}
        >
          For
        </Button>
        <Button
          variant="outline"
          onClick={() => handleVote('against')}
          disabled={isVoting || status !== 'Active'}
        >
          Against
        </Button>
        <Button
          variant="outline"
          onClick={() => handleVote('abstain')}
          disabled={isVoting || status !== 'Active'}
        >
          Abstain
        </Button>
      </CardFooter>
    </Card>
  )
}
