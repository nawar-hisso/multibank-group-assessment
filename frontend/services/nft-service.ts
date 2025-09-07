import type { NFT } from "@/types";
import { CONTRACT_CONFIG } from "@/lib/constants";
import { ARTIST_AVATARS } from "@/lib/placeholder-images";
import { blockchainService, type ContractNFTItem } from "./blockchain-service";

function getRandomArtistAvatar(): string {
  const avatars = Object.values(ARTIST_AVATARS);
  return avatars[Math.floor(Math.random() * avatars.length)];
}

function getNFTImageByTokenId(tokenId: string): string {
  const tokenIdNum = parseInt(tokenId, 10);
  const imageNumber = tokenIdNum % 13;
  const finalImageNumber = imageNumber + 1;
  return `/images/${finalImageNumber}.png`;
}

function formatCreatorToArtist(creator: string): string {
  const suffix = creator.slice(-6);
  return `Creator ${suffix}`;
}

async function convertContractNFTToNFT(
  contractNFT: ContractNFTItem
): Promise<NFT | null> {
  try {
    const priceInTokens = blockchainService.formatPrice(contractNFT.price);
    const priceDisplay = `${priceInTokens} ${CONTRACT_CONFIG.PAYMENT_TOKEN_SYMBOL}`;

    const artist = formatCreatorToArtist(contractNFT.creator);
    const artistAvatar = getRandomArtistAvatar();

    const tokenIdNum = Number(contractNFT.tokenId);
    const nftTitle = `NFT #${tokenIdNum}`;
    const nftDescription = `Digital collectible #${tokenIdNum} created on the marketplace`;

    const nftImage = getNFTImageByTokenId(contractNFT.tokenId.toString());

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

    return nft;
  } catch (error) {
    console.error(
      `Failed to convert contract NFT ${contractNFT.tokenId}:`,
      error
    );
    return null;
  }
}

export async function getNFTs(): Promise<NFT[]> {
  try {
    console.log("Fetching NFTs from blockchain...");

    if (!blockchainService.isConnected()) {
      throw new Error("Blockchain service not connected");
    }

    const contractNFTs = await blockchainService.getListedNFTs();
    console.log(`Found ${contractNFTs.length} listed NFTs`);

    const nftPromises = contractNFTs.map((contractNFT) =>
      convertContractNFTToNFT(contractNFT)
    );
    const nfts = await Promise.all(nftPromises);

    const validNFTs = nfts.filter((nft): nft is NFT => nft !== null);

    console.log(`Successfully converted ${validNFTs.length} NFTs`);
    return validNFTs;
  } catch (error) {
    console.error("Failed to get NFTs from blockchain:", error);

    return [];
  }
}

export async function getNFTById(id: string): Promise<NFT | null> {
  try {
    const allNFTs = await getNFTs();
    return allNFTs.find((nft) => nft.id === id) || null;
  } catch (error) {
    console.error(`Failed to get NFT by ID ${id}:`, error);
    return null;
  }
}
