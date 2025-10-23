"use client";

import { useCallback, useEffect, useState } from "react";
import GameBoard from "../../games/monopoly/components/GameBoard";
import PlayerStats from "../../games/monopoly/components/PlayerStats";
import Chat from "../../games/monopoly/components/Chat";
import Controls from "../../games/monopoly/components/Controls";
import Modals from "../../games/monopoly/components/Modals";
import { Card, GameState, Player, Property, TradeDetails } from "@/types";
import FactionStatus from "@/components/games/monopoly/components/FactionStatus";
import PropertyPortfolio from "@/components/games/monopoly/components/PropertyPortfolio";
import StoryEvents from "@/components/games/monopoly/components/StoryEvent";
import GameAnalytics from "@/components/games/monopoly/components/GameAnalytics";
import TradeModal from "../../games/monopoly/components/TradeModal";
import { motion, AnimatePresence } from "framer-motion";
import GameLog from "../../games/monopoly/components/GameLog";
import { socket } from "@/lib/socketClient";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";

const MonopolyGame = ({
    gameState,
    player,
    isAnimating,
    setIsAnimating,
    lastRollResult,
}: {
    gameState: GameState;
    player: Player | undefined;
    isAnimating: boolean;
    setIsAnimating: (state: boolean) => void;
    lastRollResult: [number, number] | null;
}) => {
    const params = useParams();
    const { id: roomId } = params;
    const { address } = useAccount();
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [shouldAnimateDice, setShouldAnimateDice] = useState(false);

    const onDiceAnimationComplete = useCallback(() => {
        setShouldAnimateDice(false);
    }, []);
    const [modalProperty, setModalProperty] = useState<Property | null>(null);
    const [modalCard, setModalCard] = useState<Card | null>(null);
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
    const [buildingAnimKey, setBuildingAnimKey] = useState(0);
    const [stagedPlayerPositions, setStagedPlayerPositions] = useState(
        gameState.players.map((p) => ({ id: p.id, position: p.position }))
    );
    const [delayedGameLog, setDelayedGameLog] = useState(gameState.gameLog);

    useEffect(() => {
        const newPositions = gameState.players.map((p) => ({
            id: p.id,
            position: p.position,
        }));

        if (!isAnimating) {
            setStagedPlayerPositions(newPositions);
            setDelayedGameLog(gameState.gameLog);
            return;
        }

        const delayTimer = setTimeout(() => {
            setStagedPlayerPositions(newPositions);
            setDelayedGameLog(gameState.gameLog);
            setIsAnimating(false);
        }, 1000);

        return () => {
            clearTimeout(delayTimer);
        };
    }, [gameState.gameLog]);

    const handleRollDice = () => {
        setShouldAnimateDice(true);
        socket.emit("player_action", {
            roomId,
            action: { type: "ROLL_DICE" },
            address,
        });
    };

    const handleEndTurn = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "END_TURN" },
            address,
        });
    };

    const handleBuyProperty = (propertyId: number) => {
        socket.emit("player_action", {
            roomId,
            action: { type: "BUY_PROPERTY", payload: { propertyId } },
            address,
        });
        setRecentlyPurchasedId(propertyId);
    };

    const handleBuyHouse = (propertyId: number) => {
        socket.emit("player_action", {
            roomId,
            action: { type: "BUY_HOUSE", payload: { propertyId } },
            address,
        });
        setBuildingPropertyId(propertyId);
    };

    useEffect(() => {
        if (recentlyPurchasedId !== null) {
            const timer = setTimeout(() => {
                setRecentlyPurchasedId(null);
            }, 1000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [recentlyPurchasedId]);

    useEffect(() => {
        if (recentlyBuiltId !== null) {
            const timer = setTimeout(() => {
                setRecentlyBuiltId(null);
            }, 3000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [recentlyBuiltId]);

    useEffect(() => {
        if (buildingPropertyId !== null) {
            const timer = setTimeout(() => {
                setBuildingPropertyId(null);
            }, 3000); // Animation duration

            setBuildingAnimKey((prev) => prev + 1);

            return () => clearTimeout(timer);
        }
    }, [buildingPropertyId]);

    const handleTrade = (tradeDetails: TradeDetails) => {
        socket.emit("player_action", {
            roomId,
            action: { type: "TRADE", payload: tradeDetails },
            address,
        });
        setIsTradeModalOpen(false);
    };

    const handlePayJailFine = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "PAY_JAIL_FINE" },
            address,
        });
    };

    const useGetOutOfJailCard = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "USE_JAIL_CARD" },
            address,
        });
    };

    const handleStartGame = () => {
        socket.emit("player_action", {
            roomId,
            action: { type: "START_GAME" },
            address,
        });
    };

    const inspectProperty = (propertyId: number) => {
        const property = gameState.properties[propertyId];
        const railroad = gameState.railroads[propertyId];
        const utility = gameState.utilities[propertyId];

        if (property) {
            setInspectedProperty({ ...property, id: propertyId });
        } else if (railroad) {
            const railroadProperty: Property = {
                id: propertyId,
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
                id: propertyId,
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

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isCurrentPlayerTurn = player?.id === currentPlayer.id;

    const currentPropertyId = currentPlayer.position;
    const propertyOnCurrentSquare = gameState.properties[currentPropertyId];
    const isPropertyBuyable =
        propertyOnCurrentSquare && !propertyOnCurrentSquare.owner;

    const onBuyProperty = (propertyId: number) => {
        handleBuyProperty(propertyId);
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
                    gameState={{
                        ...gameState,
                        players: gameState.players.map((player) => {
                            const stagedPos = stagedPlayerPositions.find(
                                (p) => p.id === player.id
                            )?.position;
                            return stagedPos !== undefined
                                ? { ...player, position: stagedPos }
                                : player;
                        }),
                    }}
                    recentlyPurchasedId={recentlyPurchasedId}
                    recentlyBuiltId={recentlyBuiltId}
                    inspectProperty={inspectProperty}
                />
                {!gameState.gameStarted ? (
                    <div>
                        {player?.id === gameState.players[0].id ? (
                            <button
                                onClick={handleStartGame}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-2xl z-10"
                            >
                                Start Game
                            </button>
                        ) : (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl flex flex-col items-center gap-4">
                                <svg
                                    className="animate-spin h-8 w-8 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Waiting for host to start the game...
                            </div>
                        )}
                    </div>
                ) : (
                    <Controls
                        onRollDice={handleRollDice}
                        onEndTurn={handleEndTurn}
                        onBuyProperty={handleBuyProperty}
                        lastRoll={lastRollResult}
                        hasRolled={gameState.hasRolled}
                        inJail={currentPlayer?.inJail || false}
                        onPayJailFine={handlePayJailFine}
                        onUseJailCard={useGetOutOfJailCard}
                        hasJailCard={false}
                        shouldAnimateDice={shouldAnimateDice}
                        onDiceAnimationComplete={onDiceAnimationComplete}
                        isCurrentPlayerTurn={isCurrentPlayerTurn}
                        currentPropertyId={
                            isPropertyBuyable ? currentPropertyId : null
                        }
                    />
                )}
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto h-screen scroll-hide">
                <Chat messages={[]} />
                <GameLog events={delayedGameLog} />
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
                            }.gif`;

                            return (
                                <motion.div
                                    key={buildingAnimKey}
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
