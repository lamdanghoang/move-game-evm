// hooks/useSlotMachine.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Transaction } from "@mysten/sui/transactions";
import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
} from "@mysten/dapp-kit";
import { toSuiU64 } from "@/lib/utils";

// Types
interface SpinStartedEvent {
    player: string;
    spin_id: string;
    bet_amount: string;
    timestamp: string;
}

interface SpinResultEvent {
    player: string;
    spin_id: string;
    reel1: number;
    reel2: number;
    reel3: number;
    timestamp: string;
}

interface PayoutCalculatedEvent {
    player: string;
    spin_id: string;
    bet_amount: string;
    reel1: number;
    reel2: number;
    reel3: number;
    payout: string;
    multiplier: string;
    is_jackpot: boolean;
    win_type: number[];
    timestamp: string;
}

interface PendingReward {
    spinId: string;
    amount: string;
    timestamp: number;
    reel1: number;
    reel2: number;
    reel3: number;
    multiplier: string;
    isJackpot: boolean;
}

interface GameState {
    phase: "idle" | "spinning" | "showing_result" | "showing_payout";
    currentSpinId: string | null;
    reels: [number, number, number];
    lastResult: {
        payout: string;
        multiplier: string;
        isJackpot: boolean;
        winType: string;
    } | null;
    pendingRewards: PendingReward[];
}

const packageId =
    "0x342f9a63827d4b34f29ed1077d08fcc82915b6abc8750e414e6a2850641e09e5";
const casinoObjectId =
    "0x26112590c73cac13ee88754cae96333d9b7922d4f79911d866da85dcd1dfb92f";

