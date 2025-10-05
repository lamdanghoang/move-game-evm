import { Address } from "viem";

// Type definitions for the learning contract
export interface ContractConfig {
    address: Address;
    abi: readonly any[];
}

export const SLOT_MACHINE_CONTRACT: ContractConfig = {
    address: "0xB5Fc10cc126A969762f88b9F13ae96C788B079Cf",
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
            name: "HOUSE_EDGE",
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
            name: "HOUSE_EDGE_DIVISOR",
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
            name: "MIN_SPIN_INTERVAL",
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
                    name: "rewardIndex",
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
            inputs: [
                {
                    internalType: "uint8",
                    name: "symbol",
                    type: "uint8",
                },
            ],
            name: "getDoubleMultiplier",
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
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
            ],
            name: "getPlayerStats",
            outputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "totalSpins",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "totalWagered",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "totalWon",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "biggestWin",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "lastPlayTime",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct SlotGame.PlayerStats",
                    name: "",
                    type: "tuple",
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
            name: "isDoubleMatch",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
                {
                    internalType: "uint8",
                    name: "",
                    type: "uint8",
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
            inputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            name: "lastSpinTime",
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
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            name: "playerStats",
            outputs: [
                {
                    internalType: "uint256",
                    name: "totalSpins",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "totalWagered",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "totalWon",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "biggestWin",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "lastPlayTime",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
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

export const SICBO_CONTRACT: ContractConfig = {
    address: "0x88533262A4e22836C729086Af072176587516361",
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
                    indexed: true,
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "betId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "enum SicBo.BetType",
                    name: "betType",
                    type: "uint8",
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
            name: "BetPlaced",
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
                    indexed: true,
                    internalType: "uint256",
                    name: "betId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "die1",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "die2",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "die3",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "totalSum",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "isTriple",
                    type: "bool",
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
                    name: "timestamp",
                    type: "uint256",
                },
            ],
            name: "BetSettled",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "funder",
                    type: "address",
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
                    internalType: "uint256",
                    name: "betId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "die1",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "die2",
                    type: "uint8",
                },
                {
                    indexed: false,
                    internalType: "uint8",
                    name: "die3",
                    type: "uint8",
                },
            ],
            name: "DiceRolled",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "FundsWithdrawn",
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
                    name: "betId",
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
                    name: "rewardIndex",
                    type: "uint256",
                },
            ],
            name: "claimReward",
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
            name: "getGameConfig",
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
                            name: "betId",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "timestamp",
                            type: "uint256",
                        },
                        {
                            internalType: "uint8",
                            name: "die1",
                            type: "uint8",
                        },
                        {
                            internalType: "uint8",
                            name: "die2",
                            type: "uint8",
                        },
                        {
                            internalType: "uint8",
                            name: "die3",
                            type: "uint8",
                        },
                        {
                            internalType: "uint8",
                            name: "totalSum",
                            type: "uint8",
                        },
                        {
                            internalType: "enum SicBo.BetType",
                            name: "betType",
                            type: "uint8",
                        },
                    ],
                    internalType: "struct SicBo.PendingReward[]",
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
            inputs: [],
            name: "isGameActive",
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
            inputs: [],
            name: "maxBet",
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
            name: "minBet",
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
                    name: "betId",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                },
                {
                    internalType: "uint8",
                    name: "die1",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "die2",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "die3",
                    type: "uint8",
                },
                {
                    internalType: "uint8",
                    name: "totalSum",
                    type: "uint8",
                },
                {
                    internalType: "enum SicBo.BetType",
                    name: "betType",
                    type: "uint8",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "enum SicBo.BetType",
                    name: "betType",
                    type: "uint8",
                },
            ],
            name: "placeBetAndRoll",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_minBet",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_maxBet",
                    type: "uint256",
                },
            ],
            name: "setBetLimits",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "toggleGameActive",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "totalBets",
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
            inputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "withdrawFunds",
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
