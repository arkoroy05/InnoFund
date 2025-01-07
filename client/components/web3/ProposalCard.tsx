'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReadContract, useWriteContract, useWatchContractEvent, useAccount } from 'wagmi'
import { PROJECT_DAO_ABI, PROJECT_DAO_ADDRESS, REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatEther } from 'viem'

interface ProposalCardProps {
  proposalId: bigint
  projectId: string
}

export function ProposalCard({ proposalId, projectId }: ProposalCardProps) {
  const { toast } = useToast()
  const { address } = useAccount()
  const [vote, setVote] = useState<'for' | 'against' | 'abstain' | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  // Read proposal details
  const { data: proposalData, isError: proposalError } = useReadContract({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'proposalDetails',
    args: [proposalId],
  })

  // Read vote counts
  const { data: voteCounts, isError: voteCountsError } = useReadContract({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'proposalVotes',
    args: [proposalId],
  })

  // Read proposal state
  const { data: proposalState } = useReadContract({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'state',
    args: [proposalId],
  })

  // Read user's voting power
  const { data: votingPower } = useReadContract({
    address: REWARD_TOKEN_ADDRESS,
    abi: REWARD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
  })

  // Read if user has voted
  const { data: hasVoted } = useReadContract({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'hasVoted',
    args: [proposalId, address],
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
        description: 'Your vote has been recorded. Weight: ' + formatEther(votingPower || BigInt(0)) + ' tokens',
        variant: 'default',
      })
      setVote(null)
      setIsVoting(false)
    },
  })

  const handleVote = async (voteType: 'for' | 'against' | 'abstain') => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet to vote',
        variant: 'destructive',
      })
      return
    }

    if (!votingPower || votingPower === BigInt(0)) {
      toast({
        title: 'Error',
        description: 'You need reward tokens to vote',
        variant: 'destructive',
      })
      return
    }

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

  // Get proposal state text
  const getStateText = (state: number) => {
    switch (state) {
      case 0: return 'Pending'
      case 1: return 'Active'
      case 2: return 'Canceled'
      case 3: return 'Defeated'
      case 4: return 'Succeeded'
      case 5: return 'Queued'
      case 6: return 'Expired'
      case 7: return 'Executed'
      default: return 'Unknown'
    }
  }

  const stateText = getStateText(Number(proposalState || 0))
  const isActive = stateText === 'Active'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={isActive ? 'default' : 'secondary'}>{stateText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>For: {formatEther(forVotes)} tokens</span>
            <span>Against: {formatEther(againstVotes)} tokens</span>
            <span>Abstain: {formatEther(abstainVotes)} tokens</span>
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
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Total Votes: {formatEther(BigInt(totalVotes))} tokens</p>
          {address && (
            <>
              <p>Your Voting Power: {formatEther(votingPower || BigInt(0))} tokens</p>
              {hasVoted && <p>You have already voted on this proposal</p>}
            </>
          )}
          <p>
            {isActive
              ? `Voting ends: ${new Date(Number(deadline) * 1000).toLocaleString()}`
              : `Ended: ${new Date(Number(deadline) * 1000).toLocaleString()}`
            }
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => handleVote('for')}
          disabled={isVoting || !isActive || hasVoted || !votingPower || votingPower === BigInt(0)}
        >
          For
        </Button>
        <Button
          variant="outline"
          onClick={() => handleVote('against')}
          disabled={isVoting || !isActive || hasVoted || !votingPower || votingPower === BigInt(0)}
        >
          Against
        </Button>
        <Button
          variant="outline"
          onClick={() => handleVote('abstain')}
          disabled={isVoting || !isActive || hasVoted || !votingPower || votingPower === BigInt(0)}
        >
          Abstain
        </Button>
      </CardFooter>
    </Card>
  )
}
