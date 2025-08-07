"use client";

import {
    SpinResult,
    useAccountBalance,
    useClaimAllPayout,
    useJackpotBalance,
    usePendingReward,
    useSpinSlot,
} from "@/hooks/useContract";
import { fromSuiU64 } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

const SYMBOLS: string[] = [
    "🍒",
    "🍋",
    "🍊",
    "🍇",
    "🍉",
    "💎",
    "7️⃣",
    "🔔",
    "🍀",
    "👑",
];

const REEL_COUNT = 3;
const SYMBOL_HEIGHT = 100; // px
const SPIN_SYMBOLS_COUNT = 50;

// Bet amounts
const betAmounts = [0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0];

// Easing functions
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutBounce = (t: number): number => {
    if (t < 1 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
};

// Create a list of symbol strings for a reel
const createReelSymbols = (symbols: string[], count = 30): string[] => {
    const reelContent: string[] = [];
    for (let i = 0; i < count; i++) {
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        reelContent.push(sym);
    }
    return reelContent;
};

const SlotMachine = () => {
    const [showWinFlash, setShowWinFlash] = useState(false);
    const [winMessage, setWinMessage] = useState<string>("");
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [bet, setBet] = useState(0.01);

    const { spinSlot, spinResult, isLoading, error, digest } = useSpinSlot();
    const {
        claimAllPayout,
        isLoading: isClaiming,
        error: claimErr,
        digest: claimDigest,
    } = useClaimAllPayout();

    const { accountBalance, refetch: refetchBalance } = useAccountBalance();

    const { jackpotBalance, refetch: refetchJackpot } = useJackpotBalance();
    const {
        pendingAmount,
        lastestWin,
        refetch: refetchPending,
    } = usePendingReward();

    // State to hold the symbols for each reel
    const [reelSymbols, setReelSymbols] = useState<string[][]>(() =>
        Array(REEL_COUNT)
            .fill(null)
            .map(() => ["🍒"])
    );

    // State to manage the CSS transform for the animation
    const [reelTransforms, setReelTransforms] = useState<string[]>(
        Array(REEL_COUNT).fill("translateY(0)")
    );

    const spinResultsRef = useRef<string[]>([]);
    const animationFrameRefs = useRef<number[]>([]);
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

    // Cleanup function for timeouts
    useEffect(() => {
        return () => {
            animationFrameRefs.current.forEach(cancelAnimationFrame);
            timeoutRefs.current.forEach(clearTimeout);
        };
    }, []);

    // Clear all ongoing animations
    const clearAnimations = useCallback(() => {
        animationFrameRefs.current.forEach(cancelAnimationFrame);
        timeoutRefs.current.forEach(clearTimeout);
        animationFrameRefs.current = [];
        timeoutRefs.current = [];
    }, []);

    // Main spin animation function
    const animateSpinWithResult = useCallback(
        (resultSymbols: string[]) => {
            if (isSpinning) return;

            setIsSpinning(true);
            setWinMessage("");
            setShowWinFlash(false);
            spinResultsRef.current = [];

            clearAnimations();

            // Generate reel symbols with result at the end
            const newReelSymbols: string[][] = [];
            for (let i = 0; i < REEL_COUNT; i++) {
                const spinSymbols = createReelSymbols(
                    SYMBOLS,
                    SPIN_SYMBOLS_COUNT
                );
                const resultSymbol = resultSymbols[i];
                const finalSymbols = [...spinSymbols, resultSymbol];
                newReelSymbols.push(finalSymbols);
            }

            setReelSymbols(newReelSymbols);

            // This ensures the animation resets before starting a new one.
            // By setting the transform to 0 and then a new value, we force a transition.
            setReelTransforms(Array(REEL_COUNT).fill("translateY(0)"));

            // Animate each reel
            newReelSymbols.forEach((symbols, reelIndex) => {
                const finalPosition = -(symbols.length - 1) * SYMBOL_HEIGHT;
                const spinDuration = 2000 + reelIndex * 400; // Staggered timing
                const startTime = Date.now();

                const animateReel = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / spinDuration, 1);

                    if (progress < 1) {
                        // Use cubic ease-out for smooth deceleration
                        const easedProgress = easeOutCubic(progress);
                        const currentY = finalPosition * easedProgress;

                        setReelTransforms((prev) => {
                            const newTransforms = [...prev];
                            newTransforms[
                                reelIndex
                            ] = `translateY(${currentY}px)`;
                            return newTransforms;
                        });

                        const frameId = requestAnimationFrame(animateReel);
                        animationFrameRefs.current[reelIndex] = frameId;
                    } else {
                        // Animation complete
                        setReelTransforms((prev) => {
                            const newTransforms = [...prev];
                            newTransforms[
                                reelIndex
                            ] = `translateY(${finalPosition}px)`;
                            return newTransforms;
                        });

                        // Store result
                        spinResultsRef.current[reelIndex] =
                            symbols[symbols.length - 1];

                        // Check for win when last reel stops
                        if (reelIndex === REEL_COUNT - 1) {
                            const timeout = setTimeout(() => {
                                checkWinCondition(spinResult);
                            }, 300);
                            timeoutRefs.current.push(timeout);
                        }
                    }
                };

                // Start animation with slight delay
                const startTimeout = setTimeout(() => {
                    const frameId = requestAnimationFrame(animateReel);
                    animationFrameRefs.current[reelIndex] = frameId;
                }, 100);

                timeoutRefs.current.push(startTimeout);
            });
        },
        [spinResult, isSpinning, clearAnimations]
    );

    // Check win condition using contract data
    const checkWinCondition = useCallback(
        (contractResult: SpinResult) => {
            if (!contractResult) {
                setWinMessage("❌ No result received!");
                setIsSpinning(false);
                return;
            }

            // Convert contract values from string to number
            const payoutAmount = fromSuiU64(contractResult.payout);
            const multiplierValue = parseFloat(contractResult.multiplier);

            // Check if it's a win (payout > 0)
            const isWin = payoutAmount > 0;

            if (isWin) {
                // Handle jackpot win
                if (contractResult.is_jackpot) {
                    setWinMessage(
                        `🎰 JACKPOT! You won ${payoutAmount.toFixed(3)} SUI!`
                    );
                } else {
                    // Regular win with win type
                    const winTypeMsg = contractResult.win_type || "WIN";
                    setWinMessage(
                        `🎉 ${winTypeMsg}! You won ${payoutAmount.toFixed(
                            3
                        )} SUI! (${multiplierValue}x)`
                    );
                }

                setShowWinFlash(true);

                // Stop flash effect after 3 seconds
                const flashTimeout = setTimeout(
                    () => setShowWinFlash(false),
                    3000
                );
                timeoutRefs.current.push(flashTimeout);
            } else {
                setWinMessage("❌ Try again!");
            }

            setIsSpinning(false);
            refetchAll();
        },
        [spinResult]
    );

    const handleSpinClick = async () => {
        if (isSpinning || isLoading) return;

        try {
            await spinSlot(bet);
        } catch (err) {
            console.error("Spin failed:", err);
            setIsSpinning(false);
        }
    };

    // Handle spin result from contract
    useEffect(() => {
        if (
            spinResult &&
            spinResult.reel1 !== undefined &&
            spinResult.reel2 !== undefined &&
            spinResult.reel3 !== undefined
        ) {
            const symbols = [
                SYMBOLS[spinResult.reel1],
                SYMBOLS[spinResult.reel2],
                SYMBOLS[spinResult.reel3],
            ];

            console.log("Spin result symbols:", symbols);
            animateSpinWithResult(symbols);
        }
    }, [spinResult]);

    // Handle contract errors
    useEffect(() => {
        if (error) {
            setIsSpinning(false);
            setWinMessage(`❌ Error: ${error.message}`);
        }
    }, [error]);

    useEffect(() => {
        if (claimErr) {
            toast.error("Failed to claim reward");
        }
    }, [claimErr]);

    const refetchAll = () => {
        refetchBalance();
        refetchPending();
        refetchJackpot();
    };

    useEffect(() => {
        setTimeout(() => {
            refetchAll();
        }, 1000);
    }, [claimDigest]);

    return (
        <div className="h-[calc(100%-4rem)] grid grid-cols-1 md:grid-cols-3 p-4 items-start justify-items-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Left Side Panel */}
            <div className="px-6 max-w-sm w-full">
                {/* Payout Table */}
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-4 border-2 border-gray-600 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-4 text-center text-cyan-300 border-b border-cyan-600 pb-2">
                        PAYOUT TABLE
                    </h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-red-900/40 to-yellow-900/40 rounded border border-red-500/30">
                            <span className="text-white">7️⃣7️⃣7️⃣</span>
                            <span className="text-yellow-300 font-bold">
                                JACKPOT! - 1000x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded border border-purple-500/30">
                            <span className="text-white">💎💎💎</span>
                            <span className="text-cyan-300 font-semibold">
                                500x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded border border-green-500/30">
                            <span className="text-white">👑👑👑</span>
                            <span className="text-cyan-300 font-semibold">
                                200x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded border border-indigo-500/30">
                            <span className="text-white">🍀🍀🍀</span>
                            <span className="text-cyan-300 font-semibold">
                                100x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded border border-blue-500/30">
                            <span className="text-white">🔔🔔🔔</span>
                            <span className="text-cyan-300 font-semibold">
                                50x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded border border-indigo-500/30">
                            <span className="text-white">🍉🍉🍉</span>
                            <span className="text-cyan-300 font-semibold">
                                25x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded border border-indigo-500/30">
                            <span className="text-white">🍇🍇🍇</span>
                            <span className="text-cyan-300 font-semibold">
                                15x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded border border-indigo-500/30">
                            <span className="text-white">🍊🍊🍊</span>
                            <span className="text-cyan-300 font-semibold">
                                10x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded border border-indigo-500/30">
                            <span className="text-white">🍋🍋🍋</span>
                            <span className="text-cyan-300 font-semibold">
                                5x
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded border border-indigo-500/30">
                            <span className="text-white">🍒🍒🍒</span>
                            <span className="text-cyan-300 font-semibold">
                                3x
                            </span>
                        </div>

                        <div className="border-t border-cyan-600/50 pt-3 mt-3">
                            {/* <div className="flex justify-between items-center p-1.5 bg-gray-800/50 rounded border border-gray-600/30 mb-1">
                                <span className="text-gray-300 text-xs">
                                    Any 7️⃣7️⃣
                                </span>
                                <span className="text-cyan-300 text-xs font-semibold">
                                    2x
                                </span>
                            </div> */}
                            <div className="flex justify-between items-center p-1.5 bg-gray-800/50 rounded border border-gray-600/30">
                                <span className="text-gray-300 text-xs">
                                    Any 🍒
                                </span>
                                <span className="text-cyan-300 text-xs font-semibold">
                                    1x
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Game UI */}
            <div className="relative max-w-lg w-full">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl px-8 py-6 shadow-2xl border-4 border-cyan-400 relative overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

                    {/* Jackpot Header */}
                    <div className="bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl px-4 py-2 mb-6 border-2 border-cyan-300 shadow-lg relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-2xl animate-pulse"></div>
                        <div className="text-center relative z-10">
                            <div className="text-sm text-cyan-100 mb-1 tracking-wider">
                                GAME POOL
                            </div>
                            <div className="text-2xl font-bold text-white tracking-wider font-mono">
                                {jackpotBalance !== null
                                    ? `${fromSuiU64(jackpotBalance).toFixed(
                                          3
                                      )} SUI`
                                    : "LOADING POOL..."}
                            </div>
                        </div>
                    </div>

                    {/* Slot Machine Reel Window */}
                    <div className="relative">
                        {/* Game UI */}
                        <div
                            className="flex flex-col items-center text-white shadow-[0_0_20px_#ff0] rounded-lg"
                            style={{
                                background:
                                    "radial-gradient(circle at center, #111 0%, #000 100%)",
                            }}
                        >
                            {/* Chrome effect border */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 p-1">
                                <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-900 to-black"></div>
                            </div>

                            {/* Reels container */}
                            <div className="relative px-10 py-8 flex gap-5">
                                {reelSymbols.map((symbols, i) => (
                                    <div
                                        key={i}
                                        className="w-25 h-25 bg-white border-4 border-[#444] overflow-hidden rounded-lg shadow-[inset_0_0_10px_#000]"
                                    >
                                        <div
                                            className="flex flex-col transition-transform duration-1000 ease-out"
                                            style={{
                                                transform: reelTransforms[i],
                                            }}
                                        >
                                            {symbols.map(
                                                (symbol, symbolIndex) => (
                                                    <div
                                                        key={symbolIndex}
                                                        className="h-25 flex justify-center items-center text-5xl/25"
                                                    >
                                                        {symbol}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lights */}
                        <div className="absolute top-2.5 left-2.5 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-2.5 right-2.5 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
                        <div className="absolute bottom-2.5 left-2.5 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-1000"></div>
                        <div className="absolute bottom-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full animate-pulse delay-1500"></div>
                    </div>

                    {/* Win/Lose Message */}
                    {winMessage && (
                        <div
                            className={`text-center my-4 py-2 rounded-lg font-bold text-lg transition-all duration-500 ${
                                winMessage.includes("won") ||
                                winMessage.includes("JACKPOT") ||
                                winMessage.includes("WIN")
                                    ? "bg-gradient-to-r from-green-500/20 to-yellow-500/20 text-green-300 border border-green-500/50 shadow-lg shadow-green-500/25"
                                    : "bg-red-500/20 text-red-300 border border-red-500/50"
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {spinResult?.is_jackpot && "🎰"}
                                <span>{winMessage}</span>
                                {spinResult?.is_jackpot && "🎰"}
                            </div>
                            {spinResult?.is_jackpot && (
                                <div className="text-sm text-yellow-300 mt-1 animate-pulse">
                                    JACKPOT WINNER!
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bet Amount Selection */}
                    <div className="mt-2 mb-6">
                        <label className="block text-sm text-gray-300 font-semibold mb-3 text-center">
                            Select Bet Amount:
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {betAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setBet(amount)}
                                    disabled={isSpinning}
                                    className={`
                                            relative px-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                            ${
                                                bet === amount
                                                    ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white scale-105 shadow-lg"
                                                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105"
                                            }
                                            ${
                                                isSpinning
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }
                                        `}
                                >
                                    {amount} SUI
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
                                        isSpinning || isLoading
                                            ? "opacity-50 cursor-not-allowed scale-95"
                                            : "hover:scale-105 active:scale-95 shadow-cyan-500/50 cursor-pointer hover:shadow-xl"
                                    }
                                `}
                            onClick={handleSpinClick}
                            disabled={isSpinning || isLoading}
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-2xl"></div>

                            {/* Button content */}
                            <div className="relative flex items-center justify-center gap-2">
                                {(isSpinning || isLoading) && (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                )}
                                <span>
                                    {isLoading
                                        ? "SIGNING..."
                                        : isSpinning
                                        ? "SPINNING..."
                                        : "SPIN"}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side Panel */}
            <div className="p-6 max-w-sm w-full relative overflow-hidden">
                <div className="relative z-10 text-nowrap">
                    <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-4 mb-6 border-2 border-gray-600 backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-4 text-center text-cyan-300 border-b border-cyan-600 pb-2">
                            YOUR ACCOUNT
                        </h3>

                        {/* Balance and Win Panel */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="text-gray-300 text-sm font-semibold tracking-wider">
                                    BALANCE
                                </div>
                                <div className="text-cyan-200 text-lg font-mono bg-black/50 rounded px-3 py-1">
                                    {accountBalance
                                        ? fromSuiU64(accountBalance).toFixed(3)
                                        : 0}{" "}
                                    SUI
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-gray-300 text-sm font-semibold tracking-wider">
                                    LAST WIN
                                </div>
                                <div
                                    className={`text-lg font-mono bg-black/50 rounded px-3 py-1 transition-all duration-300 ${
                                        showWinFlash
                                            ? "text-yellow-300 animate-pulse scale-110 shadow-lg shadow-yellow-300/50"
                                            : "text-cyan-200"
                                    }`}
                                >
                                    {fromSuiU64(lastestWin).toFixed(3)} SUI
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-gray-300 text-sm font-semibold tracking-wider">
                                    PENDING
                                </div>
                                <div className="text-orange-300 text-lg font-mono bg-black/50 rounded px-3 py-1">
                                    {fromSuiU64(pendingAmount).toFixed(3)} SUI
                                </div>
                            </div>
                        </div>

                        {/* Claim Button */}
                        {1 > 0 && (
                            <div className="mt-4">
                                <button
                                    onClick={() => claimAllPayout()}
                                    disabled={isClaiming}
                                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-orange-500/50"
                                >
                                    {isClaiming
                                        ? "CLAIMING..."
                                        : "CLAIM ALL PAYOUT"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotMachine;
