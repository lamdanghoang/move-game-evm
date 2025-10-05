"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dice, { DiceRef } from "./dice";

interface DiceCollectionProps {
    initialCount?: number;
    maxDice?: number;
    className?: string;
}

const DiceCollection: React.FC<DiceCollectionProps> = ({
    initialCount = 1,
    maxDice = 10,
    className = "",
}) => {
    const [diceCount, setDiceCount] = useState(initialCount);
    const [rollResults, setRollResults] = useState<{ [key: string]: number }>(
        {}
    );
    const [isRollingAll, setIsRollingAll] = useState(false);
    const [forcedValues, setForcedValues] = useState<{ [key: string]: string }>(
        {}
    );

    // Use refs to store dice references
    const diceRefs = useRef<{ [key: string]: DiceRef | null }>({});

    const handleDiceRoll = useCallback((diceId: string, value: number) => {
        setRollResults((prev) => ({ ...prev, [diceId]: value }));
    }, []);

    const rollAllDice = useCallback(async () => {
        if (isRollingAll) return;

        setIsRollingAll(true);

        // Roll all dice with a slight delay between each
        Object.keys(diceRefs.current).forEach((diceId, index) => {
            setTimeout(() => {
                const diceRef = diceRefs.current[diceId];
                if (diceRef?.roll) {
                    diceRef.roll();
                }
            }, index * 100);
        });

        // Reset rolling state after all animations complete
        setTimeout(() => {
            setIsRollingAll(false);
        }, 1500);
    }, [isRollingAll]);

    const rollAllToValues = useCallback(() => {
        if (isRollingAll) return;

        setIsRollingAll(true);

        Object.keys(diceRefs.current).forEach((diceId, index) => {
            setTimeout(() => {
                const diceRef = diceRefs.current[diceId];
                const forcedValue = Number.parseInt(forcedValues[diceId]);
                if (
                    diceRef?.rollToValue &&
                    forcedValue >= 1 &&
                    forcedValue <= 6
                ) {
                    diceRef.rollToValue(forcedValue);
                } else if (diceRef?.roll) {
                    diceRef.roll();
                }
            }, index * 100);
        });

        setTimeout(() => {
            setIsRollingAll(false);
        }, 1500);
    }, [forcedValues, isRollingAll]);

    const handleForcedValueChange = (diceId: string, value: string) => {
        setForcedValues((prev) => ({ ...prev, [diceId]: value }));
    };

    const totalSum = Object.values(rollResults).reduce(
        (sum, value) => sum + value,
        0
    );

    // Initialize roll results when dice count changes
    useEffect(() => {
        const newResults: { [key: string]: number } = {};
        for (let i = 1; i <= diceCount; i++) {
            const diceId = `dice-${i}`;
            newResults[diceId] = rollResults[diceId] || 1;
        }
        setRollResults(newResults);
    }, [diceCount]); // Remove rollResults from dependencies to avoid infinite loop

    return (
        <div className={`dice-collection ${className}`}>
            <div className="controls mb-6 space-y-4">
                <div className="flex items-center gap-4">
                    <Label htmlFor="dice-count">Number of Dice:</Label>
                    <Input
                        id="dice-count"
                        type="number"
                        min="1"
                        max={maxDice}
                        value={diceCount}
                        onChange={(e) =>
                            setDiceCount(
                                Math.min(
                                    maxDice,
                                    Math.max(
                                        1,
                                        Number.parseInt(e.target.value) || 1
                                    )
                                )
                            )
                        }
                        className="w-20"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={rollAllDice}
                        disabled={isRollingAll}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isRollingAll ? "Rolling..." : "Roll All Dice"}
                    </Button>
                    <Button
                        onClick={rollAllToValues}
                        disabled={isRollingAll}
                        variant="outline"
                    >
                        Roll to Values
                    </Button>
                </div>

                {diceCount > 0 && (
                    <div className="forced-values">
                        <Label className="text-sm font-medium">
                            Set specific values (1-6, leave empty for random):
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                            {Array.from({ length: diceCount }, (_, i) => {
                                const diceId = `dice-${i + 1}`;
                                return (
                                    <div
                                        key={diceId}
                                        className="flex items-center gap-1"
                                    >
                                        <Label
                                            htmlFor={`value-${diceId}`}
                                            className="text-xs"
                                        >
                                            D{i + 1}:
                                        </Label>
                                        <Input
                                            id={`value-${diceId}`}
                                            type="number"
                                            min="1"
                                            max="6"
                                            value={forcedValues[diceId] || ""}
                                            onChange={(e) =>
                                                handleForcedValueChange(
                                                    diceId,
                                                    e.target.value
                                                )
                                            }
                                            className="w-12 h-8 text-xs"
                                            placeholder="?"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="dice-grid grid grid-cols-2 gap-4 justify-items-center mb-6 max-w-md mx-auto">
                {Array.from({ length: diceCount }, (_, i) => {
                    const diceId = `dice-${i + 1}`;
                    const isLastOddDice =
                        diceCount % 2 === 1 && i === diceCount - 1;

                    return (
                        <div
                            key={diceId}
                            className={`dice-item text-center ${
                                isLastOddDice ? "col-span-2" : ""
                            }`}
                        >
                            <Dice
                                ref={(ref) => {
                                    diceRefs.current[diceId] = ref;
                                }}
                                id={diceId}
                                onRoll={(value) =>
                                    handleDiceRoll(diceId, value)
                                }
                                size="md"
                            />
                        </div>
                    );
                })}
            </div>

            {diceCount > 1 && (
                <div className="results text-center">
                    <div className="text-lg font-bold">
                        Total Sum: {totalSum}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                        Average:{" "}
                        {diceCount > 0 ? (totalSum / diceCount).toFixed(1) : 0}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiceCollection;
