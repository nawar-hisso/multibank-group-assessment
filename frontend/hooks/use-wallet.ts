"use client";

import { useCallback, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance, useConnectors } from "wagmi";
import { useWalletStore } from "@/stores/wallet-store";
import { toast } from "react-hot-toast";
import { TARGET_CHAIN_ID } from "@/lib/wagmi-config";
import type { WalletType } from "@/lib/constants";

export function useWallet() {
  const { address, isConnected, chainId, connector } = useAccount();
  const { connect, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const connectors = useConnectors();
  
  // Get balance for connected account
  const { data: balanceData } = useBalance({
    address: address,
    query: {
      enabled: !!address,
    },
  });

  const {
    setWalletData,
    setConnecting,
    setError,
    reset,
    error: storeError,
  } = useWalletStore();

  // Sync Wagmi state with store
  useEffect(() => {
    setWalletData({
      isConnected,
      address: address || null,
      balance: balanceData ? balanceData.formatted : null,
      chainId: chainId || null,
      walletType: connector?.name?.toLowerCase() || null,
    });
  }, [isConnected, address, balanceData, chainId, connector, setWalletData]);

  // Sync connecting state
  useEffect(() => {
    setConnecting(isConnecting || isSwitching);
  }, [isConnecting, isSwitching, setConnecting]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setError(connectError.message);
    }
  }, [connectError, setError]);

  // Check if user is on wrong network
  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  // Auto-prompt network switch when connected to wrong network
  useEffect(() => {
    if (isWrongNetwork && !isSwitching) {
      toast.error(`Please switch to ${TARGET_CHAIN_ID === 31337 ? 'Anvil Local' : 'the correct'} network`);
    }
  }, [isWrongNetwork, isSwitching]);

  const connectWallet = useCallback(
    async (type: WalletType) => {
      try {
        setError(null);
        
        // Find the connector based on type
        let targetConnector;
        if (type === "metamask") {
          targetConnector = connectors.find(c => c.name.toLowerCase().includes('metamask'));
        } else if (type === "walletconnect") {
          targetConnector = connectors.find(c => c.name.toLowerCase().includes('walletconnect'));
        }

        if (!targetConnector) {
          throw new Error(`${type} connector not found`);
        }

        await connect({ connector: targetConnector });
        toast.success(`Connected to ${type}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Connection failed";
        toast.error(message);
        setError(message);
        throw error;
      }
    },
    [connect, connectors, setError]
  );

  const disconnectWallet = useCallback(() => {
    disconnect();
    reset();
    toast.success("Wallet disconnected");
  }, [disconnect, reset]);

  const switchNetwork = useCallback(
    async (newChainId?: number) => {
      try {
        const targetChainId = newChainId || TARGET_CHAIN_ID;
        await switchChain({ chainId: targetChainId });
        toast.success("Network switched successfully");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Network switch failed";
        toast.error(message);
        setError(message);
        throw error;
      }
    },
    [switchChain, setError]
  );

  const isWalletSupported = useCallback((type: string): type is WalletType => {
    return ["metamask", "walletconnect", "coinbase"].includes(type);
  }, []);

  return {
    // State
    isConnected,
    address,
    balance: balanceData?.formatted || null,
    chainId,
    walletType: connector?.name?.toLowerCase() || null,
    isConnecting: isConnecting || isSwitching,
    error: connectError?.message || storeError,
    isWrongNetwork,

    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isWalletSupported,

    // Computed
    formattedAddress: address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : null,
    formattedBalance: balanceData 
      ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` 
      : null,
  };
}
