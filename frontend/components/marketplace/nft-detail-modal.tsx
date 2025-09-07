"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images";
import { useWallet } from "@/hooks/use-wallet";
import type { NFT } from "@/types";
import { parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_CONFIG, CONTRACT_ABIS } from "@/lib/constants";

interface NFTDetailModalProps {
  nft: NFT;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
  showPurchaseButton?: boolean;
}

export default function NFTDetailModal({
  nft,
  isOpen,
  onClose,
  onPurchaseSuccess,
  showPurchaseButton = true,
}: NFTDetailModalProps) {
  const { isConnected, address } = useWallet();
  const [isBuying, setIsBuying] = React.useState(false);
  const [buyError, setBuyError] = React.useState<string | null>(null);
  const [buySuccess, setBuySuccess] = React.useState(false);
  const [isListing, setIsListing] = React.useState(false);
  const [listError, setListError] = React.useState<string | null>(null);
  const [listSuccess, setListSuccess] = React.useState(false);
  const [listPrice, setListPrice] = React.useState("");
  const [showListForm, setShowListForm] = React.useState(false);

  // Check if the connected wallet owns this NFT
  const isOwnedByUser = React.useMemo(() => {
    if (!address || !nft.owner) return false;
    return address.toLowerCase() === nft.owner.toLowerCase();
  }, [address, nft.owner]);

  // Check if NFT is listed
  const isNFTListed = nft.isListed;

  // Determine if we should show the purchase button
  const shouldShowPurchaseButton =
    showPurchaseButton && !isOwnedByUser && isNFTListed;

  // Determine if we should show the list button (owned by user and not listed)
  const shouldShowListButton = isOwnedByUser && !isNFTListed;

  // Smart contract interaction for buying
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Smart contract interaction for listing
  const {
    writeContract: writeListContract,
    data: listHash,
    error: listContractError,
    isPending: isListPending,
  } = useWriteContract();

  const { isLoading: isListConfirming, isSuccess: isListConfirmed } =
    useWaitForTransactionReceipt({
      hash: listHash,
    });

  // Handle buy NFT with ETH
  const handleBuyNow = async () => {
    if (!isConnected || !nft.tokenId) {
      setBuyError("Please connect your wallet first");
      return;
    }

    try {
      setIsBuying(true);
      setBuyError(null);

      // Parse the price from the NFT (remove "ETH" suffix and convert to wei)
      const priceString = nft.price.replace(" ETH", "");
      const priceInWei = parseEther(priceString);

      // Buy NFT with ETH (single transaction)
      writeContract({
        address: CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABIS.NFT_MARKETPLACE,
        functionName: "buyNFT",
        args: [BigInt(nft.tokenId)],
        value: priceInWei,
      });
    } catch (err) {
      console.error("Buy NFT error:", err);
      setBuyError(err instanceof Error ? err.message : "Failed to buy NFT");
      setIsBuying(false);
    }
  };

  // Handle list NFT
  const handleListNFT = async () => {
    if (!isConnected || !nft.tokenId || !listPrice) {
      setListError("Please connect your wallet and enter a price");
      return;
    }

    try {
      setIsListing(true);
      setListError(null);

      // Convert price to wei
      const priceInWei = parseEther(listPrice);

      // List NFT
      writeListContract({
        address: CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABIS.NFT_MARKETPLACE,
        functionName: "listNFT",
        args: [BigInt(nft.tokenId), priceInWei],
      });
    } catch (err) {
      console.error("List NFT error:", err);
      setListError(err instanceof Error ? err.message : "Failed to list NFT");
      setIsListing(false);
    }
  };

  // Handle transaction status
  React.useEffect(() => {
    if (error) {
      setBuyError(error.message);
      setIsBuying(false);
    }
  }, [error]);

  React.useEffect(() => {
    if (isConfirmed) {
      // Purchase confirmed
      setBuySuccess(true);
      setIsBuying(false);
      console.log("Purchase confirmed successfully");

      // Call the purchase success callback to refresh the NFT list
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }

      // Auto-close modal after successful purchase
      setTimeout(() => {
        onClose();
        setBuySuccess(false);
      }, 3000);
    }
  }, [isConfirmed, onClose, onPurchaseSuccess]);

  React.useEffect(() => {
    if (isPending || isConfirming) {
      setIsBuying(true);
    }
  }, [isPending, isConfirming]);

  // Handle listing transaction status
  React.useEffect(() => {
    if (listContractError) {
      setListError(listContractError.message);
      setIsListing(false);
    }
  }, [listContractError]);

  React.useEffect(() => {
    if (isListConfirmed) {
      // Listing confirmed
      setListSuccess(true);
      setIsListing(false);
      setShowListForm(false);
      setListPrice("");
      console.log("NFT listed successfully");

      // Call the purchase success callback to refresh the NFT list
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }

      // Auto-close modal after successful listing
      setTimeout(() => {
        onClose();
        setListSuccess(false);
      }, 3000);
    }
  }, [isListConfirmed, onClose, onPurchaseSuccess]);

  React.useEffect(() => {
    if (isListPending || isListConfirming) {
      setIsListing(true);
    }
  }, [isListPending, isListConfirming]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-background-secondary rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* NFT Image */}
              <div className="relative aspect-square rounded-[20px] overflow-hidden">
                <SmartImage
                  src={nft.image}
                  fallbackSrc={PLACEHOLDER_IMAGES.nft}
                  alt={nft.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* NFT Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {nft.title}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg text-white font-medium">
                      {nft.artist}
                    </span>
                  </div>
                  {nft.description && (
                    <p className="text-text-secondary">{nft.description}</p>
                  )}
                </div>

                <div className="bg-background rounded-[15px] p-4">
                  <div className="text-text-caption text-sm mb-1">Price</div>
                  <div className="text-white text-xl font-bold">
                    {nft.price}
                  </div>
                </div>

                <div className="space-y-3">
                  {buyError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{buyError}</p>
                    </div>
                  )}

                  {listError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{listError}</p>
                    </div>
                  )}

                  {buySuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-400 text-sm">
                        NFT purchased successfully! Closing modal...
                      </p>
                    </div>
                  )}

                  {listSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-400 text-sm">
                        NFT listed successfully! Closing modal...
                      </p>
                    </div>
                  )}

                  {shouldShowPurchaseButton ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleBuyNow}
                      disabled={isBuying || !isConnected}
                    >
                      {isBuying ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          {isPending
                            ? "Purchasing..."
                            : isConfirming
                            ? "Confirming Purchase..."
                            : "Purchasing..."}
                        </div>
                      ) : (
                        `Buy Now with ${CONTRACT_CONFIG.PAYMENT_TOKEN_SYMBOL}`
                      )}
                    </Button>
                  ) : shouldShowListButton ? (
                    <div className="space-y-3">
                      {!showListForm ? (
                        <div className="space-y-3">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                            <p className="text-blue-400 text-sm mb-2">
                              🎉 You own this NFT!
                            </p>
                            <p className="text-text-secondary text-xs mb-3">
                              This NFT is not currently listed for sale.
                            </p>
                          </div>
                          <Button
                            className="w-full"
                            size="lg"
                            onClick={() => setShowListForm(true)}
                            disabled={!isConnected}
                          >
                            List for Sale
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-background rounded-[15px] p-4">
                            <label className="text-text-caption text-sm mb-2 block">
                              List Price (ETH)
                            </label>
                            <input
                              type="number"
                              step="0.001"
                              min="0"
                              value={listPrice}
                              onChange={(e) => setListPrice(e.target.value)}
                              placeholder="Enter price in ETH"
                              className="w-full bg-background-secondary text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => {
                                setShowListForm(false);
                                setListPrice("");
                                setListError(null);
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1"
                              size="lg"
                              onClick={handleListNFT}
                              disabled={isListing || !isConnected || !listPrice}
                            >
                              {isListing ? (
                                <div className="flex items-center gap-2">
                                  <LoadingSpinner size="sm" />
                                  {isListPending
                                    ? "Listing..."
                                    : isListConfirming
                                    ? "Confirming..."
                                    : "Listing..."}
                                </div>
                              ) : (
                                "List NFT"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isOwnedByUser ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                      <p className="text-blue-400 text-sm mb-2">
                        🎉 You own this NFT!
                      </p>
                      <p className="text-text-secondary text-xs">
                        This NFT is currently listed for sale.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-2">
                        This NFT is not available for purchase
                      </p>
                      <p className="text-text-secondary text-xs">
                        This NFT may already be sold or not listed.
                      </p>
                    </div>
                  )}
                </div>

                {nft.tokenId && (
                  <div className="pt-4 border-t border-background">
                    <div className="text-sm">
                      <span className="text-text-caption">Token ID:</span>
                      <span className="text-white ml-2">{nft.tokenId}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
