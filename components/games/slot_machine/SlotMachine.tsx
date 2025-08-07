"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SlotMachine.module.css";

const SYMBOLS: string[] = [
    "🍒",
    "🍋",
    "🍊",
    "🍇",
    "🍉",
    "💎",
    "🔔",
    "7️⃣",
    "🍀",
    "👑",
];
const REEL_COUNT = 3;

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
    const [winMessage, setWinMessage] = useState<string>("");
    const [isSpinning, setIsSpinning] = useState<boolean>(false);

    // State to hold the symbols for each reel
    const [reelSymbols, setReelSymbols] = useState<string[][]>([
        ["🍒"],
        ["🍒"],
        ["🍒"],
    ]);

    // State to manage the CSS transform for the animation
    const [reelTransforms, setReelTransforms] = useState<string[]>(
        Array(REEL_COUNT).fill("translateY(0)")
    );

    const spinResultsRef = useRef<string[]>([]);
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

    // Cleanup function for timeouts
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(clearTimeout);
        };
    }, []);

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWinMessage("");
        spinResultsRef.current = [];

        // Clear any previous timeouts
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];

        const newReelSymbols = Array.from({ length: REEL_COUNT }, () =>
            createReelSymbols(SYMBOLS)
        );
        setReelSymbols(newReelSymbols);

        // This ensures the animation resets before starting a new one.
        // By setting the transform to 0 and then a new value, we force a transition.
        setReelTransforms(Array(REEL_COUNT).fill("translateY(0)"));

        newReelSymbols.forEach((symbols, i) => {
            const randomIndex = 10 + Math.floor(Math.random() * 10);
            const translateY = -randomIndex * 100;

            const timeout = setTimeout(() => {
                setReelTransforms((prevTransforms) => {
                    const newTransforms = [...prevTransforms];
                    newTransforms[i] = `translateY(${translateY}px)`;
                    return newTransforms;
                });

                // Store the result of the spin
                spinResultsRef.current[i] = symbols[randomIndex];

                // Check for win after the last reel has finished spinning
                if (i === REEL_COUNT - 1) {
                    timeoutRefs.current.push(
                        setTimeout(() => {
                            const results = spinResultsRef.current;
                            if (results.every((s) => s === results[0])) {
                                setWinMessage("🎉 You win!");
                            } else {
                                setWinMessage("❌ Try again!");
                            }
                            setIsSpinning(false);
                        }, 1000)
                    );
                }
            }, i * 400); // Each reel stops a bit later

            timeoutRefs.current.push(timeout);
        });
    };

    return (
        <div className={styles.body}>
            <div className={styles.slotMachine}>
                {reelSymbols.map((symbols, i) => (
                    <div key={i} className={styles.reel}>
                        <div
                            className={styles.symbols}
                            style={{
                                transform: reelTransforms[i],
                                transition: isSpinning
                                    ? "transform 1s ease-out"
                                    : "none",
                            }}
                        >
                            {symbols.map((symbol, symbolIndex) => (
                                <div
                                    key={symbolIndex}
                                    className={styles.symbol}
                                >
                                    {symbol}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                className={styles.spinBtn}
                onClick={spin}
                disabled={isSpinning}
            >
                🎰 SPIN
            </button>
            <div className={styles.winMessage}>{winMessage}</div>
        </div>
    );
};

export default SlotMachine;
