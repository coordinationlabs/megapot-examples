import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { base } from "viem/chains"

import { config } from "./config"

// Create wallet client
const account = privateKeyToAccount(config.PRIVATE_KEY)
const client = createWalletClient({
    account,
    chain: base,
    transport: http()
})

const publicClient = createPublicClient({
    chain: base,
    transport: http()
})

export { account, client, publicClient }

