import { Address } from "viem";

// Type definitions for the learning contract
export interface ContractConfig {
    address: Address;
    abi: readonly any[];
}

export const SLOT_MACHINE_CONTRACT: ContractConfig = {
    address: "0x3f4B9a4973a18b69880600Fd782B6EbeFe8bcFbc",
    abi: [
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "newBalance",
                    type: "uint256",
                },
            ],
            name: "CasinoFunded",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "betAmount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "reel1",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "reel2",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "reel3",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "payout",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "multiplier",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "isJackpot",
                    type: "bool",
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "winType",
                    type: "string",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
            ],
            name: "PayoutCalculated",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
            ],
            name: "RewardClaimed",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "reel1",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "reel2",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "reel3",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
            ],
            name: "SpinResult",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "betAmount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
            ],
            name: "SpinStarted",
            type: "event",
        },
        {
            inputs: [],
            name: "MAX_BET",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "MIN_BET",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "REWARD_EXPIRY_TIME",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "activeSpins",
            outputs: [
                {
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "betAmount",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
                {
                    internalType: "uint8",
                    name: "reel1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "reel2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "reel3",
                    type: "uint8",
                },
                {
                    internalType: "bool",
                    name: "isProcessed",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "r1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r3",
                    type: "uint8",
                },
                {
                    internalType: "uint256",
                    name: "bet",
                    type: "uint256",
                },
            ],
            name: "calculateDetailedPayout",
            outputs: [
                {
                    internalType: "uint256",
                    name: "payout",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "multiplier",
                    type: "uint256",
                },
                {
                    internalType: "bool",
                    name: "jackpot",
                    type: "bool",
                },
                {
                    internalType: "string",
                    name: "winType",
                    type: "string",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "r1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r3",
                    type: "uint8",
                },
                {
                    internalType: "uint256",
                    name: "bet",
                    type: "uint256",
                },
            ],
            name: "calculatePayout",
            outputs: [
                {
                    internalType: "uint256",
                    name: "payout",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "multiplier",
                    type: "uint256",
                },
                {
                    internalType: "bool",
                    name: "jackpot",
                    type: "bool",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "claimAllRewards",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
            ],
            name: "claimReward",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "r1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r3",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "target",
                    type: "uint8",
                },
            ],
            name: "containsSymbol",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "emergencyShutdown",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "fundCasino",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [],
            name: "getBetLimits",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "getCasinoStats",
            outputs: [
                {
                    internalType: "uint256",
                    name: "balance",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "spins",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "wagered",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "payouts",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "jackpots",
                    type: "uint256",
                },
                {
                    internalType: "bool",
                    name: "active",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "getPayoutTable",
            outputs: [
                {
                    internalType: "uint256[]",
                    name: "",
                    type: "uint256[]",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
            ],
            name: "getPendingRewards",
            outputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "spinId",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "timestamp",
                            type: "uint256",
                        },
                        {
                            internalType: "uint8",
                            name: "reel1",
                            type: "uint8",
                        },
                        {
                            internalType: "uint8",
                            name: "reel2",
                            type: "uint8",
                        },
                        {
                            internalType: "uint8",
                            name: "reel3",
                            type: "uint8",
                        },
                        {
                            internalType: "uint256",
                            name: "multiplier",
                            type: "uint256",
                        },
                        {
                            internalType: "bool",
                            name: "isJackpot",
                            type: "bool",
                        },
                    ],
                    internalType: "struct SlotGame.PendingReward[]",
                    name: "",
                    type: "tuple[]",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "r1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r3",
                    type: "uint8",
                },
            ],
            name: "getSpecialMultiplier",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "symbol",
                    type: "uint8",
                },
            ],
            name: "getSymbolName",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
            ],
            name: "getTotalPendingAmount",
            outputs: [
                {
                    internalType: "uint256",
                    name: "total",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "symbol",
                    type: "uint8",
                },
            ],
            name: "getTripleMultiplier",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "isActive",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "r1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r3",
                    type: "uint8",
                },
            ],
            name: "isJackpotWin",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint8",
                    name: "r1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "r3",
                    type: "uint8",
                },
            ],
            name: "isTripleMatch",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "jackpotHits",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "nextSpinId",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "owner",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "pendingRewards",
            outputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
                {
                    internalType: "uint8",
                    name: "reel1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "reel2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "reel3",
                    type: "uint8",
                },
                {
                    internalType: "uint256",
                    name: "multiplier",
                    type: "uint256",
                },
                {
                    internalType: "bool",
                    name: "isJackpot",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "spinId",
                    type: "uint256",
                },
            ],
            name: "processSpinResult",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "spinAndProcess",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [],
            name: "startSpin",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [],
            name: "toggleCasinoStatus",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "totalPayouts",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "totalSpins",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "totalWagered",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "newOwner",
                    type: "address",
                },
            ],
            name: "transferCasinoOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "withdrawCasinoFunds",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            stateMutability: "payable",
            type: "receive",
        },
    ],
};
