import * as csv from 'csv-parse/sync'
import * as fs from 'fs'
import { erc20Abi, parseAbi } from 'viem'
import { config } from './config'
import { client, publicClient, account } from './viem'

// Load .env config
const {
    CONTRACT_ADDRESS,
    ERC20_ADDRESS: USDC_ADDRESS,
    TICKET_PRICE,
    REFERRER_ADDRESS,
    ERC20_DECIMALS,
    ERC20_SYMBOL,
    INPUT_FILE_PATH,
    OUTPUT_FILE_PATH,
    SIMULATION_ONLY
} = config

const PURCHASE_TICKETS_ABI = parseAbi([
    'function purchaseTickets(address referrer, uint256 value, address recipient)'
]);

interface GiftEntry {
    address: `0x${string}`
    tickets: number
}

async function loadAndValidateCSV(filepath: string = INPUT_FILE_PATH): Promise<GiftEntry[]> {
    const fileContent = fs.readFileSync(filepath)
    const records = csv.parse(fileContent)

    // Validate CSV format
    let recordCount = 1;
    return records.map((record: string[]) => {
        if (record.length !== 2) {
            throw new Error(`Invalid CSV format at entry ${recordCount}: ${record}`)
        }

        const address = record[0] as `0x${string}`
        const tickets = parseInt(record[1])

        if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
            throw new Error(`Invalid Ethereum address: ${address} at record ${recordCount}`)
        }
        if (isNaN(tickets) || tickets <= 0) {
            throw new Error(`Invalid ticket count for ${address} at record ${recordCount}: ${tickets}`)
        }

        recordCount++;
        return { address, tickets }
    })
}

async function main() {
    const entries = await loadAndValidateCSV()

    // Calculate totals
    const totalWallets = entries.length
    const totalTickets = entries.reduce((sum, entry) => sum + entry.tickets, 0)
    const totalCost = BigInt(TICKET_PRICE) * BigInt(totalTickets)

    console.log('\nSummary:')
    console.log(`Total Wallets: ${totalWallets}`)
    console.log(`Total Tickets: ${totalTickets}`)
    console.log(`Total Cost: ${Number(totalCost) / 10 ** ERC20_DECIMALS} ${ERC20_SYMBOL}`)

    if (SIMULATION_ONLY === 'true') {
        console.log('\nThis is a simulation only.')
        console.log('Set SIMULATION_ONLY=false in .env to execute actual transactions.')
        return
    }

    const results = []

    // Set Approval for USDC with Megapot contract based on ticket price & total tickets
    const approvalRequest = await client.writeContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, totalCost]
    })

    // Wait for approval transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash: approvalRequest })

    // Verify approval transaction was successful
    if (receipt.status !== 'success') {
        throw new Error('Approval transaction failed')
    }

    // Verify approval
    const allowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account.address, CONTRACT_ADDRESS]
    })

    // Verify approval is enough to purchase all tickets
    if (allowance < totalCost) {
        throw new Error('Approval is not enough')
    }

    for (const entry of entries) {
        try {
            // Simulate transaction first
            await publicClient.simulateContract({
                address: CONTRACT_ADDRESS,
                abi: PURCHASE_TICKETS_ABI,
                functionName: 'purchaseTickets',
                args: [REFERRER_ADDRESS, BigInt(entry.tickets) * BigInt(TICKET_PRICE), entry.address],
                account: account.address,
            })

            // If simulation successful, send the actual transaction
            const hash = await client.writeContract({
                address: CONTRACT_ADDRESS,
                abi: PURCHASE_TICKETS_ABI,
                functionName: 'purchaseTickets',
                args: [REFERRER_ADDRESS, BigInt(entry.tickets) * BigInt(TICKET_PRICE), entry.address],
            })

            // Wait for transaction receipt to get gas usage
            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            results.push({
                address: entry.address,
                tickets: entry.tickets,
                hash: hash,
                gasUsed: receipt.gasUsed,
                effectiveGasPrice: receipt.effectiveGasPrice
            })

            console.log(`Success: Sent ${entry.tickets} tickets to ${entry.address}`)
            console.log(`Transaction: ${hash}`)
            console.log(`Gas Used: ${receipt.gasUsed}`)

        } catch (error) {
            console.error(`Error processing ${entry.address}:`, error)
        }
    }

    // Output final summary
    console.log('\nTransaction Summary:')
    results.forEach(result => {
        console.log(`\nAddress: ${result.address}`)
        console.log(`Tickets: ${result.tickets}`)
        console.log(`TX Hash: ${result.hash}`)
    })

    // Write results to CSV
    const csvContent = results.map(result => `${result.address},${result.tickets},${result.hash},${result.gasUsed},${result.effectiveGasPrice}`).join('\n')
    fs.writeFileSync(OUTPUT_FILE_PATH, csvContent)
}

main().catch(console.error)
