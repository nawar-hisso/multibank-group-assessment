// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract TestDeployment is Script {
    function setUp() public {}

    function run() public returns (NFTMarketplace) {
        // Use a test private key for simulation
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        // Deploy NFTMarketplace (ETH-only version)
        NFTMarketplace nftMarketplace = new NFTMarketplace();

        vm.stopBroadcast();

        console.log("=== DEPLOYMENT SUCCESSFUL ===");
        console.log("NFT Marketplace deployed to:", address(nftMarketplace));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Contract owner:", nftMarketplace.owner());
        
        // Test basic functionality
        console.log("=== TESTING BASIC FUNCTIONALITY ===");
        console.log("Marketplace fee:", nftMarketplace.getMarketplaceFee());
        console.log("Total NFTs:", nftMarketplace.getTotalNFTs());
        console.log("Total sold:", nftMarketplace.getTotalSold());
        console.log("Contract balance:", nftMarketplace.getContractBalance());

        return nftMarketplace;
    }
}
