"use client";

import { toSuiU64 } from "@/lib/utils";
import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
} from "@mysten/dapp-kit";
import { SuiEvent, SuiObjectChange } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useEffect, useState } from "react";

// PayoutCalculatedEvent
export type SpinResult = {
    player: string;
    spin_id: string;
    bet_amount: bigint;
    reel1: number;
    reel2: number;
    reel3: number;
    payout: bigint;
    multiplier: string;
    is_jackpot: boolean;
    win_type: string;
    timestamp: string;
} | null;

const PACKAGE_ID =
    "0xd17b93f8caa28fa29075be053911b169cb4317397ee7a29240fde009da00055a";
const MODULE = "slot_machine";
const HOUSE_ID =
    "0x9647f9832090b437f3a6f33705a0785824e0f517d40f70ffc7ba43dd89266f77";

export const useSpinSlot = () => {
    const [digest, setDigest] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [spinResult, setSpinResult] = useState<SpinResult>(null);
    const [objectChanges, setObjectChanges] = useState<SuiObjectChange[]>([]);

    const account = useCurrentAccount();
    const client = useSuiClient();

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
        execute: async ({ bytes, signature }) =>
            await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showRawEffects: true,
                    showObjectChanges: true,
                    showEvents: true,
                },
            }),
    });

    // Function with extensive debugging added
    const spinSlot = useCallback(
        async (betAmount: number) => {
            if (!account) {
                setError(new Error("Wallet not connected"));
                return;
            }

            setIsLoading(true);
            setError(null);
            setSpinResult(null);

            try {
                const amount = toSuiU64(betAmount);
                const txb = new Transaction();

                const [coin] = txb.splitCoins(txb.gas, [
                    txb.pure.u64(amount), // MIST
                ]);

                txb.moveCall({
                    target: `${PACKAGE_ID}::${MODULE}::spin_and_process`,
                    arguments: [
                        txb.object(HOUSE_ID),
                        coin,
                        txb.object.random(),
                        txb.object.clock(),
                    ],
                });

                signAndExecuteTransaction(
                    {
                        transaction: txb,
                    },
                    {
                        onSuccess: (result) => {
                            setDigest(result.digest);
                            console.log(result.digest);
                            setObjectChanges(result.objectChanges || []);
                            const event = getSlotSpinnedEvent(result.events);
                            console.log(event);

                            if (!event) {
                                setError(
                                    new Error("SlotSpinned event not found")
                                );
                            } else {
                                setSpinResult(event);
                            }
                        },
                        onError: (err) => {
                            console.error("❌ Spin failed:", err);
                            setError(err);
                        },
                        onSettled: () => {
                            setIsLoading(false);
                        },
                    }
                );
            } catch (error) {
                console.error("❌ Unexpected error:", error);
                setError(error as Error);
                setIsLoading(false);
            }
        },
        [account]
    );

    return {
        spinSlot,
        spinResult,
        digest,
        objectChanges,
        isLoading,
        error,
    };
};

export const useClaimAllPayout = () => {
    const [digest, setDigest] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const account = useCurrentAccount();

    const { mutate: signAndExecuteTransaction } =
        useSignAndExecuteTransaction();

    // Function with extensive debugging added
    const claimAllPayout = useCallback(async () => {
        if (!account) {
            setError(new Error("Wallet not connected"));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const txb = new Transaction();

            txb.moveCall({
                target: `${PACKAGE_ID}::${MODULE}::claim_all_rewards`,
                arguments: [txb.object(HOUSE_ID), txb.object.clock()],
            });

            signAndExecuteTransaction(
                {
                    transaction: txb,
                },
                {
                    onSuccess: (result) => {
                        setDigest(result.digest);
                        console.log(result.digest);
                    },
                    onError: (err) => {
                        console.error("❌ Claim payout failed:", err);
                        setError(err);
                    },
                    onSettled: () => {
                        setIsLoading(false);
                    },
                }
            );
        } catch (error) {
            console.error("❌ Unexpected error:", error);
            setError(error as Error);
            setIsLoading(false);
        }
    }, [account]);

    return {
        claimAllPayout,
        digest,
        isLoading,
        error,
    };
};

