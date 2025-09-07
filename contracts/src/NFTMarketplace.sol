// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NFTMarketplace
 * @dev A comprehensive NFT marketplace supporting ETH payments
 * @notice This contract allows users to mint, list, buy, and sell NFTs using ETH
 */
contract NFTMarketplace is
    ERC721,
    ERC721URIStorage,
    Ownable,
    ReentrancyGuard,
    Pausable
{
    // State variables
    uint256 private _tokenIdCounter;
    uint256 private _itemsSold;
    uint256 public marketplaceFee = 250; // 2.5% in basis points
    uint256 public constant MAX_FEE = 1000; // 10% maximum fee

    struct NFTItem {
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
        bool listed;
    }

    // Mappings
    mapping(uint256 => NFTItem) public idToNFTItem;
    mapping(address => uint256) public userNFTCount;

    // Events
    event NFTItemCreated(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed owner,
        uint256 price
    );

    event NFTItemSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    event NFTItemListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event NFTItemUnlisted(uint256 indexed tokenId, address indexed owner);
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);

    // Custom errors for gas optimization
    error InvalidPrice();
    error EmptyTokenURI();
    error NotListed();
    error AlreadySold();
    error CannotBuyOwnNFT();
    error NotOwner();
    error NFTNotExists();
    error AlreadyListed();
    error FeeExceedsMaximum();
    error NoFundsToWithdraw();
    error TransferFailed();
    error InsufficientPayment();

    /**
     * @dev Constructor
     */
    constructor() ERC721("NFT Marketplace", "NFTM") Ownable(msg.sender) {
        // No need for payment token address since we're using ETH
    }

    // Modifiers
    modifier validTokenId(uint256 tokenId) {
        if (tokenId == 0 || tokenId > _tokenIdCounter) revert NFTNotExists();
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();
        _;
    }

    /**
     * @dev Creates and mints a new NFT
     * @param _tokenURI The metadata URI for the NFT
     * @param price The listing price for the NFT in wei
     * @return The token ID of the newly created NFT
     */
    function createNFTItem(
        string memory _tokenURI,
        uint256 price
    ) external whenNotPaused returns (uint256) {
        if (price == 0) revert InvalidPrice();
        if (bytes(_tokenURI).length == 0) revert EmptyTokenURI();

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        // Approve the marketplace contract to transfer this NFT
        _approve(address(this), newTokenId, msg.sender);

        idToNFTItem[newTokenId] = NFTItem({
            tokenId: newTokenId,
            seller: msg.sender,
            owner: msg.sender,
            price: price,
            sold: false,
            listed: true
        });

        emit NFTItemCreated(newTokenId, msg.sender, msg.sender, price);
        return newTokenId;
    }

    /**
     * @dev Buys an NFT with ETH
     * @param tokenId The ID of the NFT to purchase
     */
    function buyNFT(
        uint256 tokenId
    ) external payable nonReentrant whenNotPaused validTokenId(tokenId) {
        NFTItem storage item = idToNFTItem[tokenId];

        if (item.sold) revert AlreadySold();
        if (!item.listed) revert NotListed();
        if (msg.sender == item.seller) revert CannotBuyOwnNFT();
        if (msg.value < item.price) revert InsufficientPayment();

        _executeSale(tokenId, item);

        // Refund excess payment
        if (msg.value > item.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{
                value: msg.value - item.price
            }("");
            if (!refundSuccess) revert TransferFailed();
        }
    }

    /**
     * @dev Internal function to execute the sale logic
     * @param tokenId The ID of the NFT being sold
     * @param item Reference to the NFT item
     */
    function _executeSale(uint256 tokenId, NFTItem storage item) private {
        address seller = item.seller;
        uint256 price = item.price;

        // Update item state
        item.sold = true;
        item.listed = false;
        item.owner = msg.sender;
        _itemsSold++;

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // Calculate fees and payments
        uint256 feeAmount = (price * marketplaceFee) / 10000;
        uint256 sellerAmount = price - feeAmount;

        // Transfer ETH payments
        (bool sellerSuccess, ) = payable(seller).call{value: sellerAmount}("");
        if (!sellerSuccess) revert TransferFailed();

        // Send fees to owner immediately
        if (feeAmount > 0) {
            (bool feeSuccess, ) = payable(owner()).call{value: feeAmount}("");
            if (!feeSuccess) revert TransferFailed();
        }

        emit NFTItemSold(tokenId, seller, msg.sender, price);
    }

    /**
     * @dev Lists an existing NFT for sale
     * @param tokenId The ID of the NFT to list
     * @param price The listing price in wei
     */
    function listNFT(
        uint256 tokenId,
        uint256 price
    ) external whenNotPaused validTokenId(tokenId) onlyTokenOwner(tokenId) {
        if (price == 0) revert InvalidPrice();
        if (idToNFTItem[tokenId].listed) revert AlreadyListed();

        NFTItem storage item = idToNFTItem[tokenId];
        item.price = price;
        item.listed = true;
        item.sold = false;
        item.seller = msg.sender;

        // Approve the marketplace contract to transfer this NFT
        _approve(address(this), tokenId, msg.sender);

        emit NFTItemListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Unlists an NFT from sale
     * @param tokenId The ID of the NFT to unlist
     */
    function unlistNFT(
        uint256 tokenId
    ) external whenNotPaused validTokenId(tokenId) onlyTokenOwner(tokenId) {
        if (!idToNFTItem[tokenId].listed) revert NotListed();

        idToNFTItem[tokenId].listed = false;
        emit NFTItemUnlisted(tokenId, msg.sender);
    }

    /**
     * @dev Updates the price of a listed NFT
     * @param tokenId The ID of the NFT
     * @param newPrice The new price in wei
     */
    function updateNFTPrice(
        uint256 tokenId,
        uint256 newPrice
    ) external whenNotPaused validTokenId(tokenId) onlyTokenOwner(tokenId) {
        if (newPrice == 0) revert InvalidPrice();
        if (!idToNFTItem[tokenId].listed) revert NotListed();

        idToNFTItem[tokenId].price = newPrice;
        emit NFTItemListed(tokenId, msg.sender, newPrice);
    }

    // View functions

    /**
     * @dev Gets all listed NFTs
     * @return Array of token IDs that are currently listed
     */
    function getListedNFTs() external view returns (uint256[] memory) {
        uint256 totalNFTs = _tokenIdCounter;
        uint256 listedCount = 0;

        // Count listed NFTs
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (idToNFTItem[i].listed && !idToNFTItem[i].sold) {
                listedCount++;
            }
        }

        // Create array of listed NFTs
        uint256[] memory listedNFTs = new uint256[](listedCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (idToNFTItem[i].listed && !idToNFTItem[i].sold) {
                listedNFTs[index] = i;
                index++;
            }
        }

        return listedNFTs;
    }

    /**
     * @dev Gets NFTs owned by a specific user
     * @param user The address of the user
     * @return Array of token IDs owned by the user
     */
    function getUserNFTs(
        address user
    ) external view returns (uint256[] memory) {
        uint256 totalNFTs = _tokenIdCounter;
        uint256 ownedCount = 0;

        // Count owned NFTs
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (ownerOf(i) == user) {
                ownedCount++;
            }
        }

        // Create array of owned NFTs
        uint256[] memory ownedNFTs = new uint256[](ownedCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (ownerOf(i) == user) {
                ownedNFTs[index] = i;
                index++;
            }
        }

        return ownedNFTs;
    }

    /**
     * @dev Gets details of a specific NFT
     * @param tokenId The ID of the NFT
     * @return The NFT item details
     */
    function getNFTItem(
        uint256 tokenId
    ) external view validTokenId(tokenId) returns (NFTItem memory) {
        return idToNFTItem[tokenId];
    }

    /**
     * @dev Gets the total number of NFTs created
     * @return The total number of NFTs
     */
    function getTotalNFTs() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Gets the total number of NFTs sold
     * @return The total number of sold NFTs
     */
    function getTotalSold() external view returns (uint256) {
        return _itemsSold;
    }

    /**
     * @dev Gets the current marketplace fee
     * @return The marketplace fee in basis points
     */
    function getMarketplaceFee() external view returns (uint256) {
        return marketplaceFee;
    }

    // Owner functions

    /**
     * @dev Updates the marketplace fee
     * @param newFee The new fee in basis points (max 1000 = 10%)
     */
    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        if (newFee > MAX_FEE) revert FeeExceedsMaximum();
        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(oldFee, newFee);
    }

    /**
     * @dev Withdraws ETH from the contract
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoFundsToWithdraw();

        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Gets the contract's ETH balance
     * @return The ETH balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Override functions

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address from) {
        from = super._update(to, tokenId, auth);

        // Update NFT item owner if it exists
        NFTItem storage item = idToNFTItem[tokenId];
        if (item.tokenId != 0) {
            item.owner = to;

            // Auto-unlist if transferred outside marketplace (but not during sales)
            if (
                to != address(0) &&
                item.listed &&
                from != address(0) &&
                from != to &&
                !item.sold // Don't auto-unlist if it's already sold
            ) {
                item.listed = false;
            }
        }

        // Update user NFT counts only if not during minting
        if (from != address(0)) {
            userNFTCount[from]--;
        }
        if (to != address(0)) {
            userNFTCount[to]++;
        }

        return from;
    }
}
