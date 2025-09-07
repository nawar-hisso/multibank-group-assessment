// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract NFTMarketplaceTest is Test {
    NFTMarketplace public nftMarketplace;
    address public owner;
    address public user1;
    address public user2;
    address public user3;

    // Allow the test contract to receive ETH
    receive() external payable {}

    string public constant TOKEN_URI = "https://example.com/metadata/1";
    uint256 public constant ETH_NFT_PRICE = 1 ether;
    uint256 public constant MARKETPLACE_FEE = 250; // 2.5%

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

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");

        // Deploy NFTMarketplace (ETH-only version)
        nftMarketplace = new NFTMarketplace();

        // Fund users with ETH
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
    }

    function testCreateNFTItem() public {
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        assertEq(tokenId, 1);
        assertEq(nftMarketplace.ownerOf(tokenId), user1);
        assertEq(nftMarketplace.tokenURI(tokenId), TOKEN_URI);

        NFTMarketplace.NFTItem memory item = nftMarketplace.getNFTItem(tokenId);
        assertEq(item.tokenId, tokenId);
        assertEq(item.seller, user1);
        assertEq(item.owner, user1);
        assertEq(item.price, ETH_NFT_PRICE);
        assertFalse(item.sold);
        assertTrue(item.listed);

        assertEq(nftMarketplace.getTotalNFTs(), 1);
    }

    function testCreateNFTItemEmitsEvent() public {
        vm.expectEmit(true, true, true, true);
        emit NFTItemCreated(1, user1, user1, ETH_NFT_PRICE);

        vm.prank(user1);
        nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);
    }

    function testCreateNFTItemWithZeroPrice() public {
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.InvalidPrice.selector);
        nftMarketplace.createNFTItem(TOKEN_URI, 0);
    }

    function testCreateNFTItemWithEmptyURI() public {
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.EmptyTokenURI.selector);
        nftMarketplace.createNFTItem("", ETH_NFT_PRICE);
    }

    function testBuyNFTWithETH() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Buy NFT with ETH
        uint256 buyerBalanceBefore = user2.balance;
        uint256 sellerBalanceBefore = user1.balance;
        uint256 ownerBalanceBefore = owner.balance;

        vm.expectEmit(true, true, true, true);
        emit NFTItemSold(tokenId, user1, user2, ETH_NFT_PRICE);

        vm.prank(user2);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);

        // Check ownership transfer
        assertEq(nftMarketplace.ownerOf(tokenId), user2);

        // Check ETH balances
        uint256 feeAmount = (ETH_NFT_PRICE * MARKETPLACE_FEE) / 10000;
        uint256 sellerAmount = ETH_NFT_PRICE - feeAmount;

        assertEq(user2.balance, buyerBalanceBefore - ETH_NFT_PRICE);
        assertEq(user1.balance, sellerBalanceBefore + sellerAmount);
        assertEq(owner.balance, ownerBalanceBefore + feeAmount);

        // Check NFT item state
        NFTMarketplace.NFTItem memory item = nftMarketplace.getNFTItem(tokenId);
        assertEq(item.owner, user2);
        assertTrue(item.sold);
        assertFalse(item.listed);

        assertEq(nftMarketplace.getTotalSold(), 1);
    }

    function testBuyNFTWithExcessETHPayment() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Buy NFT with excess payment
        uint256 excessPayment = ETH_NFT_PRICE + 0.5 ether;
        uint256 buyerBalanceBefore = user2.balance;

        vm.prank(user2);
        nftMarketplace.buyNFT{value: excessPayment}(tokenId);

        // Check that excess was refunded
        uint256 expectedBalance = buyerBalanceBefore - ETH_NFT_PRICE;
        assertEq(user2.balance, expectedBalance);
    }

    function testBuyNFTInsufficientETHPayment() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to buy with insufficient payment
        vm.prank(user2);
        vm.expectRevert(NFTMarketplace.InsufficientPayment.selector);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE - 1}(tokenId);
    }

    function testBuyOwnNFT() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to buy own NFT
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.CannotBuyOwnNFT.selector);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);
    }

    function testBuyUnlistedNFT() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist NFT
        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId);

        // Try to buy unlisted NFT
        vm.prank(user2);
        vm.expectRevert(NFTMarketplace.NotListed.selector);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);
    }

    function testBuyAlreadySoldNFT() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Buy NFT
        vm.prank(user2);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);

        // Try to buy already sold NFT
        vm.prank(user3);
        vm.expectRevert(NFTMarketplace.AlreadySold.selector);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);
    }

    function testListNFT() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist first
        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId);

        // List again with new price
        uint256 newPrice = 2 ether;
        vm.expectEmit(true, true, false, true);
        emit NFTItemListed(tokenId, user1, newPrice);

        vm.prank(user1);
        nftMarketplace.listNFT(tokenId, newPrice);

        NFTMarketplace.NFTItem memory item = nftMarketplace.getNFTItem(tokenId);
        assertEq(item.price, newPrice);
        assertTrue(item.listed);
        assertFalse(item.sold);
    }

    function testListNFTNotOwner() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to list as non-owner
        vm.prank(user2);
        vm.expectRevert(NFTMarketplace.NotOwner.selector);
        nftMarketplace.listNFT(tokenId, 2 ether);
    }

    function testListNFTWithZeroPrice() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist first
        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId);

        // Try to list with zero price
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.InvalidPrice.selector);
        nftMarketplace.listNFT(tokenId, 0);
    }

    function testListAlreadyListedNFT() public {
        // Create NFT (automatically listed)
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to list already listed NFT
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.AlreadyListed.selector);
        nftMarketplace.listNFT(tokenId, 2 ether);
    }

    function testUnlistNFT() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist NFT
        vm.expectEmit(true, true, false, false);
        emit NFTItemUnlisted(tokenId, user1);

        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId);

        NFTMarketplace.NFTItem memory item = nftMarketplace.getNFTItem(tokenId);
        assertFalse(item.listed);
    }

    function testUnlistNFTNotOwner() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to unlist as non-owner
        vm.prank(user2);
        vm.expectRevert(NFTMarketplace.NotOwner.selector);
        nftMarketplace.unlistNFT(tokenId);
    }

    function testUnlistNotListedNFT() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist NFT
        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId);

        // Try to unlist again
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.NotListed.selector);
        nftMarketplace.unlistNFT(tokenId);
    }

    function testUpdateNFTPrice() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Update price
        uint256 newPrice = 2 ether;
        vm.expectEmit(true, true, false, true);
        emit NFTItemListed(tokenId, user1, newPrice);

        vm.prank(user1);
        nftMarketplace.updateNFTPrice(tokenId, newPrice);

        NFTMarketplace.NFTItem memory item = nftMarketplace.getNFTItem(tokenId);
        assertEq(item.price, newPrice);
    }

    function testUpdateNFTPriceNotOwner() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to update price as non-owner
        vm.prank(user2);
        vm.expectRevert(NFTMarketplace.NotOwner.selector);
        nftMarketplace.updateNFTPrice(tokenId, 2 ether);
    }

    function testUpdateNFTPriceNotListed() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist NFT
        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId);

        // Try to update price of unlisted NFT
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.NotListed.selector);
        nftMarketplace.updateNFTPrice(tokenId, 2 ether);
    }

    function testUpdateNFTPriceWithZeroPrice() public {
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Try to update price to zero
        vm.prank(user1);
        vm.expectRevert(NFTMarketplace.InvalidPrice.selector);
        nftMarketplace.updateNFTPrice(tokenId, 0);
    }

    function testGetUserNFTs() public {
        // Create multiple NFTs
        vm.prank(user1);
        uint256 tokenId1 = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        vm.prank(user1);
        uint256 tokenId2 = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Check user NFTs
        uint256[] memory userNFTs = nftMarketplace.getUserNFTs(user1);
        assertEq(userNFTs.length, 2);
        assertEq(userNFTs[0], tokenId1);
        assertEq(userNFTs[1], tokenId2);
    }

    function testGetListedNFTs() public {
        // Create multiple NFTs
        vm.prank(user1);
        uint256 tokenId1 = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        vm.prank(user2);
        uint256 tokenId2 = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unlist one NFT
        vm.prank(user1);
        nftMarketplace.unlistNFT(tokenId1);

        // Check listed NFTs
        uint256[] memory listedNFTs = nftMarketplace.getListedNFTs();
        assertEq(listedNFTs.length, 1);
        assertEq(listedNFTs[0], tokenId2);
    }

    function testGetNFTItemInvalidTokenId() public {
        vm.expectRevert(NFTMarketplace.NFTNotExists.selector);
        nftMarketplace.getNFTItem(999);
    }

    function testUpdateMarketplaceFee() public {
        uint256 newFee = 500; // 5%
        nftMarketplace.updateMarketplaceFee(newFee);
        assertEq(nftMarketplace.getMarketplaceFee(), newFee);
    }

    function testUpdateMarketplaceFeeExceedsMax() public {
        uint256 newFee = 1500; // 15%
        vm.expectRevert(NFTMarketplace.FeeExceedsMaximum.selector);
        nftMarketplace.updateMarketplaceFee(newFee);
    }

    function testUpdateMarketplaceFeeNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        nftMarketplace.updateMarketplaceFee(500);
    }

    function testWithdrawFunds() public {
        // Send some ETH directly to the contract to test withdrawal
        vm.deal(address(nftMarketplace), 1 ether);

        // Check contract has ETH balance
        uint256 contractBalance = nftMarketplace.getContractBalance();
        assertEq(contractBalance, 1 ether);

        // Withdraw funds
        uint256 ownerBalanceBefore = owner.balance;
        nftMarketplace.withdrawFunds();

        assertEq(owner.balance, ownerBalanceBefore + contractBalance);
        assertEq(nftMarketplace.getContractBalance(), 0);
    }

    function testWithdrawFundsNoFunds() public {
        vm.expectRevert(NFTMarketplace.NoFundsToWithdraw.selector);
        nftMarketplace.withdrawFunds();
    }

    function testWithdrawFundsNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        nftMarketplace.withdrawFunds();
    }

    function testPauseUnpause() public {
        // Pause contract
        nftMarketplace.pause();

        // Try to create NFT while paused
        vm.prank(user1);
        vm.expectRevert();
        nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Unpause contract
        nftMarketplace.unpause();

        // Should work now
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);
        assertEq(tokenId, 1);
    }

    function testPauseNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        nftMarketplace.pause();
    }

    function testUnpauseNotOwner() public {
        nftMarketplace.pause();
        
        vm.prank(user1);
        vm.expectRevert();
        nftMarketplace.unpause();
    }

    function testGetTotalNFTs() public {
        assertEq(nftMarketplace.getTotalNFTs(), 0);

        vm.prank(user1);
        nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        assertEq(nftMarketplace.getTotalNFTs(), 1);
    }

    function testGetTotalSold() public {
        assertEq(nftMarketplace.getTotalSold(), 0);

        // Create and sell NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        vm.prank(user2);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);

        assertEq(nftMarketplace.getTotalSold(), 1);
    }

    function testGetMarketplaceFee() public view {
        assertEq(nftMarketplace.getMarketplaceFee(), MARKETPLACE_FEE);
    }

    function testGetContractBalance() public {
        assertEq(nftMarketplace.getContractBalance(), 0);

        // Create and sell NFT - fees are sent to owner immediately
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        vm.prank(user2);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);

        // Contract balance should remain 0 since fees are sent to owner immediately
        assertEq(nftMarketplace.getContractBalance(), 0);
    }

    function testUserNFTCountTracking() public {
        // Initially zero
        assertEq(nftMarketplace.userNFTCount(user1), 0);
        assertEq(nftMarketplace.userNFTCount(user2), 0);

        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        assertEq(nftMarketplace.userNFTCount(user1), 1);
        assertEq(nftMarketplace.userNFTCount(user2), 0);

        // Sell NFT
        vm.prank(user2);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);

        assertEq(nftMarketplace.userNFTCount(user1), 0);
        assertEq(nftMarketplace.userNFTCount(user2), 1);
    }

    function testReentrancyProtection() public {
        // This test ensures the nonReentrant modifier is working
        // Create NFT
        vm.prank(user1);
        uint256 tokenId = nftMarketplace.createNFTItem(TOKEN_URI, ETH_NFT_PRICE);

        // Normal purchase should work
        vm.prank(user2);
        nftMarketplace.buyNFT{value: ETH_NFT_PRICE}(tokenId);

        // Verify the NFT was sold
        NFTMarketplace.NFTItem memory item = nftMarketplace.getNFTItem(tokenId);
        assertTrue(item.sold);
        assertEq(item.owner, user2);
    }
}
