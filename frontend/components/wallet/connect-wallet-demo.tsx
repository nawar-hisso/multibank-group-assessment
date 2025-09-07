"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectWallet } from "./connect-wallet";
import { useWallet } from "@/hooks/use-wallet";
import type { WalletType } from "@/lib/constants";

interface ConnectWalletDemoProps {
  className?: string;
}

export function ConnectWalletDemo({ className = "" }: ConnectWalletDemoProps) {
  const router = useRouter();
  const { 
    isConnected, 
    isConnecting, 
    connectWallet, 
    walletType, 
    formattedAddress,
    isWrongNetwork,
    switchNetwork,
    error 
  } = useWallet();

  // Redirect to home when successfully connected and on correct network
  useEffect(() => {
    if (isConnected && !isWrongNetwork) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, isWrongNetwork, router]);

  const handleWalletSelect = async (walletType: string) => {
    try {
      await connectWallet(walletType as WalletType);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Show success state when connected
  if (isConnected && !isWrongNetwork) {
    return (
      <div className={`bg-background min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-h3 font-semibold text-white">
            Wallet Connected!
          </h2>
          <p className="text-body-large text-text-secondary">
            Successfully connected to {walletType}
          </p>
          <p className="text-body text-text-caption font-mono">
            {formattedAddress}
          </p>
          <div className="animate-pulse text-text-caption">
            Redirecting to marketplace...
          </div>
        </div>
      </div>
    );
  }

  // Show wrong network state
  if (isConnected && isWrongNetwork) {
    return (
      <div className={`bg-background min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-h3 font-semibold text-white">
            Wrong Network
          </h2>
          <p className="text-body-large text-text-secondary">
            Please switch to Anvil Local network (Chain ID: 31337)
          </p>
          <button
            onClick={() => switchNetwork()}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-[20px] font-semibold transition-colors"
          >
            Switch Network
          </button>
        </div>
      </div>
    );
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <div className={`bg-background min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-h3 font-semibold text-white">Connecting...</h2>
          <p className="text-body-large text-text-secondary">
            Connecting to your wallet
          </p>
          <p className="text-body text-text-caption">
            Please confirm the connection in your wallet
          </p>
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <ConnectWallet onWalletSelect={handleWalletSelect} className={className} />
  );
}
