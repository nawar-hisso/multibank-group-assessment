"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { WalletState, WalletConnection } from "@/types";

interface WalletStore extends WalletState, WalletConnection {
  // State
  isConnecting: boolean;
  error: string | null;

  // Actions
  setConnecting: (isConnecting: boolean) => void;
  setError: (error: string | null) => void;
  setWalletData: (data: Partial<WalletState>) => void;
  reset: () => void;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  walletType: null,
};

export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        isConnecting: false,
        error: null,

        setConnecting: (isConnecting) => set({ isConnecting }),

        setError: (error) => set({ error }),

        setWalletData: (data) => set((state) => ({ ...state, ...data })),

        reset: () => set({ ...initialState, isConnecting: false, error: null }),

        // These will be replaced by Wagmi hooks in the useWallet hook
        connect: async () => {
          // This is now handled by Wagmi hooks
          throw new Error("Use Wagmi hooks for wallet connection");
        },

        disconnect: () => {
          // This is now handled by Wagmi hooks
          set({ ...initialState, isConnecting: false, error: null });
        },

        switchChain: async (chainId: number) => {
          // This is now handled by Wagmi hooks
          throw new Error("Use Wagmi hooks for chain switching");
        },
      }),
      {
        name: "wallet-storage",
        partialize: (state) => ({
          isConnected: state.isConnected,
          address: state.address,
          balance: state.balance,
          chainId: state.chainId,
          walletType: state.walletType,
        }),
      }
    ),
    { name: "wallet-store" }
  )
);
