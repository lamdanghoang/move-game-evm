"use client";

import { useParams } from "next/navigation";
import MonopolyGame from "@/components/pages/games/MonopolyGame";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import { useAccount } from "wagmi";
import { GameState, Player } from "@/types";

interface GameUpdateData {
    gameState: GameState;
}

const MonopolyRoomPage = () => {
    const params = useParams();
    const { id: roomId } = params;
    const { address } = useAccount();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [player, setPlayer] = useState<Player>();

    useEffect(() => {
        if (roomId && address) {
            socket.emit("join_game", { roomId, address });
        }
    }, [roomId, address]);

    useEffect(() => {
        const handleGameUpdate = (data: GameUpdateData) => {
            setGameState(data.gameState);

            const currentPlayer = data.gameState.players.find(
                (p) => p.id === address
            );
            setPlayer(currentPlayer);
        };

        socket.on("game_updated", handleGameUpdate);

        return () => {
            socket.off("game_updated", handleGameUpdate);
        };
    }, [address]);

    if (!gameState) {
        return <div className="text-center p-8">Loading room {roomId}...</div>;
    }

    return <MonopolyGame gameState={gameState} player={player} />;
};

export default MonopolyRoomPage;
