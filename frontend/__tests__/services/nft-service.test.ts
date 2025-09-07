import { getNFTs, getNFTById } from '@/services/nft-service'
import { blockchainService } from '@/services/blockchain-service'

// Mock the blockchain service
jest.mock('@/services/blockchain-service')
const mockBlockchainService = blockchainService as jest.Mocked<typeof blockchainService>

describe('NFT Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getNFTs', () => {
    it('returns empty array when blockchain service is not connected', async () => {
      mockBlockchainService.isConnected.mockReturnValue(false)

      const result = await getNFTs()

      expect(result).toEqual([])
      expect(mockBlockchainService.isConnected).toHaveBeenCalledTimes(1)
    })

    it('fetches and converts NFTs from blockchain service', async () => {
      const mockContractNFTs = [
        {
          tokenId: BigInt(1),
          creator: '0x123',
          owner: '0x456',
          price: BigInt('1000000000000000000'), // 1 ETH in wei
          isListed: true,
          sold: false,
        },
        {
          tokenId: BigInt(2),
          creator: '0x789',
          owner: '0xabc',
          price: BigInt('2000000000000000000'), // 2 ETH in wei
          isListed: true,
          sold: false,
        },
      ]

      mockBlockchainService.isConnected.mockReturnValue(true)
      mockBlockchainService.getListedNFTs.mockResolvedValue(mockContractNFTs)
      mockBlockchainService.formatPrice.mockImplementation((price) => {
        return (Number(price) / 1e18).toString()
      })

      const result = await getNFTs()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: '1',
        title: 'NFT #1',
        price: '1 ETH',
        creator: '0x123',
        owner: '0x456',
        isListed: true,
        sold: false,
      })
      expect(result[1]).toMatchObject({
        id: '2',
        title: 'NFT #2',
        price: '2 ETH',
        creator: '0x789',
        owner: '0xabc',
        isListed: true,
        sold: false,
      })
    })

    it('handles errors gracefully and returns empty array', async () => {
      mockBlockchainService.isConnected.mockReturnValue(true)
      mockBlockchainService.getListedNFTs.mockRejectedValue(new Error('Network error'))

      const result = await getNFTs()

      expect(result).toEqual([])
    })

    it('filters out null NFTs from conversion failures', async () => {
      const mockContractNFTs = [
        {
          tokenId: BigInt(1),
          creator: '0x123',
          owner: '0x456',
          price: BigInt('1000000000000000000'),
          isListed: true,
          sold: false,
        },
        // This NFT will cause conversion to fail
        {
          tokenId: BigInt(2),
          creator: '', // Invalid creator
          owner: '0xabc',
          price: BigInt('2000000000000000000'),
          isListed: true,
          sold: false,
        },
      ]

      mockBlockchainService.isConnected.mockReturnValue(true)
      mockBlockchainService.getListedNFTs.mockResolvedValue(mockContractNFTs)
      mockBlockchainService.formatPrice.mockImplementation((price) => {
        if (price === BigInt('2000000000000000000')) {
          throw new Error('Conversion failed')
        }
        return (Number(price) / 1e18).toString()
      })

      const result = await getNFTs()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  })

  describe('getNFTById', () => {
    it('returns NFT when found', async () => {
      const mockNFTs = [
        {
          id: '1',
          title: 'NFT #1',
          price: '1 ETH',
          creator: '0x123',
          owner: '0x456',
          isListed: true,
          sold: false,
        },
        {
          id: '2',
          title: 'NFT #2',
          price: '2 ETH',
          creator: '0x789',
          owner: '0xabc',
          isListed: true,
          sold: false,
        },
      ]

      // Mock getNFTs to return our test data
      mockBlockchainService.isConnected.mockReturnValue(true)
      mockBlockchainService.getListedNFTs.mockResolvedValue([
        {
          tokenId: BigInt(1),
          creator: '0x123',
          owner: '0x456',
          price: BigInt('1000000000000000000'),
          isListed: true,
          sold: false,
        },
        {
          tokenId: BigInt(2),
          creator: '0x789',
          owner: '0xabc',
          price: BigInt('2000000000000000000'),
          isListed: true,
          sold: false,
        },
      ])
      mockBlockchainService.formatPrice.mockImplementation((price) => {
        return (Number(price) / 1e18).toString()
      })

      const result = await getNFTById('1')

      expect(result).toMatchObject({
        id: '1',
        title: 'NFT #1',
        creator: '0x123',
        owner: '0x456',
      })
    })

    it('returns null when NFT not found', async () => {
      mockBlockchainService.isConnected.mockReturnValue(true)
      mockBlockchainService.getListedNFTs.mockResolvedValue([])

      const result = await getNFTById('999')

      expect(result).toBeNull()
    })

    it('returns null when error occurs', async () => {
      mockBlockchainService.isConnected.mockReturnValue(true)
      mockBlockchainService.getListedNFTs.mockRejectedValue(new Error('Network error'))

      const result = await getNFTById('1')

      expect(result).toBeNull()
    })
  })
})
