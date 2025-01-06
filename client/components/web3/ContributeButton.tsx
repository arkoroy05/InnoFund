'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAccount, useWriteContract, useWatchContractEvent } from 'wagmi'
import { parseEther } from 'viem'
import { FUNDING_CONTRACT_ABI, FUNDING_CONTRACT_ADDRESS } from '@/lib/contracts'

interface ContributeButtonProps {
  projectId: string
  onSuccess?: () => void
}

export function ContributeButton({ projectId, onSuccess }: ContributeButtonProps) {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const { toast } = useToast()

  const { writeContract, isPending } = useWriteContract()

  // Watch for the ProjectFunded event
  useWatchContractEvent({
    address: FUNDING_CONTRACT_ADDRESS,
    abi: FUNDING_CONTRACT_ABI,
    eventName: 'ProjectFunded',
    onLogs(logs) {
      console.log('Contribution successful:', logs)
      toast({
        title: 'Success!',
        description: `Successfully contributed ${amount} ETH to the project.`,
      })
      setAmount('')
      onSuccess?.()
    },
  })

  const handleContribute = async () => {
    if (!amount || !address) return

    try {
      await writeContract({
        address: FUNDING_CONTRACT_ADDRESS,
        abi: FUNDING_CONTRACT_ABI,
        functionName: 'contribute',
        args: [BigInt(projectId)],
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Failed to contribute:', error)
      toast({
        title: 'Error',
        description: 'Failed to contribute. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={!address || isPending}
        min="0"
        step="0.01"
      />
      <Button
        onClick={handleContribute}
        disabled={!address || !amount || isPending}
      >
        {isPending ? 'Contributing...' : 'Contribute'}
      </Button>
    </div>
  )
}
