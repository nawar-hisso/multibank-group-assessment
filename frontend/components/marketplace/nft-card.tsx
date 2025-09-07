"use client";

import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";
import type { NFT } from "@/types";

// Lazy load the detailed view
const NFTDetailModal = lazy(() => import("./nft-detail-modal"));

interface NFTCardProps {
  nft: NFT;
  className?: string;
  onClick?: (nft: NFT) => void;
  onPurchaseSuccess?: () => void;
  showPurchaseButton?: boolean;
}

export function NFTCard({
  nft,
  className,
  onClick,
  onPurchaseSuccess,
  showPurchaseButton = true,
}: NFTCardProps) {
  const [showDetail, setShowDetail] = React.useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(nft);
    } else {
      setShowDetail(true);
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          "bg-background rounded-[20px] overflow-hidden cursor-pointer group",
          className
        )}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        layout
      >
        {/* NFT Image */}
        <div className="relative h-[295px] overflow-hidden">
          <SmartImage
            src={nft.image}
            fallbackSrc={PLACEHOLDER_IMAGES.nft}
            alt={nft.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* NFT Info */}
        <div className="p-4 md:p-6 lg:p-[30px] pb-4 md:pb-5 lg:pb-[25px]">
          <div className="mb-4 md:mb-5 lg:mb-[25px]">
            <h3 className="text-lg md:text-xl lg:text-h5 font-semibold text-white mb-[5px] capitalize line-clamp-1">
              {nft.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="font-space-mono text-sm md:text-base text-white line-clamp-1">
                {nft.artist}
              </span>
            </div>
          </div>

          <div className="font-space-mono">
            <div className="text-text-caption text-xs md:text-caption mb-2">
              Price
            </div>
            <div className="text-white text-sm md:text-base font-medium">
              {nft.price}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Lazy loaded detail modal */}
      {showDetail && (
        <Suspense>
          <NFTDetailModal
            nft={nft}
            isOpen={showDetail}
            onClose={() => setShowDetail(false)}
            onPurchaseSuccess={onPurchaseSuccess}
            showPurchaseButton={showPurchaseButton}
          />
        </Suspense>
      )}
    </>
  );
}
