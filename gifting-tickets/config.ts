import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

interface EnvConfig {
    PRIVATE_KEY: `0x${string}`
    CONTRACT_ADDRESS: `0x${string}`
    ERC20_ADDRESS: `0x${string}`
    TICKET_PRICE: string
    REFERRER_ADDRESS: `0x${string}`
    ERC20_DECIMALS: number
    ERC20_SYMBOL: string
    INPUT_FILE_PATH: string
    OUTPUT_FILE_PATH: string
    SIMULATION_ONLY?: string
}

function validateAddress(address: string, label: string) {
    if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
        throw new Error(`${label} is not a valid Ethereum address`)
    }
}

function validateConfig(): EnvConfig {
    const requiredVars = [
        'PRIVATE_KEY',
        'CONTRACT_ADDRESS',
        'ERC20_ADDRESS',
        'TICKET_PRICE',
        'REFERRER_ADDRESS',
        'ERC20_DECIMALS',
        'ERC20_SYMBOL',
        'INPUT_FILE_PATH',
        'OUTPUT_FILE_PATH'
    ]

    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`)
        }
    }

    // Validate private key
    if (!process.env.PRIVATE_KEY!.match(/^0x[0-9a-fA-F]{64}$/)) {
        throw new Error('PRIVATE_KEY is not a valid Ethereum private key')
    }

    // Validate addresses
    validateAddress(process.env.CONTRACT_ADDRESS!, 'CONTRACT_ADDRESS')
    validateAddress(process.env.ERC20_ADDRESS!, 'ERC20_ADDRESS')
    validateAddress(process.env.REFERRER_ADDRESS!, 'REFERRER_ADDRESS')

    // Validate numbers
    if (isNaN(Number(process.env.TICKET_PRICE))) {
        throw new Error('TICKET_PRICE is not a valid number')
    }
    if (isNaN(Number(process.env.ERC20_DECIMALS))) {
        throw new Error('ERC20_DECIMALS is not a valid number')
    }

    return {
        PRIVATE_KEY: process.env.PRIVATE_KEY as `0x${string}`,
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS as `0x${string}`,
        ERC20_ADDRESS: process.env.ERC20_ADDRESS as `0x${string}`,
        TICKET_PRICE: process.env.TICKET_PRICE as string,
        REFERRER_ADDRESS: process.env.REFERRER_ADDRESS as `0x${string}`,
        ERC20_DECIMALS: Number(process.env.ERC20_DECIMALS),
        ERC20_SYMBOL: process.env.ERC20_SYMBOL!,
        INPUT_FILE_PATH: process.env.INPUT_FILE_PATH!,
        OUTPUT_FILE_PATH: process.env.OUTPUT_FILE_PATH!,
        SIMULATION_ONLY: process.env.SIMULATION_ONLY
    }
}

export const config = validateConfig() 