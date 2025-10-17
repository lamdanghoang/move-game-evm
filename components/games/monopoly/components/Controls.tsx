import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Dice, { DiceRef } from "@/components/games/dice/dice";

interface ControlsProps {
    onRollDice: () => void;
    onEndTurn: () => void;
    onBuyProperty: () => void;
    onPayJailFine: () => void;
    onUseJailCard: () => void;
    lastRoll: [number, number];
    hasRolled: boolean;
    inJail: boolean;
    hasJailCard: boolean;
}

const Controls: React.FC<ControlsProps> = ({
    onRollDice,
    onEndTurn,
    onBuyProperty,
    onPayJailFine,
    onUseJailCard,
    lastRoll,
    hasRolled,
    inJail,
    hasJailCard,
}) => {
    const dice1Ref = useRef<DiceRef>(null);
    const dice2Ref = useRef<DiceRef>(null);

    useEffect(() => {
        if (lastRoll) {
            dice1Ref.current?.rollToValue(lastRoll[0]);
            dice2Ref.current?.rollToValue(lastRoll[1]);
        }
    }, [lastRoll]);
    return (
        <div
            className="absolute col-start-2 col-span-9 row-start-2 row-span-9 flex flex-col items-center justify-center rounded-full text-center gap-3
            bg-radial from-cyan-500/10 from-0% to-transparent to-70%"
        >
            <div className="flex flex-col gap-1">
                <h1 className="text-cyan-500 text-shadow-[0_0_20px_rgba(50_184_198_/_0.8)] text-xl font-semibold">
                    NEO
                    <br />
                    METROPOLIS
                </h1>
                <p className="text-neutral-400/70 text-xs">
                    Cyberpunk Trading Game
                </p>
            </div>

            <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-3">
                    <Dice ref={dice1Ref} size="xs" speed={800} />
                    <Dice ref={dice2Ref} size="xs" speed={800} />
                </div>
                {inJail ? (
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-red-500 font-bold">IN JAIL</p>
                        <Button
                            className="btn rollDiceBtn"
                            onClick={onRollDice}
                            disabled={hasRolled}
                        >
                            Roll for Double
                        </Button>
                        <Button onClick={onPayJailFine}>Pay 50 Fine</Button>
                        {hasJailCard && (
                            <Button onClick={onUseJailCard}>
                                Use Get Out of Jail Free Card
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <Button
                            className={`btn rollDiceBtn`}
                            onClick={onRollDice}
                            disabled={hasRolled}
                        >
                            Roll Dice
                        </Button>
                        <div className="text-xs/normal">
                            Last Roll: {lastRoll[0]} + {lastRoll[1]} ={" "}
                            {lastRoll[0] + lastRoll[1]}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={onBuyProperty}>
                                Buy Property
                            </Button>
                            <Button onClick={onEndTurn} disabled={!hasRolled}>
                                End Turn
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Controls;
