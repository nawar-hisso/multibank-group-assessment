// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract DeployNFTMarketplace is Script {
    function setUp() public {}

    function run() public returns (NFTMarketplace) {
        vm.startBroadcast();

        // Deploy NFTMarketplace (ETH payments only)
        NFTMarketplace nftMarketplace = new NFTMarketplace();

        console.log("NFT Marketplace deployed to:", address(nftMarketplace));
        console.log("Deployer:", msg.sender);
        console.log("Contract owner:", nftMarketplace.owner());
        console.log("Payment method: ETH");

        // Create and list sample NFTs
        console.log("Creating and listing 20 sample NFTs...");
        _createSampleNFTs(nftMarketplace);

        console.log("Total NFTs created:", nftMarketplace.getTotalNFTs());
        console.log("Sample NFT creation completed!");

        // Generate deployment JSON file
        _generateDeploymentJson(
            address(nftMarketplace),
            msg.sender,
            block.chainid
        );

        vm.stopBroadcast();

        return nftMarketplace;
    }

    function _generateDeploymentJson(
        address nftMarketplaceAddress,
        address deployer,
        uint256 chainId
    ) internal {
        string memory json = string.concat(
            "{\n",
            '  "chainId": ',
            vm.toString(chainId),
            ",\n",
            '  "networkName": "',
            _getNetworkName(chainId),
            '",\n',
            '  "rpcUrl": "http://localhost:8545",\n',
            '  "deploymentDate": "',
            vm.toString(block.timestamp),
            '",\n',
            '  "deployer": "',
            vm.toString(deployer),
            '",\n',
            '  "contracts": {\n',
            '    "NFTMarketplace": {\n',
            '      "address": "',
            vm.toString(nftMarketplaceAddress),
            '",\n',
            '      "paymentMethod": "ETH",\n',
            '      "marketplaceFee": 250\n',
            "    }\n",
            "  },\n",
            '  "environment": {\n',
            '    "NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS": "',
            vm.toString(nftMarketplaceAddress),
            '",\n',
            '    "NEXT_PUBLIC_RPC_URL": "http://localhost:8545",\n',
            '    "NEXT_PUBLIC_CHAIN_ID": "',
            vm.toString(chainId),
            '"\n',
            "  }\n",
            "}"
        );

        // Write to contracts directory
        vm.writeFile("../deployed-contracts.json", json);
        console.log(
            "Deployment JSON file generated: contracts/deployed-contracts.json"
        );
        console.log(
            "Please copy this file to the root directory for frontend integration"
        );
    }

    function _getNetworkName(
        uint256 chainId
    ) internal pure returns (string memory) {
        if (chainId == 1) return "Ethereum Mainnet";
        if (chainId == 11155111) return "Sepolia Testnet";
        if (chainId == 31337) return "Anvil Local";
        return "Unknown Network";
    }

    function _createSampleNFTs(NFTMarketplace nftMarketplace) internal {
        // Sample NFT metadata URIs
        string[20] memory tokenURIs = [
            "https://ipfs.io/ipfs/QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDiB4qiB23LpjkKUABv",
            "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS",
            "https://ipfs.io/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
            "https://ipfs.io/ipfs/QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLviVNjGZ",
            "https://ipfs.io/ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ",
            "https://ipfs.io/ipfs/QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDiB4qiB23LpjkKUABv",
            "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS",
            "https://ipfs.io/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
            "https://ipfs.io/ipfs/QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLviVNjGZ",
            "https://ipfs.io/ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ",
            "https://ipfs.io/ipfs/QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDiB4qiB23LpjkKUABv",
            "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS",
            "https://ipfs.io/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
            "https://ipfs.io/ipfs/QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLviVNjGZ",
            "https://ipfs.io/ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ",
            "https://ipfs.io/ipfs/QmYx6GsYAKnNzZ9A6NvEKV9nf1VaDiB4qiB23LpjkKUABv",
            "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS",
            "https://ipfs.io/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
            "https://ipfs.io/ipfs/QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLviVNjGZ",
            "https://ipfs.io/ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ"
        ];

        // Sample prices in ETH (0.01 to 1 ETH)
        uint256[20] memory prices = [
            uint256(0.01 ether),
            uint256(0.05 ether),
            uint256(0.1 ether),
            uint256(0.15 ether),
            uint256(0.2 ether),
            uint256(0.25 ether),
            uint256(0.3 ether),
            uint256(0.35 ether),
            uint256(0.4 ether),
            uint256(0.45 ether),
            uint256(0.5 ether),
            uint256(0.55 ether),
            uint256(0.6 ether),
            uint256(0.65 ether),
            uint256(0.7 ether),
            uint256(0.75 ether),
            uint256(0.8 ether),
            uint256(0.85 ether),
            uint256(0.9 ether),
            uint256(1 ether)
        ];

        for (uint256 i = 0; i < 20; i++) {
            uint256 tokenId = nftMarketplace.createNFTItem(
                tokenURIs[i],
                prices[i]
            );
            console.log("Created NFT #", tokenId);
            console.log("Price:", prices[i]);
        }
    }
}
