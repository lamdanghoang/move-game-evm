"use client";

import { useState } from "react";
import GameBoard from "../../games/monopoly/components/GameBoard";
import PlayerStats from "../../games/monopoly/components/PlayerStats";
import Chat from "../../games/monopoly/components/Chat";
import Controls from "../../games/monopoly/components/Controls";
import Modals from "../../games/monopoly/components/Modals";
import { GameState, Player, Property, TradeDetails } from "@/types";
import FactionStatus from "@/components/games/monopoly/components/FactionStatus";
import PropertyPortfolio from "@/components/games/monopoly/components/PropertyPortfolio";
import StoryEvents from "@/components/games/monopoly/components/StoryEvent";
import GameAnalytics from "@/components/games/monopoly/components/GameAnalytics";
import TradeModal from "../../games/monopoly/components/TradeModal";
import { motion, AnimatePresence } from "framer-motion";
import GameLog from "../../games/monopoly/components/GameLog";
import { socket } from "@/lib/socketClient";
import { useParams } from "next/navigation";

const MonopolyGame = ({
    gameState,
    player,
}: {
    gameState: GameState;
    player: Player | undefined;
}) => {
    const params = useParams();
    const { id: roomId } = params;
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [modalProperty, setModalProperty] = useState<Property | null>(null);
    const [modalCard, setModalCard] = useState<any | null>(null);
    const [inspectedProperty, setInspectedProperty] = useState<Property | null>(
        null
    );
    const [recentlyPurchasedId, setRecentlyPurchasedId] = useState<
        number | null
    >(null);
    const [recentlyBuiltId, setRecentlyBuiltId] = useState<number | null>(null);
    const [buildingPropertyId, setBuildingPropertyId] = useState<number | null>(
        null
    );

    const handleRollDice = () => {
        socket.emit("player_action", { roomId, action: { type: "ROLL_DICE" } });
    };

    const handleEndTurn = () => {
        socket.emit("player_action", { roomId, action: { type: "END_TURN" } });
    };

    const handleBuyProperty = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "BUY_PROPERTY" },
        });
    };

    const handleBuyHouse = (propertyId: number) => {
        socket.emit("player_action", {
            roomId,
            action: { type: "BUY_HOUSE", payload: { propertyId } },
        });
    };

    const handleTrade = (tradeDetails: TradeDetails) => {
        socket.emit("player_action", {
            roomId,
            action: { type: "TRADE", payload: tradeDetails },
        });
        setIsTradeModalOpen(false);
    };

    const handlePayJailFine = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "PAY_JAIL_FINE" },
        });
    };

    const useGetOutOfJailCard = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "USE_JAIL_CARD" },
        });
    };

    const inspectProperty = (propertyId: number) => {
        const property = gameState.properties[propertyId];
        const railroad = gameState.railroads[propertyId];
        const utility = gameState.utilities[propertyId];

        if (property) {
            setInspectedProperty(property);
        } else if (railroad) {
            const railroadProperty: Property = {
                name: railroad.name,
                price: railroad.price,
                owner: railroad.owner,
                group: "railroad",
                rent: [25, 50, 100, 200],
                houses: 0,
                housePrice: 0,
            };
            setInspectedProperty(railroadProperty);
        } else if (utility) {
            const utilityProperty: Property = {
                name: utility.name,
                price: utility.price,
                owner: utility.owner,
                group: "utility",
                rent: [],
                houses: 0,
                housePrice: 0,
            };
            setInspectedProperty(utilityProperty);
        }
    };

    const closeModal = () => {
        setModalProperty(null);
        setModalCard(null);
    };

    const closeInspectModal = () => {
        setInspectedProperty(null);
    };

    if (!gameState || !player) {
        return <div className="my-20 text-center">Loading...</div>;
    }

    const currentPlayer =
        gameState.players[gameState.currentPlayerIndex];

    const onBuyProperty = () => {
        handleBuyProperty();
        closeModal();
    };

    const onTrade = (tradeDetails: TradeDetails) => {
        handleTrade(tradeDetails);
        setIsTradeModalOpen(false);
    };

    return (
        <div className="grid grid-cols-[300px_1fr_300px] h-screen gap-4 p-4 max-w-[1600px] mx-auto my-0">
            <div className="flex flex-col gap-4 overflow-y-auto h-screen scroll-hide">
                {currentPlayer && (
                    <PlayerStats
                        players={gameState.players}
                        currentPlayerIndex={gameState.currentPlayerIndex}
                        onTrade={() => setIsTradeModalOpen(true)}
                    />
                )}
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
                    inspectProperty={inspectProperty}
                />
                <Controls
                    onRollDice={handleRollDice}
                    onEndTurn={handleEndTurn}
                    onBuyProperty={handleBuyProperty}
                    lastRoll={gameState.lastRoll}
                    hasRolled={gameState.hasRolled}
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
                onBuyProperty={onBuyProperty}
            />
            <Modals
                property={inspectedProperty}
                card={null}
                onClose={closeInspectModal}
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
                {(buildingPropertyId !== null ||
                    recentlyPurchasedId !== null) &&
                    (() => {
                        if (buildingPropertyId !== null) {
                            const property =
                                gameState.properties[buildingPropertyId];
                            const player = currentPlayer;
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
                                        className="text-white text-4xl font-semibold"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        Buying property...
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
