# MultiBank Group Assessment Makefile

.PHONY: help install dev build test clean

# Default target
help:
	@echo "MultiBank Group Assessment"
	@echo "=========================="
	@echo ""
	@echo "Available commands:"
	@echo "  make install     - Install all dependencies"
	@echo "  make dev         - Start frontend development server"
	@echo "  make build       - Build frontend for production"
	@echo "  make test        - Run all tests"
	@echo "  make clean       - Clean build artifacts"
	@echo ""
	@echo "Frontend commands:"
	@echo "  make frontend-dev    - Start frontend development server"
	@echo "  make frontend-build  - Build frontend"
	@echo "  make frontend-test   - Test frontend"
	@echo ""
	@echo "Contract commands:"
	@echo "  make contracts-build - Build smart contracts"
	@echo "  make contracts-test  - Test smart contracts"
	@echo "  make contracts-deploy - Deploy contracts (requires env vars)"

# Installation
install:
	@echo "Installing all dependencies..."
	cd frontend && npm install
	cd contracts && forge install

# Development
dev: frontend-dev

frontend-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

# Building
build: frontend-build

frontend-build:
	@echo "Building frontend..."
	cd frontend && npm run build

contracts-build:
	@echo "Building smart contracts..."
	cd contracts && forge build

# Testing
test: frontend-test contracts-test

frontend-test:
	@echo "Testing frontend..."
	cd frontend && npm test

contracts-test:
	@echo "Testing smart contracts..."
	cd contracts && forge test

# Deployment
contracts-deploy:
	@echo "Deploying smart contracts..."
	cd contracts && forge script script/DeployNFTMarketplace.s.sol --rpc-url $$RPC_URL --private-key $$PRIVATE_KEY --broadcast

# Cleaning
clean:
	@echo "Cleaning build artifacts..."
	cd frontend && rm -rf .next out dist
	cd contracts && forge clean
