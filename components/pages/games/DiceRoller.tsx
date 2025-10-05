"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import Dice, { type DiceRef } from "@/components/games/dice/dice";
import {
    useSicBoContract,
    useSicBoPendingRewards,
    useCurrentAccountBalance,
    type BetResult,
} from "@/hooks/useSicBoContract";
import { parseEther, formatEther } from "viem";
import { useAccount } from "wagmi";

// Choice
const choices = [
    {
        label: (
            <>
                <span className="font-bold text-xl">Big</span>
                <br />
                <span>(11-17)</span>
            </>
        ),
        value: 1, // Corresponds to BetType.Big
    },
    {
        label: (
            <>
                <span className="font-bold text-xl">Small</span>
                <br />
                <span>(4-10)</span>
            </>
        ),
        value: 0, // Corresponds to BetType.Small
    },
];

// Bet amounts in ETH
const betAmounts = [0.01, 0.05, 0.1, 0.25];

const DiceRoller = () => {
    const { address } = useAccount();
    const [selectedChoice, setSelectedChoice] = useState<number>(1); // Default to Big
    const [selectedAmount, setSelectedAmount] = useState<number>(0.01);
    const [diceValues, setDiceValues] = useState<number[]>([1, 1, 1]);
    const [gameMessage, setGameMessage] = useState<string>("");

    const {
        handleBetAndRoll,
        isRolling,
        diceValues: contractDiceValues, // For early animation
        betResult, // For final result
        betError,
        handleClaimAll,
        isClaiming,
        claimTxHash,
    } = useSicBoContract();

    const { balance, refetch: refetchBalance } = useCurrentAccountBalance();
    const { pendingRewards, refetch: refetchPending } = useSicBoPendingRewards();

    const handleBetClick = () => {
        setGameMessage("");
        handleBetAndRoll(selectedChoice, parseEther(`${selectedAmount}`));
    };

    // Effect to trigger dice animation as soon as DiceRolled event is received
    useEffect(() => {
        if (contractDiceValues) {
            setDiceValues(contractDiceValues);
        }
    }, [contractDiceValues]);

    // Effect to show final result message when BetSettled event is received
    useEffect(() => {
        if (betResult && betResult.player === address) {
            // Set game message based on result
            if (betResult.isTriple) {
                setGameMessage(`🎲 Triple ${betResult.die1}s! House wins. 🎲`);
            } else if (betResult.payout > 0) {
                setGameMessage(
                    `🎉 You won! Rolled ${betResult.totalSum}. Reward of ${formatEther(
                        betResult.payout
                    )} ETH is pending.`
                );
            } else {
                setGameMessage(`❌ You lost. Rolled ${betResult.totalSum}.`);
            }
            // Refetch pending rewards after a bet is settled
            refetchPending();
        }
    }, [betResult, address, refetchPending]);

    // Effect to refetch data after a claim is processed
    useEffect(() => {
        if (!isClaiming && claimTxHash) {
            refetchBalance();
            refetchPending();
        }
    }, [isClaiming, claimTxHash, refetchBalance, refetchPending]);

    useEffect(() => {
        if (betError) {
            setGameMessage(`Error: ${betError.message}`);
        }
    }, [betError]);

    return (
        <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-3 p-4 items-start justify-items-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Left Side Panel */}
            <div className="px-6 max-w-sm w-full">
                {/* Rules */}
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-4 border-2 border-gray-600 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-4 text-center text-cyan-300 border-b border-cyan-600 pb-2">
                        HOW TO PLAY
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>
                            Place a bet on either <b>Small</b> (sum of 4-10) or{" "}
                            <b>Big</b> (sum of 11-17).
                        </li>
                        <li>Winning bets pay 1:1.</li>
                        <li>
                            If all three dice are the same (a <b>Triple</b>),
                            all bets lose.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Game UI */}
            <div className="relative max-w-lg w-full">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border-4 border-cyan-400 relative overflow-hidden">
                    {/* Dice Window */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 p-1">
                            <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-900 to-black"></div>
                        </div>
                        <div
                            className="text-white shadow-[0_0_20px_#ff0] rounded-lg p-4"
                            style={{
                                background:
                                    "radial-gradient(circle at center, #111 0%, #000 100%)",
                            }}
                        >
                            <DiceCollection rollValues={diceValues} />
                        </div>
                    </div>

                    {/* Game Message */}
                    {gameMessage && (
                        <div
                            className={`text-center my-4 py-2 rounded-lg font-bold text-lg transition-all duration-500 ${
                                betResult?.payout ?? BigInt(0) > BigInt(0)
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-red-500/20 text-red-300"
                            }`}
                        >
                            {gameMessage}
                        </div>
                    )}

                    {/* Choice Selection */}
                    <div className="mt-2">
                        <label className="block text-sm text-gray-300 font-semibold mb-1 text-center">
                            Select Your Choice:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {choices.map((choice) => (
                                <button
                                    key={choice.value}
                                    onClick={() =>
                                        setSelectedChoice(choice.value)
                                    }
                                    disabled={isRolling}
                                    className={`
                                        relative px-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                        ${
                                            selectedChoice === choice.value
                                                ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white scale-105 shadow-lg"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105"
                                        }
                                        ${
                                            isRolling
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                        }
                                    `}
                                >
                                    {choice.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bet Amount Selection */}
                    <div className="mt-4 mb-6">
                        <label className="block text-sm text-gray-300 font-semibold mb-1 text-center">
                            Select Your Amount (ETH):
                        </label>
                        <div className="grid grid-cols-4 items-center justify-evenly gap-2">
                            {betAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    disabled={isRolling}
                                    className={`
                                        relative px-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                        ${
                                            selectedAmount === amount
                                                ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white scale-105 shadow-lg"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105"
                                        }
                                        ${
                                            isRolling
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                        }
                                    `}
                                >
                                    {amount}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Spin Button */}
                    <div className="text-center">
                        <button
                            className={`
                                relative bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-xl 
                                rounded-2xl px-8 py-4 shadow-lg border-2 border-cyan-300 
                                transform transition-all duration-200 min-w-[160px]
                                ${
                                    isRolling
                                        ? "opacity-50 cursor-not-allowed scale-95"
                                        : "hover:scale-105 active:scale-95 shadow-cyan-500/50 cursor-pointer hover:shadow-xl"
                                }
                            `}
                            onClick={handleBetClick}
                            disabled={isRolling}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-2xl"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                {isRolling ? "ROLLING..." : "PLACE BET"}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side Panel - Rewards */}
            <div className="px-6 max-w-sm w-full">
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-4 border-2 border-gray-600 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-4 text-center text-cyan-300 border-b border-cyan-600 pb-2">
                        YOUR REWARDS
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="text-gray-300 text-sm font-semibold tracking-wider">
                                BALANCE
                            </div>
                            <div className="text-cyan-200 text-lg font-mono bg-black/50 rounded px-3 py-1">
                                {formatEther(balance).substring(0, 5)} ETH
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-300 text-sm font-semibold tracking-wider">
                                PENDING
                            </div>
                            <div className="text-orange-300 text-lg font-mono bg-black/50 rounded px-3 py-1">
                                {formatEther(pendingRewards).substring(0, 5)} ETH
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleClaimAll}
                            disabled={isClaiming || pendingRewards === BigInt(0)}
                            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isClaiming ? "CLAIMING..." : "CLAIM ALL"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiceRoller;

// This is the controlled DiceCollection component for the game UI
interface DiceCollectionProps {
    rollValues: number[];
    className?: string;
}

const DiceCollection: React.FC<DiceCollectionProps> = ({
    rollValues,
    className,
}) => {
    const diceRefs = useRef<{ [key: string]: DiceRef | null }>({});
    const [isAnimating, setIsAnimating] = useState(false);
    const isMounted = useRef(false);

    // Use a ref to check animation status inside useEffect without adding it as a dependency
    const isAnimatingRef = useRef(isAnimating);
    isAnimatingRef.current = isAnimating;

    const rollAllToValues = useCallback((values: number[]) => {
        setIsAnimating(true);

        Object.keys(diceRefs.current).forEach((diceId, index) => {
            setTimeout(() => {
                const diceRef = diceRefs.current[diceId];
                const value = values[index];

                if (diceRef?.rollToValue && value >= 1 && value <= 6) {
                    diceRef.rollToValue(value);
                } else {
                    diceRef?.roll(); // Fallback to random roll
                }
            }, index * 200); // Stagger the dice rolls
        });

        // Reset animation state after it completes
        setTimeout(() => {
            setIsAnimating(false);
        }, 1200 + 200 * 3); // Animation duration + stagger
    }, []); // Stable callback with no dependencies

    useEffect(() => {
        if (isMounted.current) {
            // Only roll if new values arrive and we are not already animating
            if (rollValues && !isAnimatingRef.current) {
                rollAllToValues(rollValues);
            }
        } else {
            // On first render, just mark as mounted and do nothing
            isMounted.current = true;
        }
    }, [rollValues, rollAllToValues]); // Effect only runs when new rollValues are received

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-2 gap-4 justify-items-center max-w-md mx-auto">
                {Array.from({ length: 3 }, (_, i) => {
                    const diceId = `dice-${i + 1}`;
                    const isLastOddDice = 3 % 2 === 1 && i === 3 - 1;
                    return (
                        <div
                            key={diceId}
                            className={`h-30 text-center content-center ${
                                isLastOddDice ? "col-span-2" : ""
                            }`}
                        >
                            <Dice
                                ref={(ref) => {
                                    diceRefs.current[diceId] = ref;
                                }}
                                id={diceId}
                                size="md"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
