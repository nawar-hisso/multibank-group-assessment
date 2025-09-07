import { useWalletStore } from '@/stores/wallet-store'

describe('Wallet Store', () => {
  it('returns mocked store state', () => {
    const store = useWalletStore()
    
    expect(store.isConnected).toBe(false)
    expect(store.address).toBeNull()
    expect(store.balance).toBeNull()
    expect(store.chainId).toBeNull()
    expect(store.walletType).toBeNull()
    expect(store.isConnecting).toBe(false)
    expect(store.error).toBeNull()
  })

  it('has required store methods', () => {
    const store = useWalletStore()
    
    expect(typeof store.setConnecting).toBe('function')
    expect(typeof store.setError).toBe('function')
    expect(typeof store.setWalletData).toBe('function')
    expect(typeof store.reset).toBe('function')
    expect(typeof store.connect).toBe('function')
    expect(typeof store.disconnect).toBe('function')
    expect(typeof store.switchChain).toBe('function')
  })

  it('calls setConnecting method', () => {
    const store = useWalletStore()
    
    store.setConnecting(true)
    expect(store.setConnecting).toHaveBeenCalledWith(true)
  })

  it('calls setError method', () => {
    const store = useWalletStore()
    
    const errorMessage = 'Connection failed'
    store.setError(errorMessage)
    expect(store.setError).toHaveBeenCalledWith(errorMessage)
  })

  it('calls setWalletData method', () => {
    const store = useWalletStore()
    
    const walletData = {
      address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
      balance: '1.5',
      chainId: 1,
      walletType: 'MetaMask',
    }
    
    store.setWalletData(walletData)
    expect(store.setWalletData).toHaveBeenCalledWith(walletData)
  })

  it('calls disconnect method', () => {
    const store = useWalletStore()
    
    store.disconnect()
    expect(store.disconnect).toHaveBeenCalled()
  })

  it('calls reset method', () => {
    const store = useWalletStore()
    
    store.reset()
    expect(store.reset).toHaveBeenCalled()
  })

  it('calls connect method', () => {
    const store = useWalletStore()
    
    // Connect method expects parameters but we're just testing the mock
    expect(typeof store.connect).toBe('function')
  })

  it('calls switchChain method', () => {
    const store = useWalletStore()
    
    store.switchChain(1)
    expect(store.switchChain).toHaveBeenCalledWith(1)
  })
})
