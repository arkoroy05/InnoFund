'use client'

import { useAccount, useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS } from '@/lib/contracts'

export function TokenBalance() {
  const { address } = useAccount()

  const { data: balance } = useContractRead({
    address: REWARD_TOKEN_ADDRESS,
    abi: REWARD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
  })

  if (!address || !balance) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        {formatEther(balance)} IFT
      </span>
    </div>
  )
}
