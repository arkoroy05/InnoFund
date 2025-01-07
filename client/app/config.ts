import { 
    createConfig, 
    http, 
    cookieStorage,
    createStorage
  } from 'wagmi'
  import { avalancheFuji, hardhat } from 'wagmi/chains'
  
  export function getConfig() {
    return createConfig({
      chains: [avalancheFuji, hardhat],
      ssr: true,
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [avalancheFuji.id]: http(),
        [hardhat.id]: http(),
      },
    })
  }