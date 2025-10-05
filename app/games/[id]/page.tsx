"use client";

import { useParams } from "next/navigation";
import SlotMachine from "@/components/pages/games/SlotMachine";
import DiceRoller from "@/components/pages/games/DiceRoller";

const gameComponents: Record<string, React.ComponentType> = {
    "0": SlotMachine,
    "1": DiceRoller,
};

export default function Game() {
    const { id } = useParams<{ id: string }>();
    const GameComponent = gameComponents[id];

    if (!GameComponent) {
        return <div>Game not found</div>;
    }

    return <GameComponent />;
}
