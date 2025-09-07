"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { NFT, PaginationState } from "@/types";

interface MarketplaceStore {
  // State
  nfts: NFT[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
  selectedCategory: string;

  // Actions
  setNfts: (nfts: NFT[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string) => void;
  loadMore: () => void;
  reset: () => void;
}

const initialPagination: PaginationState = {
  page: 1,
  limit: 12,
  total: 0,
  hasMore: true,
};

export const useMarketplaceStore = create<MarketplaceStore>()(
  devtools(
    (set, get) => ({
      nfts: [],
      isLoading: false,
      error: null,
      pagination: initialPagination,
      selectedCategory: "nfts",

      setNfts: (nfts) => {
        set({
          nfts,
          pagination: {
            ...get().pagination,
            total: nfts.length,
            hasMore:
              nfts.length > get().pagination.limit * get().pagination.page,
          },
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setSelectedCategory: (selectedCategory) => {
        set({ selectedCategory });
      },

      loadMore: () => {
        const { pagination } = get();
        if (pagination.hasMore) {
          set({
            pagination: {
              ...pagination,
              page: pagination.page + 1,
            },
          });
        }
      },

      reset: () => {
        set({
          nfts: [],
          isLoading: false,
          error: null,
          pagination: initialPagination,
          selectedCategory: "nfts",
        });
      },
    }),
    { name: "marketplace-store" }
  )
);
