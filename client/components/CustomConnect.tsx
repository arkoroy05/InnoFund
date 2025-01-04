import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown } from 'lucide-react';

// Simple styling customization
export const CustomConnectButton = () => {
  return (
    <div className="connect-button-wrapper">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const connected = mounted && account && chain;

          return (
            <div>
              {!connected ? (
                // Connect Button - Not Connected State
                <button
                  onClick={openConnectModal}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-full 
                           hover:bg-neutral-900 transition-all duration-200 
                           font-light shadow-lg "
                >
                  Connect Wallet
                </button>
              ) : chain?.unsupported ? (
                // Wrong Network State
                <button
                  onClick={openChainModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-full
                           hover:bg-red-700 transition-all duration-200 
                           font-light shadow-lg"
                >
                  Wrong Network
                </button>
              ) : (
                // Connected State
                <button
                  onClick={openAccountModal}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-full
                           hover:bg-neutral-800 border border-lime-500/30 transition-all duration-200 
                           font-light shadow-lg flex items-center"
                >
                  {account.displayName}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

// Usage in your component:
export default CustomConnectButton;