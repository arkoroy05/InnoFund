// Update these addresses after deployment
export const FUNDING_CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
export const REWARD_TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const PROJECT_DAO_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

export const FUNDING_CONTRACT_ABI = [
  {
    inputs: [{ name: 'projectId', type: 'uint256' }],
    name: 'contribute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export const REWARD_TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const PROJECT_DAO_ABI = [
  {
    inputs: [
      { name: 'projectId', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'uint8' },
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
      { name: 'category', type: 'uint8' },
      { name: 'requiredQuorum', type: 'uint256' },
      { name: 'votingDelay', type: 'uint256' },
      { name: 'votingPeriod', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    name: 'proposalVotes',
    outputs: [
      { name: 'againstVotes', type: 'uint256' },
      { name: 'forVotes', type: 'uint256' },
      { name: 'abstainVotes', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
