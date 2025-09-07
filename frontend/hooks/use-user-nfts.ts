"use client";

import { useQuery } from "@tanstack/react-query";
import { blockchainService } from "@/services/blockchain-service";
import { useWallet } from "@/hooks/use-wallet";
import type { NFT } from "@/types";
import { CONTRACT_CONFIG } from "@/lib/constants";
import { ARTIST_AVATARS } from "@/lib/placeholder-images";

// Helper function to get a random artist avatar
function getRandomArtistAvatar(): string {
  const avatars = Object.values(ARTIST_AVATARS);
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Helper function to get NFT image based on token ID (deterministic)
function getNFTImageByTokenId(tokenId: string): string {
  const tokenIdNum = parseInt(tokenId, 10);
  const imageNumber = tokenIdNum % 13; // Get remainder when divided by 13 (0-12)
  // Map 0-12 to 1-13 (so we use images 1.png through 13.png)
  const finalImageNumber = imageNumber + 1;
  return `/images/${finalImageNumber}.png`;
}

// Helper function to format creator address to artist name
function formatCreatorToArtist(creator: string): string {
  // Use the last 6 characters of the address as a unique identifier
  const suffix = creator.slice(-6);
  return `Creator ${suffix}`;
}

export function useUserNFTs() {
  const { address, isConnected } = useWallet();

  return useQuery({
    queryKey: ["user-nfts", address],
    queryFn: async (): Promise<NFT[]> => {
      if (!address || !isConnected) {
        return [];
      }

      try {
        // Get user's owned NFTs from the blockchain
        const contractNFTs = await blockchainService.getUserOwnedNFTs(address);

        // Convert contract NFTs to frontend NFT format
        const nfts: NFT[] = [];

        for (const contractNFT of contractNFTs) {
          try {
            // Format price
            const priceInTokens = blockchainService.formatPrice(
              contractNFT.price
            );
            const priceDisplay = `${priceInTokens} ${CONTRACT_CONFIG.PAYMENT_TOKEN_SYMBOL}`;

            // Generate artist info
            const artist = formatCreatorToArtist(contractNFT.creator);
            const artistAvatar = getRandomArtistAvatar();

            // Generate NFT title and description based on token ID
            const tokenIdNum = Number(contractNFT.tokenId);
            const nftTitle = `NFT #${tokenIdNum}`;
            const nftDescription = `Digital collectible #${tokenIdNum} owned by you`;

            // Use deterministic NFT image based on token ID
            const nftImage = getNFTImageByTokenId(
              contractNFT.tokenId.toString()
            );

            // Create NFT object
            const nft: NFT = {
              id: contractNFT.tokenId.toString(),
              title: nftTitle,
              description: nftDescription,
              artist,
              artistAvatar,
              image: nftImage,
              price: priceDisplay,
              createdAt: new Date(),
              updatedAt: new Date(),
              isListed: contractNFT.isListed,
              tokenId: contractNFT.tokenId.toString(),
              contractAddress: CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS,
              creator: contractNFT.creator,
              owner: contractNFT.owner,
              sold: contractNFT.sold,
              attributes: [],
            };

            nfts.push(nft);
          } catch (error) {
            console.error(
              `Failed to process NFT ${contractNFT.tokenId}:`,
              error
            );
          }
        }

        return nfts;
      } catch (error) {
        console.error("Failed to fetch user NFTs:", error);
        throw error;
      }
    },
    enabled: isConnected && !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
