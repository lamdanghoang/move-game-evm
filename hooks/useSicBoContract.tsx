"use client";

import {
    useAccount,
    useBalance,
    useReadContract,
    useWriteContract,
    useWatchContractEvent,
} from "wagmi";
import { SICBO_CONTRACT } from "@/constants/contract";
import { useState, useEffect } from "react";
import { formatEther } from "viem";

// Type definitions for the SicBo contract event
export interface BetResult {
    player: string;
    betId: bigint;
    die1: number;
    die2: number;
    die3: number;
    totalSum: number;
    isTriple: boolean;
    payout: bigint;
    timestamp: bigint;
}

export function useSicBoContract() {
    const [betResult, setBetResult] = useState<BetResult | null>(null);
    const [diceValues, setDiceValues] = useState<number[] | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimTxHash, setClaimTxHash] = useState<string | null>(null);

    // Hook for placing a bet
    const { writeContract: placeBet, error: betError, isPending } = useWriteContract({
        mutation: {
            onSuccess: () => setIsRolling(true),
            onError: () => setIsRolling(false),
        },
    });

    // Hook for claiming rewards
    const { writeContract: claimAll, error: claimError } = useWriteContract({
        mutation: {
            onSuccess: (hash) => {
                setIsClaiming(true);
                setClaimTxHash(hash);
            },
            onError: () => setIsClaiming(false),
        },
    });

    const handleBetAndRoll = (betType: number, betAmountWei: bigint) => {
        setBetResult(null);
        setDiceValues(null);
        placeBet({
            ...SICBO_CONTRACT,
            functionName: "placeBetAndRoll",
            value: betAmountWei,
            args: [betType],
        });
    };

    const handleClaimAll = () => {
        claimAll({
            ...SICBO_CONTRACT,
            functionName: "claimAllRewards",
            args: [],
        });
    };

    // Listen for DiceRolled to trigger animation
    useWatchContractEvent({
        ...SICBO_CONTRACT,
        eventName: "DiceRolled",
        onLogs(logs) {
            if (!logs?.length) return;
            const log = logs[logs.length - 1] as any;
            setDiceValues([
                Number(log.args.die1),
                Number(log.args.die2),
                Number(log.args.die3),
            ]);
        },
    });

    // Listen for BetSettled for final result
    useWatchContractEvent({
        ...SICBO_CONTRACT,
        eventName: "BetSettled",
        onLogs(logs) {
            if (!logs?.length) return;
            const log = logs[logs.length - 1] as any;
            const result: BetResult = {
                player: log.args.player,
                betId: log.args.betId,
                die1: Number(log.args.die1),
                die2: Number(log.args.die2),
                die3: Number(log.args.die3),
                totalSum: Number(log.args.totalSum),
                isTriple: log.args.isTriple,
                payout: log.args.payout,
                timestamp: log.args.timestamp,
            };
            setBetResult(result);
            setIsRolling(false);
        },
    });

    // Listen for RewardClaimed to confirm claim
    useWatchContractEvent({
        ...SICBO_CONTRACT,
        eventName: "RewardClaimed",
        onLogs(logs) {
            if (!logs?.length) return;
            // Check if the claim transaction hash matches
            const relevantLog = logs.find(log => log.transactionHash === claimTxHash);
            if (relevantLog) {
                setIsClaiming(false);
                setClaimTxHash(null);
            }
        },
    });

    return {
        handleBetAndRoll,
        isRolling: isRolling || isPending,
        diceValues,
        betResult,
        betError,
        handleClaimAll,
        isClaiming,
        claimError,
        claimTxHash,
    };
}

export function useSicBoPendingRewards() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        ...SICBO_CONTRACT,
        functionName: "getTotalPendingAmount",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            select: (data) => data as bigint,
        },
    });

    return {
        pendingRewards: data ?? BigInt(0),
        isLoading,
        error,
        refetch,
    };
}

export function useCurrentAccountBalance() {
    const { address } = useAccount();

    const { data, isLoading, refetch } = useBalance({
        address,
    });

    return {
        balance: data?.value ?? BigInt(0),
        symbol: data?.symbol,
        isLoading,
        refetch,
    };
}

