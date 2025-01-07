// Update these addresses after deployment
export const FUNDING_CONTRACT_ADDRESS = '0xdC13a4eD2717a7b1E0dE2E55beF927c291A4fA0e'
export const REWARD_TOKEN_ADDRESS = '0xA68b3808DCf0Fd8630640018fCB96a28f497F504'
export const PROJECT_DAO_ADDRESS = '0x310BE1F533FFE873743A00aCBB69c22C980c2ECc'

export const FUNDING_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'fundingGoal', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ],
    name: 'createProject',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'projectId', type: 'uint256' }],
    name: 'contribute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'projectId', type: 'uint256' }],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'projectId', type: 'uint256' }],
    name: 'getProject',
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'creator', type: 'address' },
      { name: 'fundingGoal', type: 'uint256' },
      { name: 'currentFunding', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'funded', type: 'bool' },
      { name: 'exists', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function',
  }
] as const

export const REWARD_TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  }
] as const

export const PROJECT_DAO_ABI = [
  {
    inputs: [
      { name: 'projectId', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'string' }
    ],
    name: 'createProposal',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    name: 'proposalDetails',
    outputs: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'deadline', type: 'uint256' },
      { name: 'status', type: 'string' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    name: 'proposalVotes',
    outputs: [
      { name: 'forVotes', type: 'uint256' },
      { name: 'againstVotes', type: 'uint256' },
      { name: 'abstainVotes', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' }
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'proposalId', type: 'uint256' },
      { indexed: true, name: 'voter', type: 'address' },
      { indexed: false, name: 'support', type: 'uint8' },
      { indexed: false, name: 'weight', type: 'uint256' }
    ],
    name: 'ProposalVoted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'proposalId', type: 'uint256' },
      { indexed: true, name: 'projectId', type: 'uint256' },
      { indexed: false, name: 'description', type: 'string' },
      { indexed: false, name: 'deadline', type: 'uint256' }
    ],
    name: 'ProposalCreated',
    type: 'event',
  }
] as const
