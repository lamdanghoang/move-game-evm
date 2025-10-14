"use client";

import type React from "react";
import { useState, useCallback, forwardRef, useImperativeHandle } from "react";

interface DiceProps {
    id?: string;
    onRoll?: (value: number) => void;
    className?: string;
    disabled?: boolean;
    size?: "xs" | "sm" | "md" | "lg";
}

export interface DiceRef {
    roll: () => void;
    rollToValue: (value: number) => void;
    getCurrentValue: () => number;
    isRolling: () => boolean;
}

const Dice = forwardRef<DiceRef, DiceProps>(
    (
        { id = "dice", onRoll, className = "", disabled = false, size = "md" },
        ref
    ) => {
        const [currentRoll, setCurrentRoll] = useState<number>(1);
        const [isRolling, setIsRolling] = useState<boolean>(false);
        const [rollCount, setRollCount] = useState<number>(0);

        const rollDice = useCallback(
            (forcedValue?: number) => {
                if (isRolling || disabled) return;

                setIsRolling(true);
                const newRoll =
                    forcedValue || Math.floor(Math.random() * 6) + 1;
                setCurrentRoll(newRoll);
                setRollCount((prev) => prev + 1);

                if (onRoll) {
                    onRoll(newRoll);
                }

                setTimeout(() => {
                    setIsRolling(false);
                }, 1200);
            },
            [isRolling, onRoll, disabled]
        );

        const rollToValue = useCallback(
            (value: number) => {
                if (value >= 1 && value <= 6) {
                    rollDice(value);
                }
            },
            [rollDice]
        );

        useImperativeHandle(ref, () => ({
            roll: () => rollDice(),
            rollToValue,
            getCurrentValue: () => currentRoll,
            isRolling: () => isRolling,
        }));

        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                rollDice();
            }
        };

        const rollClass = rollCount % 2 === 0 ? "even-roll" : "odd-roll";

        const getRollTransform = (roll: number, isEven: boolean): string => {
            const baseRotations = isEven ? 720 : -720;

            switch (roll) {
                case 1:
                    return `rotateX(${baseRotations}deg) rotateY(${baseRotations}deg)`;
                case 2:
                    return `rotateX(${baseRotations}deg) rotateY(${
                        baseRotations - 90
                    }deg)`;
                case 3:
                    return `rotateX(${
                        baseRotations - 90
                    }deg) rotateY(${baseRotations}deg)`;
                case 4:
                    return `rotateX(${
                        baseRotations + 90
                    }deg) rotateY(${baseRotations}deg)`;
                case 5:
                    return `rotateX(${baseRotations}deg) rotateY(${
                        baseRotations + 90
                    }deg)`;
                case 6:
                    return `rotateX(${baseRotations}deg) rotateY(${
                        baseRotations + 180
                    }deg)`;
                default:
                    return `rotateX(${baseRotations}deg) rotateY(${baseRotations}deg)`;
            }
        };

        const sizeClasses = {
            xs: "w-10 h-10",
            sm: "w-16 h-16",
            md: "w-24 h-24",
            lg: "w-32 h-32",
        };

        const dotSizeClasses = {
            xs: "w-1.5 h-1.5",
            sm: "w-2 h-2",
            md: "w-3 h-3",
            lg: "w-4 h-4",
        };

        return (
            <div className={`dice-container ${className}`}>
                <div
                    className="dice-wrapper"
                    style={{
                        perspective: "500px",
                        perspectiveOrigin: "center center",
                    }}
                >
                    <button
                        // onClick={() => rollDice()}
                        onKeyDown={handleKeyDown}
                        disabled={isRolling || disabled}
                        className={`dice-button ${sizeClasses[size]} transition-transform duration-100 ease-in-out disabled:cursor-not-allowed disabled:opacity-70 rounded-lg`}
                        aria-label={`Roll dice ${id}. Current value: ${currentRoll}`}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: disabled ? "not-allowed" : "pointer",
                            padding: 0,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <ol
                            className={`die-list ${rollClass} ${sizeClasses[size]}`}
                            data-roll={currentRoll}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gridTemplateRows: "1fr",
                                listStyleType: "none",
                                transformStyle: "preserve-3d",
                                margin: 0,
                                padding: 0,
                                transition:
                                    rollCount % 2 === 0
                                        ? "transform 1.2s ease-out"
                                        : "transform 1.05s ease-out",
                                transform: getRollTransform(
                                    currentRoll,
                                    rollCount % 2 === 0
                                ),
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6].map((side) => (
                                <li
                                    key={side}
                                    className="die-item"
                                    data-side={side}
                                    style={{
                                        backgroundColor: "#fefefe",
                                        boxShadow:
                                            "inset -0.35rem 0.35rem 0.75rem rgba(0, 0, 0, 0.3), inset 0.5rem -0.25rem 0.5rem rgba(0, 0, 0, 0.15)",
                                        display: "grid",
                                        gridColumn: 1,
                                        gridRow: 1,
                                        gridTemplateAreas: `
                    "one two three"
                    "four five six"
                    "seven eight nine"
                  `,
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gridTemplateRows: "repeat(3, 1fr)",
                                        height: "100%",
                                        width: "100%",
                                        padding:
                                            size === "xs"
                                                ? "0.25rem"
                                                : size === "sm"
                                                ? "0.5rem"
                                                : size === "md"
                                                ? "0.75rem"
                                                : "1rem",
                                        transform:
                                            side === 1
                                                ? `translateZ(${
                                                      size === "xs"
                                                          ? "1.25rem"
                                                          : "3rem"
                                                  })`
                                                : side === 6
                                                ? `rotateY(180deg) translateZ(${
                                                      size === "xs"
                                                          ? "1.25rem"
                                                          : "3rem"
                                                  })`
                                                : side === 2
                                                ? `rotateY(90deg) translateZ(${
                                                      size === "xs"
                                                          ? "1.25rem"
                                                          : "3rem"
                                                  })`
                                                : side === 5
                                                ? `rotateY(-90deg) translateZ(${
                                                      size === "xs"
                                                          ? "1.25rem"
                                                          : "3rem"
                                                  })`
                                                : side === 3
                                                ? `rotateX(90deg) translateZ(${
                                                      size === "xs"
                                                          ? "1.25rem"
                                                          : "3rem"
                                                  })`
                                                : `rotateX(-90deg) translateZ(${
                                                      size === "xs"
                                                          ? "1.25rem"
                                                          : "3rem"
                                                  })`,
                                    }}
                                >
                                    {Array.from({ length: side }).map(
                                        (_, index) => {
                                            const dotPositions = {
                                                1: ["five"],
                                                2: ["one", "nine"],
                                                3: ["one", "five", "nine"],
                                                4: [
                                                    "one",
                                                    "three",
                                                    "seven",
                                                    "nine",
                                                ],
                                                5: [
                                                    "one",
                                                    "three",
                                                    "five",
                                                    "seven",
                                                    "nine",
                                                ],
                                                6: [
                                                    "one",
                                                    "three",
                                                    "four",
                                                    "six",
                                                    "seven",
                                                    "nine",
                                                ],
                                            };

                                            return (
                                                <span
                                                    key={index}
                                                    className={`dot ${dotSizeClasses[size]}`}
                                                    style={{
                                                        alignSelf: "center",
                                                        backgroundColor:
                                                            "#676767",
                                                        borderRadius: "50%",
                                                        boxShadow:
                                                            "inset -0.15rem 0.15rem 0.25rem rgba(0, 0, 0, 0.5)",
                                                        display: "block",
                                                        justifySelf: "center",
                                                        gridArea:
                                                            dotPositions[
                                                                side as keyof typeof dotPositions
                                                            ][index],
                                                    }}
                                                />
                                            );
                                        }
                                    )}
                                </li>
                            ))}
                        </ol>
                    </button>
                </div>
                {/* <div className="mt-2 text-center text-sm font-medium">
                    Value: {currentRoll}
                </div> */}
            </div>
        );
    }
);

Dice.displayName = "Dice";

export default Dice;
