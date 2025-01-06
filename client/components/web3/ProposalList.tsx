'use client'

import { useContractRead } from 'wagmi'
import { PROJECT_DAO_ABI, PROJECT_DAO_ADDRESS } from '@/lib/contracts'
import { ProposalCard } from './ProposalCard'

interface ProposalListProps {
  projectId: string
}

export function ProposalList({ projectId }: ProposalListProps) {
  const { data: proposalCount } = useContractRead({
    address: PROJECT_DAO_ADDRESS,
    abi: PROJECT_DAO_ABI,
    functionName: 'getProposalCount',
    args: [BigInt(projectId)],
  })

  const proposals = Array.from({ length: Number(proposalCount || 0) }, (_, i) => i)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Proposals</h2>
      {proposals.map((index) => (
        <ProposalCard
          key={index}
          proposalId={BigInt(index)}
          projectId={projectId}
        />
      ))}
      {proposals.length === 0 && (
        <p className="text-muted-foreground">No proposals yet.</p>
      )}
    </div>
  )
}
