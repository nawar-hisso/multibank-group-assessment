"use client";

import { useQuery } from "@tanstack/react-query";
import { getNFTs } from "@/services/nft-service";
import type { NFT } from "@/types";

export function useNFTs() {
  return useQuery<NFT[], Error>({
    queryKey: ["nfts"],
    queryFn: getNFTs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useNFT(id: string) {
  return useQuery<NFT | null, Error>({
    queryKey: ["nft", id],
    queryFn: async () => {
      const nfts = await getNFTs();
      return nfts.find((nft) => nft.id === id) || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
