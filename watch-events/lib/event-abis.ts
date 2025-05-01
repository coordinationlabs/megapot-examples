import { parseAbi } from "viem";

export const UserTicketPurchaseEventAbi = parseAbi([
    'event UserTicketPurchase(address indexed recipient, uint256 ticketsPurchasedTotalBps, address indexed referrer, address indexed buyer)'
]);

export const EntropyResultEventAbi = parseAbi([
    'event EntropyResult(uint64 sequenceNumber, bytes32 randomNumber)'
]);

export const JackpotRunEventAbi = parseAbi([
    'event JackpotRun(uint256 time, address winner, uint256 winningTicket, uint256 winAmount, uint256 ticketsPurchasedTotalBps)'
]);

export const JackpotRunRequestedEventAbi = parseAbi([
    'event JackpotRunRequested(address indexed user)'
]);

export const LpDepositEventAbi = parseAbi([
    'event LpDeposit(address indexed lpAddress, uint256 amount, uint256 riskPercentage)'
]);

export const LpPrincipalWithdrawalEventAbi = parseAbi([
    'event LpPrincipalWithdrawal(address indexed lpAddress, uint256 principalAmount)'
]);

export const LpRebalanceEventAbi = parseAbi([
    'event LpRebalance(address indexed lpAddress, uint256 principal, uint256 stake)'
]);

export const LpRiskPercentageAdjustmentEventAbi = parseAbi([
    'event LpRiskPercentageAdjustment(address indexed lpAddress, uint256 riskPercentage)'
]);

export const LpStakeWithdrawalEventAbi = parseAbi([
    'event LpStakeWithdrawal(address indexed lpAddress)'
]);

export const ProtocolFeeWithdrawalEventAbi = parseAbi([
    'event ProtocolFeeWithdrawal(uint256 amount)'
]);

export const UserReferralFeeWithdrawalEventAbi = parseAbi([
    'event UserReferralFeeWithdrawal(address indexed user, uint256 amount)'
]);

export const UserWinWithdrawalEventAbi = parseAbi([
    'event UserWinWithdrawal(address indexed user, uint256 amount)'
]);

// Standard events
export const InitializedEventAbi = parseAbi([
    'event Initialized(uint64 version)'
]);

export const OwnershipTransferStartedEventAbi = parseAbi([
    'event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner)'
]);

export const OwnershipTransferredEventAbi = parseAbi([
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)'
]);

export const UpgradedEventAbi = parseAbi([
    'event Upgraded(address indexed implementation)'
]);