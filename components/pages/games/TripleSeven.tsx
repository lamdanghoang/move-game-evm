"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import SlotMachine from "@/components/games/slot_machine/SlotMachine";

// Define a type for the symbol keys to allow explicit indexing
type SymbolKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Classic slot symbols matching the image
const symbols: Record<SymbolKey, { emoji: string; name: string }> = {
    1: { emoji: "🍒", name: "CHERRY" }, // Cherry
    2: { emoji: "🍋", name: "LEMON" }, // Lemon
    3: { emoji: "🍊", name: "ORANGE" }, // Orange
    4: { emoji: "🍉", name: "WATERMELON" }, // Watermelon
    5: { emoji: "🟣", name: "PLUM" }, // Plum
    6: { emoji: "🔔", name: "BELL" }, // Bell
    7: { emoji: "7️⃣", name: "SEVEN" }, // Lucky Seven
    8: { emoji: "💰", name: "DOLLAR" }, // Dollar sign
    9: { emoji: "🎯", name: "BAR" }, // Bar
};

const TripleSeven = () => {
    const [credits, setCredits] = useState(1000);
    const [currentWin, setCurrentWin] = useState(0);
    const [bet, setBet] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [reels, setReels] = useState<SymbolKey[]>([1, 2, 3]); // Default symbols
    const [jackpot, setJackpot] = useState(1000000);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showWinFlash, setShowWinFlash] = useState(false);

    // Generate weighted random symbol
    const generateSymbol = (): SymbolKey => {
        const roll = Math.floor(Math.random() * 1000);
        if (roll < 5) return 7; // 0.5% SEVEN
        if (roll < 15) return 8; // 1.0% DOLLAR
        if (roll < 35) return 9; // 2.0% BAR
        if (roll < 75) return 6; // 4.0% BELL
        if (roll < 135) return 5; // 6.0% PLUM
        if (roll < 235) return 4; // 10.0% WATERMELON
        if (roll < 385) return 3; // 15.0% ORANGE
        if (roll < 585) return 2; // 20.0% LEMON
        return 1; // 41.5% CHERRY
    };

    // Calculate winnings
    const calculateWin = (reels: SymbolKey[], betAmount: number) => {
        const [r1, r2, r3] = reels;
        let multiplier = 0;

        // Triple matches
        if (r1 === r2 && r2 === r3) {
            switch (r1) {
                case 7:
                    multiplier = 1000;
                    break; // 777 JACKPOT
                case 8:
                    multiplier = 500;
                    break; // 💰💰💰
                case 9:
                    multiplier = 100;
                    break; // BAR BAR BAR
                case 6:
                    multiplier = 50;
                    break; // 🔔🔔🔔
                case 5:
                    multiplier = 25;
                    break; // 🟣🟣🟣
                case 4:
                    multiplier = 20;
                    break; // 🍉🍉🍉
                case 3:
                    multiplier = 15;
                    break; // 🍊🍊🍊
                case 2:
                    multiplier = 10;
                    break; // 🍋🍋🍋
                case 1:
                    multiplier = 5;
                    break; // 🍒🍒🍒
            }
        }
        // Two sevens
        else if (
            (r1 === 7 && r2 === 7) ||
            (r1 === 7 && r3 === 7) ||
            (r2 === 7 && r3 === 7)
        ) {
            multiplier = 10;
        }
        // Any cherry
        else if (r1 === 1 || r2 === 1 || r3 === 1) {
            multiplier = 2;
        }

        return betAmount * multiplier;
    };

    // Handle spin
    const handleSpin = async () => {
        if (isSpinning || credits < bet) return;

        setIsSpinning(true);
        setCurrentWin(0);
        setShowWinFlash(false);

        // Deduct bet
        setCredits((prev) => prev - bet);

        // Generate final result
        const finalResult = [
            generateSymbol(),
            generateSymbol(),
            generateSymbol(),
        ];

        // Animate spinning - each reel stops at different times
        const spinDurations = [2000, 2500, 3000];

        spinDurations.forEach((duration, index) => {
            setTimeout(() => {
                setReels((prev) => {
                    const newReels = [...prev];
                    newReels[index] = finalResult[index];
                    return newReels;
                });
            }, duration);
        });

        // Check for win after all reels stop
        setTimeout(() => {
            const winAmount = calculateWin(finalResult, bet);

            if (winAmount > 0) {
                setCurrentWin(winAmount);
                setCredits((prev) => prev + winAmount);
                setShowWinFlash(true);

                // Flash effect duration
                setTimeout(() => setShowWinFlash(false), 3000);
            }

            setIsSpinning(false);
        }, 3500);
    };

    // Handle bet controls
    const handleBetOne = () => {
        if (!isSpinning) setBet(1);
    };

    const handleMaxBet = () => {
        if (!isSpinning) {
            const maxBet = Math.min(credits, 100);
            setBet(maxBet);
        }
    };

    // Auto-increment jackpot
    useEffect(() => {
        const interval = setInterval(() => {
            setJackpot((prev) => prev + Math.floor(Math.random() * 10) + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 flex items-center justify-center p-4">
            {/* Slot Machine Frame */}
            <div className="relative">
                {/* Machine Body */}
                <div className="bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 rounded-3xl p-8 shadow-2xl border-8 border-gray-700 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>

                    {/* Top Display Panel */}
                    <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-2xl p-4 mb-6 border-4 border-yellow-700 shadow-inner">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-black tracking-wider">
                                JACKPOT: {jackpot.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Credits/Win Display */}
                    <div className="bg-black rounded-xl p-4 mb-6 border-4 border-gray-600">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-yellow-400 text-sm font-bold tracking-wider">
                                    CREDITS
                                </div>
                                <div className="text-yellow-300 text-2xl font-mono bg-black/50 rounded px-2">
                                    {credits.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-yellow-400 text-sm font-bold tracking-wider">
                                    WIN
                                </div>
                                <div
                                    className={`text-2xl font-mono bg-black/50 rounded px-2 ${
                                        showWinFlash
                                            ? "text-red-400 animate-pulse"
                                            : "text-yellow-300"
                                    }`}
                                >
                                    {currentWin.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Reel Window */}
                    <div className="relative">
                        {/* Window Frame */}
                        <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-2xl p-6 border-4 border-yellow-800 shadow-inner">
                            {/* Reel Container */}
                            <SlotMachine />

                            {/* Decorative Lights */}
                            <div className="absolute top-2 left-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse delay-500"></div>
                            <div className="absolute bottom-2 left-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
                            <div className="absolute bottom-2 right-2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse delay-1500"></div>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        {/* SPIN Button */}
                        <button
                            onClick={handleSpin}
                            disabled={isSpinning || credits < bet}
                            className={`
                relative bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500
                rounded-xl p-4 text-white font-bold text-lg shadow-lg border-4 border-red-700
                transform transition-all duration-150
                ${
                    isSpinning || credits < bet
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 active:scale-95 shadow-red-500/50"
                }
              `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-lg"></div>
                            <div className="relative">
                                {isSpinning ? "SPINNING..." : "SPIN"}
                            </div>
                        </button>

                        {/* BET ONE Button */}
                        <button
                            onClick={handleBetOne}
                            disabled={isSpinning}
                            className="bg-gradient-to-b from-gray-200 to-gray-400 hover:from-gray-100 hover:to-gray-300 
                         rounded-xl p-4 text-black font-bold text-lg shadow-lg border-4 border-gray-500
                         transform hover:scale-105 active:scale-95 transition-all duration-150 relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-lg"></div>
                            <div className="relative">BET ONE</div>
                        </button>

                        {/* MAX BET Button */}
                        <button
                            onClick={handleMaxBet}
                            disabled={isSpinning}
                            className="bg-gradient-to-b from-gray-200 to-gray-400 hover:from-gray-100 hover:to-gray-300
                         rounded-xl p-4 text-black font-bold text-lg shadow-lg border-4 border-gray-500
                         transform hover:scale-105 active:scale-95 transition-all duration-150 relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-lg"></div>
                            <div className="relative">MAX BET</div>
                        </button>
                    </div>

                    {/* Current Bet Display */}
                    <div className="mt-4 text-center">
                        <div className="bg-black rounded-lg p-2 inline-block">
                            <span className="text-yellow-400 text-sm font-bold">
                                BET:{" "}
                            </span>
                            <span className="text-yellow-300 text-lg font-mono">
                                {bet}
                            </span>
                        </div>
                    </div>

                    {/* Sound Toggle */}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/30 transition-colors"
                    >
                        {soundEnabled ? (
                            <Volume2 size={20} className="text-white" />
                        ) : (
                            <VolumeX size={20} className="text-white" />
                        )}
                    </button>
                </div>

                {/* Machine Shadow */}
                <div className="absolute inset-0 bg-black/30 rounded-3xl transform translate-y-2 translate-x-2 -z-10"></div>

                {/* Win Flash Effect */}
                {showWinFlash && currentWin > 0 && (
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-3xl animate-pulse pointer-events-none"></div>
                )}
            </div>

            {/* Payout Table (Side Panel) */}
            {/* <div className="ml-8 bg-black/80 rounded-2xl p-6 text-yellow-400 max-w-xs">
                <h3 className="text-lg font-bold mb-4 text-center border-b border-yellow-600 pb-2">
                    PAYOUT TABLE
                </h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-1 bg-red-900/30 rounded">
                        <span>7️⃣7️⃣7️⃣</span>
                        <span className="text-red-400 font-bold">JACKPOT!</span>
                    </div>
                    <div className="flex justify-between items-center p-1">
                        <span>💰💰💰</span>
                        <span>500x</span>
                    </div>
                    <div className="flex justify-between items-center p-1">
                        <span>🎯🎯🎯</span>
                        <span>100x</span>
                    </div>
                    <div className="flex justify-between items-center p-1">
                        <span>🔔🔔🔔</span>
                        <span>50x</span>
                    </div>
                    <div className="flex justify-between items-center p-1">
                        <span>🟣🟣🟣</span>
                        <span>25x</span>
                    </div>
                    <div className="border-t border-yellow-600 pt-2 mt-3">
                        <div className="flex justify-between items-center p-1 text-xs">
                            <span>Any 7️⃣7️⃣</span>
                            <span>10x</span>
                        </div>
                        <div className="flex justify-between items-center p-1 text-xs">
                            <span>Any 🍒</span>
                            <span>2x</span>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default TripleSeven;
