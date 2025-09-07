"use client";

import React, { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useUserNFTs } from "@/hooks/use-user-nfts";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryTabs } from "./category-tabs";
import { NFTCard } from "./nft-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketplaceProps {
  className?: string;
}

// Loading skeleton for NFT cards
function NFTCardSkeleton() {
  return (
    <div className="bg-background rounded-[20px] overflow-hidden">
      <Skeleton className="h-[295px] w-full" />
      <div className="p-4 md:p-6 lg:p-[30px] pb-4 md:pb-5 lg:pb-[25px]">
        <div className="mb-4 md:mb-5 lg:mb-[25px]">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Marketplace({ className }: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState("nfts");
  const queryClient = useQueryClient();

  // Marketplace NFTs
  const {
    nfts: marketplaceNfts,
    totalCount: marketplaceTotalCount,
    isLoading: isLoadingMarketplace,
    error: marketplaceError,
    loadMore,
    hasMore,
  } = useMarketplace();

  // User's owned NFTs
  const {
    data: userNfts = [],
    isLoading: isLoadingUserNfts,
    error: userNftsError,
    refetch: refetchUserNfts,
  } = useUserNFTs();

  // Determine which data to show based on active tab
  const currentNfts = activeTab === "nfts" ? marketplaceNfts : userNfts;
  const currentTotalCount =
    activeTab === "nfts" ? marketplaceTotalCount : userNfts.length;
  const isLoading =
    activeTab === "nfts" ? isLoadingMarketplace : isLoadingUserNfts;
  const error =
    activeTab === "nfts" ? marketplaceError : userNftsError?.message || null;
  const isEmpty = !isLoading && currentNfts.length === 0;

  // Handle purchase success - refresh both marketplace and user NFTs
  const handlePurchaseSuccess = () => {
    // Refresh marketplace NFTs
    queryClient.invalidateQueries({ queryKey: ["nfts"] });
    // Refresh user NFTs
    queryClient.invalidateQueries({ queryKey: ["user-nfts"] });
    // Refetch user NFTs immediately
    refetchUserNfts();
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-xl mb-4">Error loading NFTs</div>
        <p className="text-text-secondary">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("bg-background min-h-screen", className)}>
      {/* Header Section */}
      <div className="bg-background px-4 md:px-[50px] lg:px-[195px] py-10 md:py-20">
        <div className="max-w-[1050px] mx-auto">
          <motion.div
            className="flex flex-col gap-6 md:gap-[30px] items-start justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col gap-2.5 items-start justify-start text-white text-center md:text-left w-full">
              <motion.h1
                className="text-2xl md:text-4xl lg:text-h2 font-semibold capitalize leading-tight w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {activeTab === "nfts"
                  ? "Browse Marketplace"
                  : "My NFT Collection"}
              </motion.h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marketplace Section */}
      <div className="flex flex-col items-center justify-start w-full">
        {/* Category Tabs */}
        <motion.div
          className="bg-background flex flex-col gap-2.5 items-center justify-start w-full px-4 md:px-[50px] lg:px-[195px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CategoryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            nftCount={marketplaceTotalCount}
            myNftCount={userNfts.length}
          />
        </motion.div>

        {/* NFT Cards Grid */}
        <div className="bg-background-secondary px-4 md:px-[50px] lg:px-[195px] pt-10 md:pt-[60px] pb-10 md:pb-20 w-full">
          <div className="max-w-[1050px] mx-auto">
            {/* Results count */}
            {!isLoading && !isEmpty && (
              <motion.div
                className="mb-6 text-text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Showing {currentNfts.length} of {currentTotalCount} NFTs
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-[30px]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <NFTCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {isEmpty && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-4">
                  {activeTab === "nfts" ? "🎨" : "🖼️"}
                </div>
                <h3 className="text-xl md:text-2xl lg:text-h3 font-semibold text-white mb-4">
                  {activeTab === "nfts" ? "No NFTs Available" : "No NFTs Owned"}
                </h3>
                <p className="text-base md:text-lg lg:text-body-large text-text-secondary mb-6">
                  {activeTab === "nfts"
                    ? "Check back later for new NFT drops."
                    : "Purchase some NFTs from the marketplace to see them here."}
                </p>
                {activeTab === "my-nfts" && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("nfts")}
                  >
                    Browse Marketplace
                  </Button>
                )}
              </motion.div>
            )}

            {/* NFT Grid */}
            {!isLoading && !isEmpty && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-[30px]"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {currentNfts.map((nft, index) => (
                    <motion.div
                      key={nft.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <Suspense fallback={<NFTCardSkeleton />}>
                        <NFTCard
                          nft={nft}
                          onPurchaseSuccess={handlePurchaseSuccess}
                          showPurchaseButton={activeTab === "nfts"}
                        />
                      </Suspense>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Load More Button - only for marketplace tab */}
            {!isLoading && !isEmpty && hasMore && activeTab === "nfts" && (
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  className="min-w-[200px]"
                >
                  Load More NFTs
                </Button>
              </motion.div>
            )}

            {/* Loading more indicator */}
            {isLoading && currentNfts.length > 0 && (
              <div className="flex justify-center mt-8">
                <LoadingSpinner size="lg" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
