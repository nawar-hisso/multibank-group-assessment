// Wallet Configuration
export const WALLET_CONFIG = {
  SUPPORTED_WALLETS: ["metamask", "walletconnect", "coinbase"] as const,
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337"), // Anvil Local Chain
  CHAIN_NAME: "Anvil Local",
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545",
} as const;

// Smart Contract Configuration
export const CONTRACT_CONFIG = {
  NFT_MARKETPLACE_ADDRESS:
    process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS ||
    "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
  PAYMENT_TOKEN_SYMBOL: "ETH",
  PAYMENT_TOKEN_NAME: "Ethereum",
  MARKETPLACE_FEE: 250, // 2.5% in basis points
} as const;

// Contract ABIs (JSON format for wagmi)
export const CONTRACT_ABIS = {
  MOCKERC20: [
    {
      name: "name",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
    },
    {
      name: "symbol",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
    },
    {
      name: "decimals",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint8" }],
    },
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "transfer",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
    },
    {
      name: "approve",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
    },
  ],
  NFT_MARKETPLACE: [
    {
      name: "buyNFT",
      type: "function",
      stateMutability: "payable",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [],
    },
    {
      name: "createNFTItem",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "_tokenURI", type: "string" },
        { name: "price", type: "uint256" },
      ],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "listNFT",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "tokenId", type: "uint256" },
        { name: "price", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "unlistNFT",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [],
    },
    {
      name: "updateNFTPrice",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "tokenId", type: "uint256" },
        { name: "newPrice", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "getNFTItem",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [
        {
          name: "",
          type: "tuple",
          components: [
            { name: "tokenId", type: "uint256" },
            { name: "seller", type: "address" },
            { name: "owner", type: "address" },
            { name: "price", type: "uint256" },
            { name: "sold", type: "bool" },
            { name: "listed", type: "bool" },
          ],
        },
      ],
    },
    {
      name: "getListedNFTs",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint256[]" }],
    },
    {
      name: "getUserNFTs",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "user", type: "address" }],
      outputs: [{ name: "", type: "uint256[]" }],
    },
    {
      name: "getTotalNFTs",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "getTotalSold",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "getMarketplaceFee",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "getContractTokenBalance",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "tokenURI",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [{ name: "", type: "string" }],
    },
  ],
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  CONNECT_WALLET: "/connect-wallet",
} as const;

export type WalletType = (typeof WALLET_CONFIG.SUPPORTED_WALLETS)[number];
