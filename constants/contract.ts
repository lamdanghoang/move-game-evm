import { Address } from "viem";

// Type definitions for the learning contract
export interface ContractConfig {
    address: Address;
    abi: readonly any[];
}

export const SLOT_MACHINE_CONTRACT: ContractConfig = {
    address: "0xB5Fc10cc126A969762f88b9F13ae96C788B079Cf",
    abi: [],
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
