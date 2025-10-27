"use client";

import { useParams } from "next/navigation";
import MonopolyGame from "@/components/pages/games/MonopolyGame";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import { useAccount } from "wagmi";
import { GameState, Player } from "@/types";
import { toast } from "sonner";

interface DiceRolledData {
    dice1: number;
    dice2: number;
    player: string;
}

interface GameUpdateData {
    gameState: GameState;
}

interface ErrorData {
    message: string;
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
    const [buyOrAuctionPropertyId, setBuyOrAuctionPropertyId] = useState<number | null>(null);

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
            setGameState(data.gameState);

            const currentPlayer = data.gameState.players.find(
                (p) => p.id === address
            );
            setPlayer(currentPlayer);
        };

        const handlePromptBuyOrAuction = (data: { propertyId: number }) => {
            setBuyOrAuctionPropertyId(data.propertyId);
        };

        const handleError = (data: ErrorData) => {
            toast.error(data.message);
        };

        socket.on("dice_rolled", handleDiceRolled);
        socket.on("game_updated", handleGameUpdate);
        socket.on("promptBuyOrAuction", handlePromptBuyOrAuction);
        socket.on("error", handleError);

        return () => {
            socket.off("dice_rolled", handleDiceRolled);
            socket.off("game_updated", handleGameUpdate);
            socket.off("promptBuyOrAuction", handlePromptBuyOrAuction);
            socket.off("error", handleError);
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
            buyOrAuctionPropertyId={buyOrAuctionPropertyId}
            clearBuyOrAuction={() => setBuyOrAuctionPropertyId(null)}
        />
    );
};

export default MonopolyRoomPage;
