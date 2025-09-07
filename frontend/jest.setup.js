import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: undefined,
    isConnected: false,
    isConnecting: false,
    isDisconnected: true,
  })),
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: [],
    error: null,
    isLoading: false,
    pendingConnector: null,
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
  })),
  useContractRead: jest.fn(() => ({
    data: undefined,
    error: null,
    isLoading: false,
  })),
  useContractWrite: jest.fn(() => ({
    write: jest.fn(),
    writeAsync: jest.fn(),
    data: undefined,
    error: null,
    isLoading: false,
  })),
  usePrepareContractWrite: jest.fn(() => ({
    config: {},
    error: null,
    isLoading: false,
  })),
  useWaitForTransaction: jest.fn(() => ({
    data: undefined,
    error: null,
    isLoading: false,
  })),
}))

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
  QueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
  QueryClientProvider: ({ children }) => children,
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock Zustand stores
jest.mock('@/stores/wallet-store', () => {
  const mockStore = {
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    walletType: null,
    isConnecting: false,
    error: null,
    setConnecting: jest.fn(),
    setError: jest.fn(),
    setWalletData: jest.fn(),
    reset: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    switchChain: jest.fn(),
  }
  
  return {
    useWalletStore: jest.fn(() => mockStore),
    // Add setState method for testing
    useWalletStore: Object.assign(jest.fn(() => mockStore), {
      setState: jest.fn((updater) => {
        if (typeof updater === 'function') {
          Object.assign(mockStore, updater(mockStore))
        } else {
          Object.assign(mockStore, updater)
        }
      }),
      getState: jest.fn(() => mockStore),
    }),
  }
})

jest.mock('@/stores/marketplace-store', () => ({
  useMarketplaceStore: jest.fn(() => ({
    nfts: [],
    loading: false,
    error: null,
    fetchNFTs: jest.fn(),
    buyNFT: jest.fn(),
    createNFT: jest.fn(),
  })),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS = '0x1234567890123456789012345678901234567890'
process.env.NEXT_PUBLIC_RPC_URL = 'http://localhost:8545'
process.env.NEXT_PUBLIC_CHAIN_ID = '31337'
process.env.NEXT_PUBLIC_APP_NAME = 'MultiBank Group Assessment'

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    isMetaMask: true,
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
})

// Suppress console warnings in tests
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})
