"use client";
import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
} from "@mysten/dapp-kit";
import { SuiEvent, SuiObjectChange } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useEffect, useState } from "react";

const PACKAGE_ID =
    "0xfc3ba8afd758a5ae4298eb8ae80069831e4d1536b4cf70925b7b843dd39f264d";
const MODULE = "slot_machine";
const FUNCTION = "spin_slots";
const CASINO_ID =
    "0x4b0f90c39cc7de9a6f5327590195d6b6d2ee0d347a37e795488841c8b8d56b21";

// Helper function to get the full module ID

type SpinResult = {
    reel1: string;
    reel2: string;
    reel3: string;
    payout: string;
    multiplier: string;
    is_jackpot: boolean;
} | null;

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
                    target: `${PACKAGE_ID}::${MODULE}::${FUNCTION}`,
                    arguments: [
                        txb.object(CASINO_ID),
                        coin,
                        txb.object.random(),
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
                            console.log(result.events);

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

export const useJackpotBalance = () => {
    const suiClient = useSuiClient();
    const [jackpotBalance, setJackpotBalance] = useState<bigint | null>(null);

    const fetchJackpot = async () => {
        try {
            const obj = await suiClient.getObject({
                id: CASINO_ID,
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

// Helper
function getSlotSpinnedEvent(
    events: SuiEvent[] | undefined | null
): SpinResult {
    for (const e of events ?? []) {
        // Check if it's the correct Move event type
        if (
            typeof e.type === "string" &&
            e.type.includes("::slot_machine::SlotSpinned") &&
            typeof e.parsedJson === "object" &&
            e.parsedJson !== null
        ) {
            const parsed = e.parsedJson as any;

            return {
                reel1: parsed.reel1.toString(),
                reel2: parsed.reel2.toString(),
                reel3: parsed.reel3.toString(),
                payout: parsed.payout,
                multiplier: parsed.multiplier,
                is_jackpot: parsed.is_jackpot,
            };
        }
    }

    return null;
}
// Safer formatting functions
export function toSuiU64(amount: number): string {
    if (isNaN(amount) || amount < 0) {
        throw new Error(`Invalid SUI amount: ${amount}`);
    }

    try {
        const scaled = BigInt(Math.floor(amount * 1e9));
        return scaled.toString();
    } catch (error) {
        throw new Error(`Error converting ${amount} to SUI U64:`);
    }
}

export function fromSuiU64(u64BigInt: bigint): number {
    try {
        const result = Number(u64BigInt) / 1e9;
        return result;
    } catch (error) {
        throw new Error(`Error converting ${u64BigInt} from SUI U64:`);
    }
}
