"use client";

import { useParams } from "next/navigation";
import MonopolyGame from "@/components/pages/games/MonopolyGame";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import { useAccount } from "wagmi";
import { GameState, Player } from "@/types";

interface DiceRolledData {
    dice1: number;
    dice2: number;
    player: string;
}

interface GameUpdateData {
    gameState: GameState;
}

const DEFAULT_LAST_ROLL: [number, number] = [1, 1];

const MonopolyRoomPage = () => {
    const params = useParams();
    const { id: roomId } = params;
    const { address } = useAccount();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [player, setPlayer] = useState<Player>();
    const [isAnimating, setIsAnimating] = useState(false);
    const [lastRollResult, setLastRollResult] = useState<
        [number, number] | null
    >(DEFAULT_LAST_ROLL);

    useEffect(() => {
        if (roomId && address) {
            socket.emit("join_game", { roomId, address });
        }
    }, [roomId, address]);

    useEffect(() => {
        const handleDiceRolled = (data: DiceRolledData) => {
            setIsAnimating(true);
            setLastRollResult([data.dice1, data.dice2]);
        };

        const handleGameUpdate = (data: GameUpdateData) => {
            const newGameState = data.gameState;
            setGameState(data.gameState);

            const currentPlayer = data.gameState.players.find(
                (p) => p.id === address
            );
            setPlayer(currentPlayer);

            const serverLastRoll = newGameState.lastRoll;
            if (serverLastRoll && serverLastRoll[0] > 0) {
                setLastRollResult(serverLastRoll);
            } else {
                setLastRollResult(DEFAULT_LAST_ROLL);
                setIsAnimating(false);
            }
        };

        socket.on("dice_rolled", handleDiceRolled);
        socket.on("game_updated", handleGameUpdate);

        return () => {
            socket.off("game_updated", handleGameUpdate);
        };
    }, [address]);

    if (!gameState) {
        return <div className="text-center p-8">Loading room {roomId}...</div>;
    }

    return (
        <MonopolyGame
            gameState={gameState}
            player={player}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            lastRollResult={lastRollResult}
        />
    );
};

export default MonopolyRoomPage;
