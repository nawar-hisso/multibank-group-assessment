// Core Types
export interface NFT {
  id: string;
  title: string;
  description?: string;
  artist: string;
  artistAvatar: string;
  image: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  isListed: boolean;
  tokenId: string;
  contractAddress: string;
  creator: string;
  owner: string;
  sold: boolean;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  totalSales: string;
  nftCount: number;
  verified: boolean;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

// Wallet Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  walletType: string | null;
}

export interface WalletConnection {
  connect: (walletType: string) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
}

// UI Types

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
