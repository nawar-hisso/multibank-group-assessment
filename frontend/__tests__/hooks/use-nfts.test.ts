import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { useNFTs } from '@/hooks/use-nfts'
import * as nftService from '@/services/nft-service'

// Mock the nft service
jest.mock('@/services/nft-service')
const mockNftService = nftService as jest.Mocked<typeof nftService>

// Mock React Query
jest.mock('@tanstack/react-query')
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

describe('useNFTs Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns loading state initially', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    } as any)

    const { result } = renderHook(() => useNFTs())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it('returns NFT data when loaded successfully', async () => {
    const mockNFTs = [
      {
        id: '1',
        title: 'Test NFT 1',
        price: '1.0 ETH',
        artist: 'Artist 1',
        image: '/test1.png',
      },
      {
        id: '2',
        title: 'Test NFT 2',
        price: '2.0 ETH',
        artist: 'Artist 2',
        image: '/test2.png',
      },
    ]

    mockUseQuery.mockReturnValue({
      data: mockNFTs,
      error: null,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any)

    const { result } = renderHook(() => useNFTs())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual(mockNFTs)
    expect(result.current.error).toBeNull()
  })

  it('returns error state when fetch fails', () => {
    const mockError = new Error('Failed to fetch NFTs')

    mockUseQuery.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    } as any)

    const { result } = renderHook(() => useNFTs())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toEqual(mockError)
    expect(result.current.isError).toBe(true)
  })

  it('provides refetch function', () => {
    const mockRefetch = jest.fn()

    mockUseQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    } as any)

    const { result } = renderHook(() => useNFTs())

    expect(typeof result.current.refetch).toBe('function')
    
    result.current.refetch()
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('calls getNFTs service function', () => {
    mockNftService.getNFTs.mockResolvedValue([])
    
    mockUseQuery.mockImplementation((options: any) => {
      // Simulate calling the query function
      options.queryFn()
      
      return {
        data: [],
        error: null,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
      } as any
    })

    renderHook(() => useNFTs())

    expect(mockNftService.getNFTs).toHaveBeenCalledTimes(1)
  })
})
