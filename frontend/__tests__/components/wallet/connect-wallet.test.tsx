import { render, screen, fireEvent } from '@testing-library/react'
import { ConnectWallet } from '@/components/wallet/connect-wallet'

describe('ConnectWallet Component', () => {
  it('renders connect wallet page', () => {
    render(<ConnectWallet />)
    
    expect(screen.getByText('Connect wallet')).toBeTruthy()
    expect(screen.getByText('Connect Your Wallet')).toBeTruthy()
    expect(screen.getByText('Join the NFT marketplace')).toBeTruthy()
  })

  it('renders MetaMask wallet option', () => {
    render(<ConnectWallet />)
    
    expect(screen.getByText('Metamask')).toBeTruthy()
    expect(screen.getByAltText('MetaMask')).toBeTruthy()
  })

  it('calls onWalletSelect when MetaMask is clicked', () => {
    const mockOnWalletSelect = jest.fn()
    render(<ConnectWallet onWalletSelect={mockOnWalletSelect} />)
    
    const metamaskButton = screen.getByText('Metamask').closest('button')
    fireEvent.click(metamaskButton!)
    
    expect(mockOnWalletSelect).toHaveBeenCalledWith('metamask')
  })

  it('handles click without onWalletSelect prop', () => {
    // Should not throw error when onWalletSelect is not provided
    render(<ConnectWallet />)
    
    const metamaskButton = screen.getByText('Metamask').closest('button')
    expect(() => fireEvent.click(metamaskButton!)).not.toThrow()
  })

  it('applies custom className', () => {
    const customClass = 'custom-class'
    render(<ConnectWallet className={customClass} />)
    
    // The className is applied to the root container
    const rootContainer = screen.getByText('Connect wallet').closest('.bg-background')
    expect(rootContainer?.className).toContain(customClass)
  })

  it('renders wallet option with correct structure', () => {
    render(<ConnectWallet />)
    
    const metamaskButton = screen.getByText('Metamask').closest('button')
    expect(metamaskButton).toBeTruthy()
    expect(metamaskButton?.className).toContain('bg-background-secondary')
    expect(metamaskButton?.className).toContain('border-primary')
  })
})
