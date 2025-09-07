import { ethers } from "ethers";
import { CONTRACT_CONFIG, CONTRACT_ABIS, WALLET_CONFIG } from "@/lib/constants";

export interface ContractNFTItem {
  tokenId: bigint;
  creator: string;
  owner: string;
  price: bigint;
  isListed: boolean;
  sold: boolean;
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private marketplaceContract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(WALLET_CONFIG.RPC_URL);

      this.marketplaceContract = new ethers.Contract(
        CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS,
        CONTRACT_ABIS.NFT_MARKETPLACE,
        this.provider
      );
    } catch (error) {
      console.error("Failed to initialize blockchain provider:", error);
    }
  }

  async getListedNFTs(): Promise<ContractNFTItem[]> {
    if (!this.marketplaceContract) {
      throw new Error("Marketplace contract not initialized");
    }

    try {
      const listedTokenIds: bigint[] =
        await this.marketplaceContract.getListedNFTs();

      const nftItems: ContractNFTItem[] = [];

      for (const tokenId of listedTokenIds) {
        try {
          const nftItem = await this.marketplaceContract.getNFTItem(tokenId);

          nftItems.push({
            tokenId: nftItem[0],
            creator: nftItem[1], // seller
            owner: nftItem[2],
            price: nftItem[3],
            sold: nftItem[4],
            isListed: nftItem[5],
          });
        } catch (error) {
          console.error(
            `Failed to get NFT item for token ID ${tokenId}:`,
            error
          );
        }
      }

      return nftItems;
    } catch (error) {
      console.error("Failed to get listed NFTs:", error);
      throw error;
    }
  }

  async getTotalNFTs(): Promise<number> {
    if (!this.marketplaceContract) {
      throw new Error("Marketplace contract not initialized");
    }

    try {
      const total = await this.marketplaceContract.getTotalNFTs();
      return Number(total);
    } catch (error) {
      console.error("Failed to get total NFTs:", error);
      return 0;
    }
  }

  async getTotalSold(): Promise<number> {
    if (!this.marketplaceContract) {
      throw new Error("Marketplace contract not initialized");
    }

    try {
      const total = await this.marketplaceContract.getTotalSold();
      return Number(total);
    } catch (error) {
      console.error("Failed to get total sold:", error);
      return 0;
    }
  }

  formatPrice(priceWei: bigint): string {
    return ethers.formatEther(priceWei);
  }

  isConnected(): boolean {
    return this.provider !== null && this.marketplaceContract !== null;
  }

  async getMarketplaceFee(): Promise<number> {
    if (!this.marketplaceContract) {
      throw new Error("Marketplace contract not initialized");
    }

    try {
      const fee = await this.marketplaceContract.getMarketplaceFee();
      return Number(fee);
    } catch (error) {
      console.error("Failed to get marketplace fee:", error);
      return 250;
    }
  }

  async getUserOwnedNFTs(userAddress: string): Promise<ContractNFTItem[]> {
    if (!this.marketplaceContract) {
      throw new Error("Marketplace contract not initialized");
    }

    try {
      const userTokenIds: bigint[] = await this.marketplaceContract.getUserNFTs(
        userAddress
      );

      const nftItems: ContractNFTItem[] = [];

      for (const tokenId of userTokenIds) {
        try {
          const nftItem = await this.marketplaceContract.getNFTItem(tokenId);

          nftItems.push({
            tokenId: nftItem[0],
            creator: nftItem[1],
            owner: nftItem[2],
            price: nftItem[3],
            sold: nftItem[4],
            isListed: nftItem[5],
          });
        } catch (error) {
          console.error(
            `Failed to get NFT item for token ID ${tokenId}:`,
            error
          );
        }
      }

      return nftItems;
    } catch (error) {
      console.error("Failed to get user owned NFTs:", error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
