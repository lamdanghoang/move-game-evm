"use client";

import {
    useAccount,
    useBalance,
    usePublicClient,
    useReadContract,
    useWatchBlocks,
    useWriteContract,
    useWatchContractEvent,
} from "wagmi";
import { SLOT_MACHINE_CONTRACT } from "@/constants/contract";
import { useCallback, useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";

// Type definitions for EVM contract
export interface SpinResult {
    player: string;
    spinId: bigint;
    betAmount: bigint;
    reel1: number;
    reel2: number;
    reel3: number;
    payout: bigint;
    multiplier: bigint;
    isJackpot: boolean;
    winType: string;
    timestamp: bigint;
}

export function useSlotMachineContract() {
    const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimDigest, setClaimDigest] = useState<string | null>(null);

    // 📌 Start a spin (payable)
    const {
        writeContract: startSpin,
        isPending: isSpinning,
        isSuccess,
        error: spinError,
        data: spinData,
    } = useWriteContract();

    const handleStartSpin = (betAmountWei: bigint) => {
        setIsLoading(true);
        startSpin({
            ...SLOT_MACHINE_CONTRACT,
            functionName: "spinAndProcess",
            value: betAmountWei,
            args: [],
        });
    };

    // 📌 Claim all rewards
    const {
        writeContract: claimAll,
        error: claimError,
        data: claimData,
    } = useWriteContract();

    const handleClaimAll = () => {
        setIsClaiming(true);
        claimAll({
            ...SLOT_MACHINE_CONTRACT,
            functionName: "claimAllRewards",
            args: [],
        });
    };

    // Watch for payout calculated events
    useWatchContractEvent({
        ...SLOT_MACHINE_CONTRACT,
        eventName: "PayoutCalculated",
        onLogs(logs) {
            console.log("PayoutCalculated event:", logs);
            if (logs && logs.length > 0) {
                const log = logs[logs.length - 1] as any;
                const result: SpinResult = {
                    player: log.args.player as string,
                    spinId: log.args.spinId as bigint,
                    betAmount: log.args.betAmount as bigint,
                    reel1: Number(log.args.reel1),
                    reel2: Number(log.args.reel2),
                    reel3: Number(log.args.reel3),
                    payout: log.args.payout as bigint,
                    multiplier: log.args.multiplier as bigint,
                    isJackpot: log.args.isJackpot as boolean,
                    winType: log.args.winType as string,
                    timestamp: log.args.timestamp as bigint,
                };
                console.log("Result", result);
                setSpinResult(result);
            }
        },
    });

    // Watch for reward claimed events
    useWatchContractEvent({
        ...SLOT_MACHINE_CONTRACT,
        eventName: "RewardClaimed",
        onLogs(logs) {
            console.log("RewardClaimed event:", logs);
            if (logs && logs.length > 0) {
                const log = logs[logs.length - 1] as any;
                setClaimDigest(log.transactionHash);
            }
        },
    });

    // Reset loading state when spin completes
    useEffect(() => {
        if (isSuccess && !isSpinning) {
            setIsLoading(false);
        }
    }, [isSuccess, isSpinning]);

    // Reset claiming state when claim completes
    useEffect(() => {
        if (claimData && !isClaiming) {
            setIsClaiming(false);
        }
    }, [claimData, isClaiming]);

    return {
        handleStartSpin,
        isSpinning,
        isLoading,
        isSuccess,
        spinError,
        claimError,
        handleClaimAll,
        isClaiming,
        spinResult,
        claimDigest,
    };
}

export function useContractBalance() {
    const publicClient = usePublicClient();
    const [balance, setBalance] = useState<string>("0");

    // Fetch balance from the blockchain
    const fetchBalance = useCallback(async () => {
        if (!publicClient) return;
        try {
            const rawBalance = await publicClient.getBalance({
                address: SLOT_MACHINE_CONTRACT.address,
            });
            setBalance(formatEther(rawBalance));
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        }
    }, [publicClient]);

    // Refetch whenever a new block is mined
    useWatchBlocks({
        onBlock: () => {
            fetchBalance();
        },
    });

    // Initial fetch
    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return {
        balance,
        refetch: fetchBalance,
    };
}

export function useCurrentAccountBalance() {
    const { address } = useAccount();

    const { data, isLoading, refetch } = useBalance({
        address,
    });

    return {
        balance: formatEther(data?.value || BigInt("0")), // BigInt balance in wei
        symbol: data?.symbol,
        isLoading,
        refetch,
    };
}

export interface PendingReward {
    amount: bigint;
    spinId: bigint;
    timestamp: bigint;
    reel1: number;
    reel2: number;
    reel3: number;
    multiplier: bigint;
    isJackpot: boolean;
}

export function usePendingRewards() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        ...SLOT_MACHINE_CONTRACT,
        functionName: "getPendingRewards",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const rewards: PendingReward[] =
        (data as any[])?.map((r) => ({
            amount: r.amount as bigint,
            spinId: r.spinId as bigint,
            timestamp: r.timestamp as bigint,
            reel1: Number(r.reel1),
            reel2: Number(r.reel2),
            reel3: Number(r.reel3),
            multiplier: r.multiplier as bigint,
            isJackpot: r.isJackpot as boolean,
        })) ?? [];

    return {
        rewards,
        isLoading,
        error,
        refetch,
    };
}

export function useTotalPendingRewards() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        ...SLOT_MACHINE_CONTRACT,
        functionName: "getTotalPendingAmount",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const totalPendingRewards = (data as bigint) ?? BigInt(0);

    return {
        totalPendingRewards,
        isLoading,
        error,
        refetch,
    };
}
