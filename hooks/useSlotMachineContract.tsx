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
    const [isSpinning, setIsSpinning] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimDigest, setClaimDigest] = useState<string | null>(null);

    /** ===================== SPIN LOGIC ===================== **/
    const { writeContract: startSpin, error: spinError } = useWriteContract({
        mutation: {
            onError: () => setIsSpinning(false),
        },
    });

    const handleStartSpin = (betAmountWei: bigint) => {
        setIsSpinning(true);
        startSpin({
            ...SLOT_MACHINE_CONTRACT,
            functionName: "spinAndProcess",
            value: betAmountWei,
            args: [],
        });
    };

    // Listen for PayoutCalculated (end of spin)
    useWatchContractEvent({
        ...SLOT_MACHINE_CONTRACT,
        eventName: "PayoutCalculated",
        onLogs(logs) {
            if (!logs?.length) return;
            const log = logs[logs.length - 1] as any;
            const result: SpinResult = {
                player: log.args.player,
                spinId: log.args.spinId,
                betAmount: log.args.betAmount,
                reel1: Number(log.args.reel1),
                reel2: Number(log.args.reel2),
                reel3: Number(log.args.reel3),
                payout: log.args.payout,
                multiplier: log.args.multiplier,
                isJackpot: log.args.isJackpot,
                winType: log.args.winType,
                timestamp: log.args.timestamp,
            };
            setSpinResult(result);
            setIsSpinning(false);
        },
    });

    /** ===================== CLAIM LOGIC ===================== **/
    const { writeContract: claimAll, error: claimError } = useWriteContract({
        mutation: {
            onError: () => setIsClaiming(false),
        },
    });

    const handleClaimAll = () => {
        setIsClaiming(true);
        claimAll({
            ...SLOT_MACHINE_CONTRACT,
            functionName: "claimAllRewards",
            args: [],
        });
    };

    // Listen for RewardClaimed (end of claim)
    useWatchContractEvent({
        ...SLOT_MACHINE_CONTRACT,
        eventName: "RewardClaimed",
        onLogs(logs) {
            if (!logs?.length) return;
            const log = logs[logs.length - 1] as any;
            setClaimDigest(log.transactionHash);
            setIsClaiming(false);
        },
    });

    return {
        handleStartSpin,
        isSpinning,
        spinResult,
        spinError,
        handleClaimAll,
        isClaiming,
        claimDigest,
        claimError,
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