export function useSlotMachine() {
    const suiClient = useSuiClient();
    const currentWallet = useCurrentAccount();
    const { mutate: signAndExecuteTransactionBlock } =
        useSignAndExecuteTransaction({
            execute: async ({ bytes, signature }) =>
                await suiClient.executeTransactionBlock({
                    transactionBlock: bytes,
                    signature,
                    options: {
                        showRawEffects: true,
                        showObjectChanges: true,
                        showEvents: true,
                    },
                }),
        });

    const [gameState, setGameState] = useState<GameState>({
        phase: "idle",
        currentSpinId: null,
        reels: [0, 0, 0],
        lastResult: null,
        pendingRewards: [],
    });

    const [isSpinning, setIsSpinning] = useState([false, false, false]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Event subscriptions refs
    const subscriptionsRef = useRef<Array<() => void>>([]);

    // Animation timeouts refs
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    // Clear all timeouts
    const clearAllTimeouts = useCallback(() => {
        timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        timeoutsRef.current = [];
    }, []);

    // Setup event listeners for spin_and_process
    useEffect(() => {
        if (!currentWallet?.address || !suiClient) return;

        const setupEventPolling = () => {
            if (!currentWallet?.address || !suiClient) return;

            const seenSpinIds = new Set<string>();
            const pollingInterval = 3000; // every 3s
            let intervalId: NodeJS.Timeout;

            const poll = async () => {
                try {
                    const result = await suiClient.queryEvents({
                        query: {
                            MoveEventType: `${packageId}::slot_machine::PayoutCalculated`,
                        },
                        limit: 20,
                        order: "descending",
                    });

                    for (const event of result.data) {
                        const data = event.parsedJson as PayoutCalculatedEvent;
                        if (!data || data.player !== currentWallet.address)
                            continue;
                        if (seenSpinIds.has(data.spin_id)) continue;

                        // Mark as seen
                        seenSpinIds.add(data.spin_id);

                        // Simulate the 3 steps from 3 listeners
                        handleSpinStarted({
                            player: data.player,
                            spin_id: data.spin_id,
                            bet_amount: data.bet_amount,
                            timestamp: data.timestamp,
                        });

                        handleSpinResult({
                            player: data.player,
                            spin_id: data.spin_id,
                            reel1: data.reel1,
                            reel2: data.reel2,
                            reel3: data.reel3,
                            timestamp: data.timestamp,
                        });

                        handlePayoutCalculated(data);
                    }
                } catch (error) {
                    console.error("Polling failed:", error);
                    setError("Failed to poll events");
                }
            };

            intervalId = setInterval(poll, pollingInterval);
            poll(); // trigger once immediately

            // Store cleanup function
            subscriptionsRef.current = [() => clearInterval(intervalId)];
        };

        setupEventPolling();

        // Cleanup on unmount
        return () => {
            subscriptionsRef.current.forEach((unsub) => unsub());
            clearAllTimeouts();
        };
    }, [currentWallet]);

    // Handle SpinStarted event
    const handleSpinStarted = useCallback((event: SpinStartedEvent) => {
        console.log("SpinStarted event received:", event);

        setGameState((prev) => ({
            ...prev,
            phase: "spinning",
            currentSpinId: event.spin_id,
        }));

        // Start reel spinning animation
        setIsSpinning([true, true, true]);

        // Show random symbols during spin for visual effect
        const randomInterval = setInterval(() => {
            setGameState((prev) => ({
                ...prev,
                reels: [
                    Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 10),
                ],
            }));
        }, 100);

        // Clear random animation after 1.5 seconds
        const timeout = setTimeout(() => {
            clearInterval(randomInterval);
        }, 1500);

        timeoutsRef.current.push(timeout);
    }, []);

    // Handle SpinResult event
    const handleSpinResult = useCallback((event: SpinResultEvent) => {
        console.log("SpinResult event received:", event);

        // Stop spinning animation and show final result after delay
        const timeout = setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                phase: "showing_result",
                reels: [event.reel1, event.reel2, event.reel3],
            }));

            setIsSpinning([false, false, false]);
        }, 1500); // Wait for spin animation to complete

        timeoutsRef.current.push(timeout);
    }, []);

    // Handle PayoutCalculated event
    const handlePayoutCalculated = useCallback(
        (event: PayoutCalculatedEvent) => {
            console.log("PayoutCalculated event received:", event);

            const winType = new TextDecoder().decode(
                new Uint8Array(event.win_type)
            );

            setGameState((prev) => ({
                ...prev,
                phase: "showing_payout",
                lastResult: {
                    payout: event.payout,
                    multiplier: event.multiplier,
                    isJackpot: event.is_jackpot,
                    winType,
                },
                // Add to pending rewards if won
                pendingRewards:
                    event.payout !== "0"
                        ? [
                              ...prev.pendingRewards,
                              {
                                  spinId: event.spin_id,
                                  amount: event.payout,
                                  timestamp: Date.now(),
                                  reel1: event.reel1,
                                  reel2: event.reel2,
                                  reel3: event.reel3,
                                  multiplier: event.multiplier,
                                  isJackpot: event.is_jackpot,
                              },
                          ]
                        : prev.pendingRewards,
            }));

            // Return to idle after showing payout
            const timeout = setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    phase: "idle",
                    currentSpinId: null,
                }));
            }, 3000);

            timeoutsRef.current.push(timeout);
        },
        []
    );

    // Main spin function using spin_and_process
    const spin = useCallback(
        async (betAmount: string) => {
            if (!currentWallet || !signAndExecuteTransactionBlock) {
                setError("Wallet not connected");
                return;
            }

            if (gameState.phase !== "idle") {
                setError("Game is already running");
                return;
            }

            setLoading(true);
            setError(null);
            clearAllTimeouts();

            try {
                const tx = new Transaction();

                const amount = toSuiU64(+betAmount);

                // Create coin for bet
                const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);

                // Call spin_and_process function
                tx.moveCall({
                    target: `${packageId}::slot_machine::spin_and_process`,
                    arguments: [
                        tx.object(casinoObjectId),
                        coin,
                        tx.object("0x8"), // Random object
                        tx.object("0x6"), // Clock object
                    ],
                });

                const result = await signAndExecuteTransactionBlock({
                    transaction: tx,
                });

                console.log("Spin transaction completed:", result);

                // Events will be handled by the event listeners above
                // No need to manually trigger state changes here
            } catch (error) {
                console.error("Spin failed:", error);
                setError(
                    error instanceof Error ? error.message : "Spin failed"
                );

                // Reset game state on error
                setGameState((prev) => ({
                    ...prev,
                    phase: "idle",
                    currentSpinId: null,
                }));
                setIsSpinning([false, false, false]);
            } finally {
                setLoading(false);
            }
        },
        [currentWallet, gameState.phase]
    );

    // Claim individual reward
    const claimReward = useCallback(
        async (spinId: string) => {
            if (!currentWallet || !signAndExecuteTransactionBlock) {
                setError("Wallet not connected");
                return;
            }

            try {
                const tx = new Transaction();

                tx.moveCall({
                    target: `${packageId}::slot_machine::claim_reward`,
                    arguments: [
                        tx.object(casinoObjectId),
                        tx.pure.u64(spinId),
                        tx.object("0x6"), // Clock object
                    ],
                });

                const result = await signAndExecuteTransactionBlock({
                    transaction: tx,
                });

                console.log("Claim reward completed:", result);

                // Remove claimed reward and update balance
                const claimedReward = gameState.pendingRewards.find(
                    (r) => r.spinId === spinId
                );
                if (claimedReward) {
                    setGameState((prev) => ({
                        ...prev,
                        pendingRewards: prev.pendingRewards.filter(
                            (r) => r.spinId !== spinId
                        ),
                    }));
                }
            } catch (error) {
                console.error("Claim reward failed:", error);
                setError(
                    error instanceof Error ? error.message : "Claim failed"
                );
            }
        },
        [currentWallet, gameState.pendingRewards]
    );

    // Claim all rewards
    const claimAllRewards = useCallback(async () => {
        if (!currentWallet || !signAndExecuteTransactionBlock) {
            setError("Wallet not connected");
            return;
        }

        if (gameState.pendingRewards.length === 0) return;

        try {
            const tx = new Transaction();

            tx.moveCall({
                target: `${packageId}::slot_machine::claim_all_rewards`,
                arguments: [
                    tx.object(casinoObjectId),
                    tx.object("0x6"), // Clock object
                ],
            });

            const result = await signAndExecuteTransactionBlock({
                transaction: tx,
            });

            console.log("Claim all rewards completed:", result);

            // Update state

            setGameState((prev) => ({
                ...prev,
                pendingRewards: [],
            }));
        } catch (error) {
            console.error("Claim all rewards failed:", error);
            setError(
                error instanceof Error ? error.message : "Claim all failed"
            );
        }
    }, [currentWallet, gameState.pendingRewards]);

    // Get current balance from blockchain
    const refreshBalance = useCallback(async () => {
        if (!currentWallet?.address || !suiClient) return;

        try {
            const coins = await suiClient.getCoins({
                owner: currentWallet.address,
                coinType: "0x2::sui::SUI",
            });

            const totalBalance = coins.data.reduce(
                (sum, coin) => sum + BigInt(coin.balance),
                BigInt(0)
            );

            setGameState((prev) => ({
                ...prev,
                balance: totalBalance.toString(),
            }));
        } catch (error) {
            console.error("Failed to refresh balance:", error);
        }
    }, [currentWallet?.address, suiClient]);

    // Auto-refresh balance on mount
    useEffect(() => {
        refreshBalance();
    }, [refreshBalance]);

    return {
        // Game state
        gameState,
        isSpinning,
        loading,
        error,

        // Actions
        spin,
        claimReward,
        claimAllRewards,
        refreshBalance,

        // Utilities
        clearError: () => setError(null),
        canSpin: gameState.phase === "idle" && !loading && !!currentWallet,
    };
}

export const useJackpotBalance = () => {
    const suiClient = useSuiClient();
    const [jackpotBalance, setJackpotBalance] = useState<bigint | null>(null);

    const fetchJackpot = async () => {
        try {
            const obj = await suiClient.getObject({
                id: casinoObjectId,
                options: {
                    showContent: true,
                },
            });

            const content = obj.data?.content;
            if (
                content &&
                content.dataType === "moveObject" &&
                "fields" in content
            ) {
                const fields = content.fields as Record<string, any>;
                const pool = fields.balance; // balance in MIST
                setJackpotBalance(pool);
            }
        } catch (err) {
            console.error("Failed to fetch jackpot", err);
        }
    };

    useEffect(() => {
        fetchJackpot();
    }, []);

    return jackpotBalance;
};
