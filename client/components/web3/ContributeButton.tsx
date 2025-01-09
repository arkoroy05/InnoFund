'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAccount, useWriteContract, useWatchContractEvent, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { FUNDING_CONTRACT_ABI, FUNDING_CONTRACT_ADDRESS } from '@/lib/contracts'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'

interface ContributeButtonProps {
  projectId: string
  onSuccess?: () => void
}

export function ContributeButton({ projectId, onSuccess }: ContributeButtonProps) {
  const [amount, setAmount] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { address } = useAccount()
  const { toast } = useToast()

  // Get user's AVAX balance
  const { data: balance } = useBalance({
    address: address,
  })

  const { writeContract, isPending } = useWriteContract()

  // Calculate platform fee and project amount
  const { platformFee, projectAmount, totalAmount } = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      return { platformFee: '0', projectAmount: '0', totalAmount: '0' }
    }
    const total = parseFloat(amount)
    const fee = total * 0.0275 // 2.75%
    const project = total - fee
    return {
      platformFee: fee.toFixed(6),
      projectAmount: project.toFixed(6),
      totalAmount: total.toFixed(6)
    }
  }, [amount])

  // Watch for the ContributionMade event
  useWatchContractEvent({
    address: FUNDING_CONTRACT_ADDRESS,
    abi: FUNDING_CONTRACT_ABI,
    eventName: 'ContributionMade',
    onLogs(logs) {
      console.log('Contribution successful:', logs)
      updateFirebaseProject()
      toast({
        title: 'Success!',
        description: `Successfully contributed ${amount} AVAX to the project.`,
      })
      setAmount('')
      setIsOpen(false)
      onSuccess?.()
    },
  })

  // Update Firebase project data
  const updateFirebaseProject = async () => {
    try {
      const projectRef = doc(db, 'projects', projectId)
      const projectDoc = await getDoc(projectRef)
      
      if (projectDoc.exists()) {
        const currentData = projectDoc.data()
        await updateDoc(projectRef, {
          currentFunding: (parseFloat(currentData.currentFunding || '0') + parseFloat(totalAmount)).toString(),
          contributors: [...new Set([...(currentData.contributors || []), address])]
        })
      }
    } catch (error) {
      console.error('Error updating Firebase:', error)
    }
  }

  const handleContribute = async () => {
    if (!amount || !address) return

    try {
      // Convert projectId to a valid format for BigInt
      const safeProjectId = projectId.replace(/[^0-9]/g, '')
      if (!safeProjectId) {
        throw new Error('Invalid project ID')
      }

      // Check if user has enough balance
      const requiredAmount = parseFloat(amount)
      const userBalance = parseFloat(balance?.formatted || '0')
      
      if (userBalance < requiredAmount) {
        throw new Error('Insufficient AVAX balance')
      }

      await writeContract({
        address: FUNDING_CONTRACT_ADDRESS,
        abi: FUNDING_CONTRACT_ABI,
        functionName: 'contribute',
        args: [BigInt(safeProjectId)],
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Failed to contribute:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to contribute to project',
        variant: 'destructive',
      })
    }
  }

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Please connect your wallet to contribute to this project.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund The Innovation</CardTitle>
        <CardDescription>Support groundbreaking research and innovation projects on Avalanche</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Details</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount in AVAX"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="flex-1"
            />
            <Button onClick={handleContribute} disabled={!amount || isPending || !address}>
              {isPending ? 'Contributing...' : 'Contribute'}
            </Button>
          </div>
        </div>

        {amount && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium">Transaction Information</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Your Balance:</span>
                  <span>{balance?.formatted || '0'} AVAX</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{totalAmount} AVAX</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform Fee (2.75%):</span>
                  <span>{platformFee} AVAX</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Receives:</span>
                  <span>{projectAmount} AVAX</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Network:</span>
                  <span>Avalanche C-Chain</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Gas Fee (Est.):</span>
                  <span>0.001 AVAX</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
