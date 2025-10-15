"use client";

import { useState } from "react";
import useMonopoly from "../../games/monopoly/hooks/useMonopoly";
import GameBoard from "../../games/monopoly/components/GameBoard";
import PlayerStats from "../../games/monopoly/components/PlayerStats";
import Chat from "../../games/monopoly/components/Chat";
import Controls from "../../games/monopoly/components/Controls";
import Modals from "../../games/monopoly/components/Modals";
import { Card, Player, Property, TradeDetails } from "@/types";
import FactionStatus from "@/components/games/monopoly/components/FactionStatus";
import PropertyPortfolio from "@/components/games/monopoly/components/PropertyPortfolio";
import StoryEvents from "@/components/games/monopoly/components/StoryEvent";
import GameAnalytics from "@/components/games/monopoly/components/GameAnalytics";
import TradeModal from "../../games/monopoly/components/TradeModal";

const MonopolyGame = () => {
    const {
        gameState,
        getCurrentPlayer,
        squares,
        hasRolled,
        handleRollDice,
        handleEndTurn,
        handleBuyProperty,
        handleBuyHouse,
        handleTrade,
        modalProperty,
        modalCard,
        closeModal,
    } = useMonopoly();
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

    if (!gameState) {
        return <div className="my-20 text-center">Loading...</div>;
    }

    const currentPlayer = getCurrentPlayer();

    const onTrade = (tradeDetails: TradeDetails) => {
        handleTrade(tradeDetails);
        setIsTradeModalOpen(false);
    }

    return (
        <div className="grid grid-cols-[300px_1fr_300px] h-screen gap-4 p-4 max-w-[1600px] mx-auto my-0">
            <div className="flex flex-col gap-4 overflow-y-auto h-screen scroll-hide">
                {currentPlayer && (
                    <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100%-4rem)]">
                        <PlayerStats
                            player={currentPlayer}
                            onTrade={() => setIsTradeModalOpen(true)}
                        />
                        <FactionStatus />
                        <PropertyPortfolio
                            player={currentPlayer}
                            properties={gameState.properties}
                            onBuyHouse={handleBuyHouse}
                        />
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center p-4">
                <GameBoard
                    gameState={gameState}
                    onRollDice={handleRollDice}
                    onEndTurn={handleEndTurn}
                    onBuyProperty={handleBuyProperty}
                    lastRoll={gameState.lastRoll}
                    hasRolled={hasRolled}
                />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto h-screen scroll-hide">
                <Chat
                    messages={[
                        {
                            username: "System",
                            time: "10:25",
                            text: "Player 1 bought Virtual Plaza",
                        },
                        {
                            username: "NeoPlayer",
                            time: "10:25",
                            text: "Anyone want to trade properties?",
                        },
                        {
                            username: "System",
                            time: "10:25",
                            text: "Player 2 bought Virtual Plaza",
                        },
                        {
                            username: "System",
                            time: "10:25",
                            text: "Player 3 bought Virtual Plaza",
                        },
                        {
                            username: "System",
                            time: "10:25",
                            text: "Player 4 bought Virtual Plaza",
                        },
                    ]}
                />
                <StoryEvents />
                <GameAnalytics />
            </div>
            <Modals
                property={modalProperty}
                card={modalCard}
                onClose={closeModal}
            />
            <TradeModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                players={gameState.players}
                properties={gameState.properties}
                onTrade={onTrade}
                currentPlayer={currentPlayer!}
            />
        </div>
    );
};

export default MonopolyGame;
