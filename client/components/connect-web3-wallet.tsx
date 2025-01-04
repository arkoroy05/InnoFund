interface ConnectWalletButtonProps {
    isConnected: boolean
    onConnect: () => void
    onDisconnect: () => void
  }
  
  export default function ConnectWalletButton({ isConnected, onConnect, onDisconnect }: ConnectWalletButtonProps) {
    return (
      <button
        onClick={isConnected ? onDisconnect : onConnect}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
          isConnected
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isConnected ? 'Disconnect Wallet' : 'Connect Web3 Wallet'}
      </button>
    )
  }
  
  