export const useJackpotBalance = () => {
    const client = useSuiClient();
    const [jackpotBalance, setJackpotBalance] = useState<bigint | null>(null);

    const fetchJackpot = async () => {
        try {
            const obj = await client.getObject({
                id: HOUSE_ID,
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

    return { jackpotBalance, refetch: fetchJackpot };
};

export const usePendingReward = () => {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const [pendingAmount, setPendingAmount] = useState<bigint>(BigInt("0"));
    const [lastestWin, setLastestWin] = useState<bigint>(BigInt("0"));

    const fetchPendingReward = async () => {
        if (!account) return;
        try {
            const obj = await client.getObject({
                id: HOUSE_ID,
                options: { showContent: true },
            });

            console.log(obj);

            const fields = (obj.data?.content as any)?.fields;
            const pendingRewardsTableId =
                fields?.pending_rewards?.fields?.id?.id;

            if (!pendingRewardsTableId) {
                throw new Error("Missing pending_rewards table");
            }

            const res = await client.getDynamicFieldObject({
                parentId: pendingRewardsTableId,
                name: {
                    type: "address",
                    value: account.address,
                },
            });

            const rewardVector = (res.data?.content as any)?.fields?.value;
            console.log(rewardVector);

            if (!rewardVector || !Array.isArray(rewardVector)) {
                setPendingAmount(BigInt("0"));
                setLastestWin(BigInt("0"));
                return;
            }

            const latestReward = getLatestReward(rewardVector);
            const lastestWinAmount = latestReward.fields.amount;
            setLastestWin(lastestWinAmount);

            let total = BigInt("0");
            for (const reward of rewardVector) {
                const amountStr = reward.fields.amount;
                total += BigInt(amountStr);
            }
            setPendingAmount(total);
        } catch (err) {
            console.error("Failed to fetch pending reward", err);
        }
    };

    useEffect(() => {
        fetchPendingReward();
    }, [account?.address]);

    return { pendingAmount, lastestWin, refetch: fetchPendingReward };
};

export const useAccountBalance = () => {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const [accountBalance, setAccountBalance] = useState<bigint | null>(null);

    const fetchBalance = async () => {
        if (!account) return 0;

        try {
            const balance = await client.getBalance({
                owner: account.address,
                coinType: "0x2::sui::SUI",
            });
            setAccountBalance(BigInt(balance.totalBalance));
        } catch (err) {
            console.error("Failed to fetch balance", err);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [account?.address]);

    return { accountBalance, refetch: fetchBalance };
};

// Fetch event
function getSlotSpinnedEvent(
    events: SuiEvent[] | undefined | null
): SpinResult {
    for (const e of events ?? []) {
        // Check if it's the correct Move event type
        if (
            typeof e.type === "string" &&
            e.type.includes("::slot_machine::PayoutCalculated") &&
            typeof e.parsedJson === "object" &&
            e.parsedJson !== null
        ) {
            const parsed = e.parsedJson as any;

            return {
                player: parsed.player,
                spin_id: parsed.spin_id,
                bet_amount: BigInt(parsed.bet_amount),
                reel1: parsed.reel1,
                reel2: parsed.reel2,
                reel3: parsed.reel3,
                payout: BigInt(parsed.payout),
                multiplier: parsed.multiplier,
                is_jackpot: parsed.is_jackpot,
                win_type: new TextDecoder().decode(
                    new Uint8Array(parsed.win_type)
                ),
                timestamp: parsed.timestamp,
            };
        }
    }

    return null;
}

function getLatestReward(rewards: any[]) {
    if (!Array.isArray(rewards) || rewards.length === 0) return null;

    return rewards.reduce((latest, reward) => {
        const ts = BigInt(reward.fields.timestamp);
        const latestTs = BigInt(latest.fields.timestamp);
        return ts > latestTs ? reward : latest;
    }, rewards[0]);
}
