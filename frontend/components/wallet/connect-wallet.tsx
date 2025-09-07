"use client";

import React from "react";

function MetamaskIcon() {
  return (
    <div className="relative w-10 h-10 rounded-lg flex items-center justify-center">
      <img
        src="/icons/metamask.png"
        alt="MetaMask"
        className="w-10 h-10 rounded-lg"
      />
    </div>
  );
}

interface WalletOptionProps {
  icon: React.ReactNode;
  name: string;
  onClick?: () => void;
  href?: string;
}

function WalletOption({ icon, name, onClick, href }: WalletOptionProps) {
  const Component = href ? "a" : "button";

  return (
    <Component
      className="bg-background-secondary border border-primary rounded-[20px] flex items-center gap-5 h-[72px] px-10 py-0 w-full hover:bg-background-secondary/80 transition-colors cursor-pointer"
      onClick={onClick}
      href={href}
    >
      {icon}
      <span className="text-h5 font-semibold text-white capitalize flex-1 text-left">
        {name}
      </span>
    </Component>
  );
}

interface ConnectWalletProps {
  onWalletSelect?: (walletType: string) => void;
  className?: string;
}

export function ConnectWallet({
  onWalletSelect,
  className = "",
}: ConnectWalletProps) {
  const handleWalletClick = async (walletType: string) => {
    if (onWalletSelect) {
      onWalletSelect(walletType);
    } else {
      try {
        console.log(`Connecting to ${walletType}...`);
      } catch (error) {
        console.error(`Failed to connect to ${walletType}:`, error);
      }
    }
  };

  return (
    <div className={`bg-background min-h-screen ${className}`}>
      <div className="flex min-h-screen">
        <div className="flex-1 relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/80">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-sm">Join the NFT marketplace</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-[100px]">
          <div className="w-full max-w-[460px] space-y-10">
            <div className="space-y-10">
              <div className="space-y-5">
                <h1 className="text-h2 font-semibold text-white capitalize leading-tight">
                  Connect wallet
                </h1>
                <p className="text-body-large text-white">
                  Connect your MetaMask wallet to access the NFT marketplace.
                </p>
              </div>
            </div>

            <div className="w-80 space-y-5">
              <WalletOption
                icon={<MetamaskIcon />}
                name="Metamask"
                onClick={() => handleWalletClick("metamask")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MetamaskIcon, WalletOption };
