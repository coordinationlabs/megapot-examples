# Gifting Tickets

This will show you how to issue Megapot tickets for any user wallet address.  Great for community rewards, promotions or any other reason to buy tickets in bulk.

Issue tickets in bulk, prizes claimable by a user's own Ethereum wallet in a few easy steps:
1. Create a simple csv of wallet addresses
2. Edit a few paramaters
3. Run the script and view the output

# Overview
This fully functioning batch ticket issuance script takes a csv input of wallet addresses and calls the Megapot purchaseTickets contract function through viem's packages.

Transaction confimation is stored in either JSON or CSV based on your choice.

# Setup

[Megapot Examples Repo](https://github.com/coordinationlabs/megapot-examples)

```
# Clone repository
git clone git@github.com:coordinationlabs/megapot-examples.git

# Change into directory
cd gifting-tickets

# Install dependencies
pnpm install

# Copy env example
cp .env.example .env

# Edit .env & add API token
# PRIVATE_KEY=='<your-wallet-private-key>'

# Start the server
pnpm start index.ts
```

# Usage

## Input File Format
Create a CSV file in the `input` directory (default: `input/gift_wallets.csv`) with two columns:
1. Ethereum wallet address
2. Number of tickets to gift

Example:
```csv
0x4CfBdCeF1234567890aBcDeF1234567890,100
0x9aBcDeF1234567890aBcDeF1234567890a,50
0x1234567890aBcDeF1234567890aBcDeF12,25
```

## Running the Script
1. Configure your `.env` file with:
    - Your wallet's private key
        - Make sure you fund this wallet with ETH gas & ERC20 tokens
    - Contract addresses - Default: Megapot Jackpot
        - Jackpot contract, either Megapot's or your customer ERC20 jackpot
    - ERC20 settings - Default: USDC
        - Set script to use USDC or your custom ERC20 token.
    - Input/output file paths
    - Set `SIMULATION_ONLY=true` for testing (recommended for first run)

2. Run the script:
```bash
pnpm start index.ts
```

## What the Script Does
1. Reads and validates the input CSV file
2. Calculates total tickets and cost in USDC
3. Displays a summary of the operation
4. If not in simulation mode:
   - Approves USDC spending for the Megapot contract
   - Processes each wallet address:
     - Simulates the transaction
     - Purchases tickets if simulation succeeds
     - Records transaction details
5. Outputs results to:
   - Console (real-time updates)
   - CSV file (default: `output/gift_wallets.csv`) with:
     - Wallet address
     - Number of tickets
     - Transaction hash
     - Gas used
     - Effective gas price

## Error Handling
- Invalid addresses or ticket counts will be caught during CSV validation
- Failed transactions are logged but won't stop the script
- Each transaction is simulated before execution to prevent unnecessary gas costs