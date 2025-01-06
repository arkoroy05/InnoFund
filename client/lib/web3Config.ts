import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { Chain } from 'viem'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const fuji = {
  id: 43_113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
} as const satisfies Chain

const { chains, publicClient } = configureChains(
  [fuji],
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  chains
})
