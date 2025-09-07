"use client";

import { useEffect } from "react";
import { useMarketplaceStore } from "@/stores/marketplace-store";
import { useNFTs } from "@/hooks/use-nfts";

export function useMarketplace() {
  const {
    nfts,
    isLoading,
    error,
    pagination,
    selectedCategory,
    setNfts,
    setLoading,
    setError,
    setSelectedCategory,
    loadMore,
    reset,
  } = useMarketplaceStore();

  const {
    data: nftData,
    isLoading: isLoadingNFTs,
    error: nftError,
  } = useNFTs();

  useEffect(() => {
    if (nftData) {
      setNfts(nftData);
    }
  }, [nftData, setNfts]);

  useEffect(() => {
    setLoading(isLoadingNFTs);
  }, [isLoadingNFTs, setLoading]);

  useEffect(() => {
    setError(nftError?.message || null);
  }, [nftError, setError]);

  const paginatedNFTs = nfts.slice(0, pagination.page * pagination.limit);

  return {
    nfts: paginatedNFTs,
    allNfts: nfts,
    totalCount: nfts.length,

    isLoading,
    error,
    pagination,
    selectedCategory,

    loadMore,
    reset,
    setSelectedCategory,

    hasResults: nfts.length > 0,
    hasMore: pagination.hasMore,
    isEmpty: !isLoading && nfts.length === 0,
  };
}
