import { hardhat } from 'wagmi/chains'

interface ContractAddresses {
  rewardToken: `0x${string}`;
  projectDAO: `0x${string}`;
  fundingContract: `0x${string}`;
}

interface ChainConfig {
  [chainId: number]: ContractAddresses;
}

export const contractAddresses: ChainConfig = {
  [hardhat.id]: {
    rewardToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    projectDAO: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    fundingContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
  // Fuji testnet addresses
  43113: {
    rewardToken: '0xA68b3808DCf0Fd8630640018fCB96a28f497F504',
    projectDAO: '0x310BE1F533FFE873743A00aCBB69c22C980c2ECc',
    fundingContract: '0xdC13a4eD2717a7b1E0dE2E55beF927c291A4fA0e',
  },
}
