import { Alchemy, Network } from 'alchemy-sdk';
import dotenv from 'dotenv';
import { decodeEventLog, encodeEventTopics } from 'viem';

// Import the event ABIs that you want to watch
import { JackpotRunEventAbi, LpDepositEventAbi, UserTicketPurchaseEventAbi } from './lib/event-abis';

// Load environment variables
dotenv.config();

// Configure Alchemy settings
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.BASE_MAINNET,
};

// Initialize Alchemy client
const alchemy = new Alchemy(settings);

// Define the contract address that you want to watch
const contractAddress = '0xbEDd4F2beBE9E3E636161E644759f3cbe3d51B95'; // Megapot Base Mainnet Contract

// Define the filter for the UserTicketPurchase event
const userTicketPurchaseFilter = {
    address: contractAddress,
    topics: encodeEventTopics({
        abi: UserTicketPurchaseEventAbi,
        eventName: 'UserTicketPurchase',
    })
};

// Listen for the UserTicketPurchase event
alchemy.ws.on(userTicketPurchaseFilter, (log, event) => {
    const ticketPurchase = decodeEventLog({
        abi: UserTicketPurchaseEventAbi,
        data: log.data,
        topics: log.topics,
    });
    console.log(ticketPurchase);
    // {
    //     eventName: 'UserTicketPurchase',
    //     args: {
    //         recipient: '0x0F206CED2F276514E2C73D78294028EBaeE27D66',
    //         referrer: '0x0000000000000000000000000000000000000000',
    //         buyer: '0x0F206CED2F276514E2C73D78294028EBaeE27D66',
    //         ticketsPurchasedTotalBps: 350000n
    //     }
    // }
});

// Define the filter for the LpDeposit event
const lpDepositEventFilter = {
    address: contractAddress,
    topics: encodeEventTopics({
        abi: LpDepositEventAbi,
        eventName: 'LpDeposit',
    })
};

// Listen for the LpDeposit event
alchemy.ws.on(lpDepositEventFilter, (log, event) => {
    const lpDeposit = decodeEventLog({
        abi: LpDepositEventAbi,
        data: log.data,
        topics: log.topics,
    });
    console.log(lpDeposit);
    // {
    //     eventName: 'LpDeposit',
    //     args: {
    //         lpAddress: '0x2a5f9443719899537Fa51f5061cBA8c8096719d2',
    //         amount: 1000000n,
    //         riskPercentage: 50n
    //     }
    // }
});

// Define the filter for the JackpotRun event
const runJackpotEventFilter = {
    address: contractAddress,
    topics: encodeEventTopics({
        abi: JackpotRunEventAbi,
        eventName: 'JackpotRun',
    })
};

// Listen for the JackpotRun event
alchemy.ws.on(runJackpotEventFilter, (log, event) => {
    const runJackpot = decodeEventLog({
        abi: JackpotRunEventAbi,
        data: log.data,
        topics: log.topics,
    });
    console.log(runJackpot);
    // {
    //     eventName: 'JackpotRun',
    //     args: {
    //         time: 1746119457n,
    //         winner: '0x0000000000000000000000000000000000000000',
    //         winningTicket: 4584644434n,
    //         winAmount: 508275147158n,
    //         ticketsPurchasedTotalBps: 0n
    //     }
    // }
});
