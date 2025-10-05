"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTipping } from "@/hooks/useTipping";
import { FaGift } from "react-icons/fa";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";

export function Tipping() {
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [showTipping, setShowTipping] = useState(false);
    const { handleTip, isTipping, tipDigest, tipError } = useTipping();

    const onTip = () => {
        handleTip(toAddress, amount);
    };

    return (
        <main className="fixed bottom-4 right-4">
            {showTipping ? (
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Tip</CardTitle>
                        <CardDescription>
                            Send a tip to another player.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="toAddress">To Address</Label>
                                <Input
                                    id="toAddress"
                                    placeholder="0x..."
                                    value={toAddress}
                                    onChange={(e) =>
                                        setToAddress(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="amount">Amount (ETH)</Label>
                                <Input
                                    id="amount"
                                    placeholder="0.1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            {tipDigest && (
                                <div className="text-sm text-green-500">
                                    Tipped successfully! Txn:{" "}
                                    <Link
                                        target="_blank"
                                        href={`https://sepolia.etherscan.io/tx/${tipDigest}`}
                                    >
                                        {shortenAddress(tipDigest)}
                                    </Link>
                                </div>
                            )}
                            {tipError && (
                                <div className="text-sm text-red-500">
                                    {tipError.message}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            className="hover:bg-gray-800 hover:text-white"
                            onClick={() => setShowTipping(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={onTip} disabled={isTipping}>
                            {isTipping ? "Tipping..." : "Confirm"}
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    onClick={() => setShowTipping(true)}
                    className="animate-pulse rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105 animate-twinkle"
                >
                    <FaGift className="mr-2" />
                    TIP
                </Button>
            )}
        </main>
    );
}
