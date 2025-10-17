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
import { motion, AnimatePresence } from "framer-motion";
import GameLog from "../../games/monopoly/components/GameLog";

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
        handlePayJailFine,
        useGetOutOfJailCard,
        recentlyPurchasedId,
        recentlyBuiltId,
        buildingPropertyId,
    } = useMonopoly();
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

    if (!gameState) {
        return <div className="my-20 text-center">Loading...</div>;
    }

    const currentPlayer = getCurrentPlayer();

    const onTrade = (tradeDetails: TradeDetails) => {
        handleTrade(tradeDetails);
        setIsTradeModalOpen(false);
    };

    return (
        <div className="grid grid-cols-[300px_1fr_300px] h-screen gap-4 p-4 max-w-[1600px] mx-auto my-0">
            <div className="flex flex-col gap-4 overflow-y-auto h-screen scroll-hide">
                {gameState.players.map((player) => (
                    <PlayerStats
                        key={player.id}
                        player={player}
                        onTrade={() => setIsTradeModalOpen(true)}
                        isCurrentPlayer={player.id === currentPlayer?.id}
                    />
                ))}
                <FactionStatus />
                {currentPlayer && (
                    <PropertyPortfolio
                        player={currentPlayer}
                        properties={{
                            ...gameState.properties,
                            ...gameState.railroads,
                            ...gameState.utilities,
                        }}
                        onBuyHouse={handleBuyHouse}
                    />
                )}
            </div>
            <div className="relative flex items-center justify-center p-4">
                <GameBoard
                    gameState={gameState}
                    recentlyPurchasedId={recentlyPurchasedId}
                    recentlyBuiltId={recentlyBuiltId}
                />
                <Controls
                    onRollDice={handleRollDice}
                    onEndTurn={handleEndTurn}
                    onBuyProperty={handleBuyProperty}
                    lastRoll={gameState.lastRoll}
                    hasRolled={hasRolled}
                    inJail={currentPlayer?.inJail || false}
                    onPayJailFine={handlePayJailFine}
                    onUseJailCard={useGetOutOfJailCard}
                    hasJailCard={false}
                />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto h-screen scroll-hide">
                <Chat messages={[]} />
                <GameLog events={gameState.gameLog} />
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
            <AnimatePresence>
                {(buildingPropertyId !== null || recentlyPurchasedId !== null) &&
                    (() => {
                        if (buildingPropertyId !== null) {
                            const property =
                                gameState.properties[buildingPropertyId];
                            const player = getCurrentPlayer();
                            if (!property || !player) return null;

                            const isHotel = property.houses === 5;

                            const getColorName = (hexColor: string) => {
                                if (hexColor === "#00ff88") return "green";
                                if (hexColor === "#ff0088") return "red";
                                if (hexColor === "#8800ff") return "blue";
                                if (hexColor === "#ff8800") return "orange";
                                return "blue"; // default
                            };
                            const colorName = getColorName(player.color);
                            const animSrc = `/animations/monopoly-${colorName}-${
                                isHotel ? "hotel" : "house"
                            }.gif?t=${Date.now()}`;

                            return (
                                <motion.div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        <img
                                            src={animSrc}
                                            alt="Building animation"
                                            className="w-64 h-64"
                                        />
                                    </motion.div>
                                </motion.div>
                            );
                        }

                        if (recentlyPurchasedId !== null) {
                            return (
                                <motion.div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="text-white text-6xl font-bold"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        Building...
                                    </motion.div>
                                </motion.div>
                            );
                        }

                        return null;
                    })()}
            </AnimatePresence>
        </div>
    );
};

export default MonopolyGame;
