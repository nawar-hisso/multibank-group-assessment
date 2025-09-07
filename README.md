# MultiBank Group Assessment - NFT Marketplace

A comprehensive NFT marketplace built with Next.js frontend and Foundry smart contracts, supporting ETH payments with a modern, responsive design.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Smart Contracts](#smart-contracts)
- [Frontend Application](#frontend-application)
- [Deployment Process](#deployment-process)
- [Testing](#testing)
- [Environment Configuration](#environment-configuration)
- [Architecture](#architecture)

## 🎯 Project Overview

This NFT marketplace allows users to:

- Create and mint NFTs with metadata
- List NFTs for sale with ETH pricing
- Buy and sell NFTs with automatic fee distribution
- View owned NFTs and marketplace statistics
- Connect wallets (MetaMask, WalletConnect, etc.)

### Key Features

- **ETH-only payments** for simplicity and gas efficiency
- **2.5% marketplace fee** with transparent fee structure
- **Comprehensive testing** with 39+ test cases
- **Modern UI/UX** with Tailwind CSS and Framer Motion
- **Type-safe** development with TypeScript
- **Modular architecture** with reusable components

## 📁 Project Structure

```
multibank-group-assessment/
├── contracts/                    # Smart contracts (Foundry)
│   ├── src/
│   │   └── NFTMarketplace.sol    # Main marketplace contract
│   ├── test/
│   │   └── NFTMarketplace.t.sol  # Comprehensive test suite
│   ├── script/
│   │   ├── DeployNFTMarketplace.s.sol  # Full deployment script
│   │   └── TestDeployment.s.sol         # Simple test deployment
│   ├── lib/                      # Dependencies (OpenZeppelin, Forge-std)
│   └── foundry.toml             # Foundry configuration
├── frontend/                     # Next.js frontend application
│   ├── app/                     # App router pages
│   │   ├── page.tsx            # Main marketplace page
│   │   ├── connect-wallet/     # Wallet connection page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── marketplace/        # Marketplace-specific components
│   │   ├── wallet/            # Wallet connection components
│   │   ├── ui/                # Generic UI components
│   │   └── layout/            # Layout components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API and blockchain services
│   ├── stores/                # Zustand state management
│   ├── lib/                   # Utilities and configurations
│   ├── providers/             # React context providers
│   ├── types/                 # TypeScript type definitions
│   └── public/                # Static assets
├── .env                       # Environment variables
├── package.json              # Root package configuration
├── workspace.json            # Workspace configuration
├── Makefile                  # Build and deployment commands
└── README.md                 # This file
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git**
- **Foundry** (for smart contract development)

### Installing Foundry

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version
anvil --version
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone git@github.com:nawar-hisso/multibank-group-assessment.git
cd multibank-group-assessment
```

### 2. Install All Dependencies

```bash
# Install all dependencies (frontend + contracts)
make install

# Or install separately:
npm run install:frontend
npm run install:contracts
```

## 🔗 Smart Contracts

### Contract Overview

The `NFTMarketplace.sol` contract provides:

- **ERC721 NFT minting** with metadata support
- **Marketplace functionality** for listing and buying NFTs
- **ETH-only payments** with automatic fee distribution
- **Owner controls** for fee management and contract pausing
- **Security features** including reentrancy protection

### Initialize Contracts Project

```bash
# Navigate to contracts directory
cd contracts

# Install Foundry dependencies
forge install

# Install required libraries (if not already installed)
forge install OpenZeppelin/openzeppelin-contracts
forge install foundry-rs/forge-std
```

### Test Smart Contracts

```bash
# Run all tests
cd contracts
forge test

# Run tests with verbosity
forge test -vvv

# Run specific test
forge test --match-test testCreateNFTItem

# Or use make command from root
make contracts-test
```

### Deploy Smart Contracts

#### 1. Start Local Blockchain (Anvil)

```bash
# Start Anvil local chain
anvil

# This will start a local blockchain on http://localhost:8545
# with pre-funded accounts and private keys
```

#### 2. Deploy Contracts

```bash
# Deploy using the full deployment script
cd contracts
forge script script/DeployNFTMarketplace.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Or use make command from root
make contracts-deploy
```

#### 3. What Happens During Deployment

When you deploy the contracts, the following occurs:

1. **Contract Deployment**: The NFTMarketplace contract is deployed to the local chain
2. **Sample NFTs Creation**: 20 sample NFTs are automatically created and listed
3. **Configuration File Generation**: A `deployed-contracts.json` file is created with:

   - Contract addresses
   - Network configuration
   - Environment variables for frontend integration

4. **Console Output**: You'll see:
   ```
   NFT Marketplace deployed to: 0x...
   Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   Contract owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   Creating and listing 20 sample NFTs...
   Total NFTs created: 20
   ```

#### 4. Update Frontend Configuration

After deployment, update the `.env` file with the deployed contract address:

```bash
# Copy the contract address from deployment output
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=0x... # Replace with actual address
```

The deployment script automatically generates environment variables, but you should verify they match your `.env` file.

## 🎨 Frontend Application

### Initialize Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify environment variables are loaded
npm run dev
```

### Frontend Architecture

The frontend uses:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Wagmi** for Web3 wallet integration
- **Zustand** for state management
- **React Query** for server state management
- **Framer Motion** for animations

### Run Frontend Development Server

```bash
# Start development server
cd frontend
npm run dev

# Or use make command from root
make dev

# Access the application at http://localhost:3000
```

### Build Frontend for Production

```bash
# Build for production
cd frontend
npm run build

# Start production server
npm run start

# Or use make commands from root
make build
make start
```

## 🚀 Deployment Process

### Complete Deployment Workflow

1. **Start Local Blockchain**:

   ```bash
   anvil
   ```

2. **Deploy Smart Contracts**:

   ```bash
   make contracts-deploy
   ```

3. **Update Environment Variables**:

   - Copy the deployed contract address from the console output
   - Update `NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS` in `.env`

4. **Start Frontend**:

   ```bash
   make dev
   ```

5. **Connect Wallet**:

   - Open http://localhost:3000
   - Connect your MetaMask wallet
   - Import one of the Anvil test accounts:

     ```
     Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 (Creator)
     Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

     Private Key: 59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
     Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
     ```

   - Configures wallet connections
   - Sets up chain configuration
   - Handles network switching

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all contract tests
make contracts-test

# Run with gas reporting
cd contracts
forge test --gas-report

# Run specific test file
forge test test/NFTMarketplace.t.sol

# Run with maximum verbosity
forge test -vvvv
```

### Test Coverage

The smart contract test suite includes 39 comprehensive tests covering:

- NFT creation and minting
- Marketplace listing and unlisting
- Buying and selling functionality
- Fee calculation and distribution
- Access control and permissions
- Edge cases and error conditions
- Gas optimization verification

### Frontend Testing

```bash
# Run frontend tests (when available)
make frontend-test

# Or directly
cd frontend
npm test
```

## ⚙️ Environment Configuration

### Environment Variables

The `.env` file contains all necessary configuration:

```env
# Blockchain Configuration
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://localhost:8545
CHAIN_ID=31337

# Contract Configuration
MARKETPLACE_FEE=250
SUPPORTS_ETH=true

# Frontend Configuration
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_APP_NAME="MultiBank Group Assessment"
```

## 🏗️ Architecture

### Smart Contract Architecture

```
NFTMarketplace.sol
├── ERC721 (OpenZeppelin)
├── Ownable (OpenZeppelin)
├── ReentrancyGuard (OpenZeppelin)
├── Pausable (OpenZeppelin)
└── Custom Marketplace Logic
```

### Frontend Architecture

```
Frontend Application
├── App Router (Next.js 14)
├── Component Architecture
│   ├── Pages (app/)
│   ├── Components (components/)
│   ├── Hooks (hooks/)
│   └── Services (services/)
├── State Management (Zustand)
├── Web3 Integration (Wagmi)
└── Styling (Tailwind CSS)
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**MultiBank Group Assessment** - A comprehensive NFT marketplace demonstrating modern Web3 development practices.
