"use client";

import { useState } from "react";
import useMonopoly from "../../games/monopoly/hooks/useMonopoly";
import GameBoard from "../../games/monopoly/components/GameBoard";
import PlayerStats from "../../games/monopoly/components/PlayerStats";
import Chat from "../../games/monopoly/components/Chat";
import Controls from "../../games/monopoly/components/Controls";
import Modals from "../../games/monopoly/components/Modals";
import { Card, Player, Property } from "@/types";
import FactionStatus from "@/components/games/monopoly/components/FactionStatus";
import PropertyPortfolio from "@/components/games/monopoly/components/PropertyPortfolio";
import StoryEvents from "@/components/games/monopoly/components/StoryEvent";
import GameAnalytics from "@/components/games/monopoly/components/GameAnalytics";
import TradeModal from "../../games/monopoly/components/TradeModal";

const MonopolyGame = () => {
    const {
        gameState,
        setGameState,
        getCurrentPlayer,
        nextPlayer,
        addMoney,
        subtractMoney,
        getGameDuration,
        payRent,
        squares,
    } = useMonopoly();

    const [modalProperty, setModalProperty] = useState<Property | null>(null);
    const [modalCard, setModalCard] = useState<Card | null>(null);
    const [getOutOfJailCard, setGetOutOfJailCard] = useState(false);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [hasRolled, setHasRolled] = useState(false);

    if (!gameState) {
        return <div className="my-20 text-center">Loading...</div>;
    }

    const currentPlayer = getCurrentPlayer();

    const handleRollDice = () => {
        if (!currentPlayer || hasRolled) return;

        if (currentPlayer.inJail) {
            handleJailRoll();
            return;
        }

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        const isDouble = dice1 === dice2;

        setGameState((prev) => ({
            ...prev!,
            lastRoll: [dice1, dice2],
            doubleRollCount: isDouble ? prev!.doubleRollCount + 1 : 0,
        }));

        if (isDouble && gameState.doubleRollCount >= 2) {
            // Go to jail
            setGameState((prev) => ({
                ...prev!,
                players: prev!.players.map((p) =>
                    p.id === currentPlayer.id
                        ? { ...p, inJail: true, position: 10 }
                        : p
                ),
            }));
            nextPlayer();
            return;
        }

        const oldPosition = currentPlayer.position;
        const newPosition = (oldPosition + total) % 40;

        if (newPosition < oldPosition) {
            addMoney(currentPlayer.id, 200);
        }

        setGameState((prev) => ({
            ...prev!,
            players: prev!.players.map((p) =>
                p.id === currentPlayer.id ? { ...p, position: newPosition } : p
            ),
        }));

        handleSquareLanding(currentPlayer, newPosition);

        if (!isDouble) {
            setHasRolled(true);
        }
    };

    const handleJailRoll = () => {
        if (!currentPlayer) return;

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const isDouble = dice1 === dice2;

        if (isDouble) {
            setGameState((prev) => ({
                ...prev!,
                players: prev!.players.map((p) =>
                    p.id === currentPlayer.id
                        ? { ...p, inJail: false, jailTurns: 0 }
                        : p
                ),
            }));
        } else {
            setGameState((prev) => ({
                ...prev!,
                players: prev!.players.map((p) =>
                    p.id === currentPlayer.id
                        ? { ...p, jailTurns: p.jailTurns + 1 }
                        : p
                ),
            }));
            if (currentPlayer.jailTurns >= 2) {
                subtractMoney(currentPlayer.id, 50);
                setGameState((prev) => ({
                    ...prev!,
                    players: prev!.players.map((p) =>
                        p.id === currentPlayer.id
                            ? { ...p, inJail: false, jailTurns: 0 }
                            : p
                    ),
                }));
            }
            nextPlayer();
        }
    };

    const handlePayJailFine = () => {
        if (!currentPlayer) return;
        subtractMoney(currentPlayer.id, 50);
        setGameState((prev) => ({
            ...prev!,
            players: prev!.players.map((p) =>
                p.id === currentPlayer.id
                    ? { ...p, inJail: false, jailTurns: 0 }
                    : p
            ),
        }));
    };

    const useGetOutOfJailCard = () => {
        if (!currentPlayer || !getOutOfJailCard) return;
        setGetOutOfJailCard(false);
        setGameState((prev) => ({
            ...prev!,
            players: prev!.players.map((p) =>
                p.id === currentPlayer.id
                    ? { ...p, inJail: false, jailTurns: 0 }
                    : p
            ),
        }));
    };

    const handleEndTurn = () => {
        nextPlayer();
        setHasRolled(false);
    };

    const handleBuyProperty = () => {
        if (!currentPlayer) return;
        const property =
            gameState.properties[currentPlayer.position] ||
            gameState.railroads[currentPlayer.position] ||
            gameState.utilities[currentPlayer.position];
        if (
            property &&
            !property.owner &&
            currentPlayer.money >= property.price
        ) {
            subtractMoney(currentPlayer.id, property.price);
            const newProperties = { ...gameState.properties };
            if (newProperties[currentPlayer.position]) {
                newProperties[currentPlayer.position].owner = currentPlayer.id;
            }
            const newRailroads = { ...gameState.railroads };
            if (newRailroads[currentPlayer.position]) {
                newRailroads[currentPlayer.position].owner = currentPlayer.id;
            }
            const newUtilities = { ...gameState.utilities };
            if (newUtilities[currentPlayer.position]) {
                newUtilities[currentPlayer.position].owner = currentPlayer.id;
            }
            setGameState((prev) => ({
                ...prev!,
                properties: newProperties,
                railroads: newRailroads,
                utilities: newUtilities,
                players: prev!.players.map((p) =>
                    p.id === currentPlayer.id
                        ? {
                              ...p,
                              properties: [
                                  ...p.properties,
                                  currentPlayer.position,
                              ],
                          }
                        : p
                ),
            }));
        }
    };

    const handleBuyHouse = (propertyId: number) => {
        if (!currentPlayer) return;
        const property = gameState.properties[propertyId];
        if (!property || property.owner !== currentPlayer.id) return;

        const colorGroup = property.group;
        const groupProperties = Object.values(gameState.properties).filter(
            (p) => p.group === colorGroup
        );
        const playerOwnsAll = groupProperties.every(
            (p) => p.owner === currentPlayer.id
        );

        if (
            playerOwnsAll &&
            currentPlayer.money >= property.housePrice &&
            property.houses < 5
        ) {
            subtractMoney(currentPlayer.id, property.housePrice);
            const newProperties = { ...gameState.properties };
            newProperties[propertyId].houses++;
            setGameState((prev) => ({
                ...prev!,
                properties: newProperties,
            }));
        }
    };

    const handleSquareLanding = (player: Player, position: number) => {
        const square = squares[position];
        switch (square.type) {
            case "property":
            case "railroad":
            case "utility":
                const property =
                    gameState.properties[position] ||
                    gameState.railroads[position] ||
                    gameState.utilities[position];
                if (property && !property.owner) {
                    setModalProperty(property);
                } else if (property && property.owner !== player.id) {
                    payRent(player.id, position);
                }
                break;
            case "chance":
                const chanceCard =
                    gameState.chanceCards[
                        Math.floor(Math.random() * gameState.chanceCards.length)
                    ];
                setModalCard(chanceCard);
                handleCardAction(player, chanceCard);
                break;
            case "community_chest":
                const communityChestCard =
                    gameState.communityChestCards[
                        Math.floor(
                            Math.random() * gameState.communityChestCards.length
                        )
                    ];
                setModalCard(communityChestCard);
                handleCardAction(player, communityChestCard);
                break;
            case "go_to_jail":
                setGameState((prev) => ({
                    ...prev!,
                    players: prev!.players.map((p) =>
                        p.id === player.id
                            ? { ...p, inJail: true, position: 10 }
                            : p
                    ),
                }));
                break;
            default:
                break;
        }
    };

    const handleCardAction = (player: Player, card: Card) => {
        switch (card.action) {
            case "move_to_go":
                addMoney(player.id, card.amount || 200);
                setGameState((prev) => ({
                    ...prev!,
                    players: prev!.players.map((p) =>
                        p.id === player.id ? { ...p, position: 0 } : p
                    ),
                }));
                break;
            case "collect_money":
                addMoney(player.id, card.amount || 0);
                break;
            case "pay_money":
                subtractMoney(player.id, card.amount || 0);
                break;
            case "move_to_position":
                setGameState((prev) => ({
                    ...prev!,
                    players: prev!.players.map((p) =>
                        p.id === player.id
                            ? { ...p, position: card.position || p.position }
                            : p
                    ),
                }));
                break;
            case "go_to_jail":
                setGameState((prev) => ({
                    ...prev!,
                    players: prev!.players.map((p) =>
                        p.id === player.id
                            ? { ...p, inJail: true, position: 10 }
                            : p
                    ),
                }));
                break;
            case "repair_buildings":
                const houses = player.properties.reduce((acc, propertyId) => {
                    const property = gameState.properties[propertyId];
                    if (
                        property &&
                        property.houses > 0 &&
                        property.houses < 5
                    ) {
                        return acc + property.houses;
                    }
                    return acc;
                }, 0);
                const hotels = player.properties.reduce((acc, propertyId) => {
                    const property = gameState.properties[propertyId];
                    if (property && property.houses === 5) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);
                subtractMoney(player.id, houses * 25 + hotels * 100);
                break;
            case "get_out_of_jail_free":
                setGetOutOfJailCard(true);
                break;
            case "pay_each_player":
                gameState.players.forEach((p) => {
                    if (p.id !== player.id) {
                        addMoney(p.id, card.amount || 50);
                        subtractMoney(player.id, card.amount || 50);
                    }
                });
                break;
            default:
                break;
        }
    };

    const handleTrade = (tradeDetails: any) => {
        const {
            fromPlayerId,
            toPlayerId,
            offeredProperties,
            requestedProperties,
            offeredMoney,
            requestedMoney,
        } = tradeDetails;

        const fromPlayer = gameState.players.find((p) => p.id === fromPlayerId);
        const toPlayer = gameState.players.find((p) => p.id === toPlayerId);

        if (!fromPlayer || !toPlayer) return;

        // Money transfer
        subtractMoney(fromPlayerId, offeredMoney);
        addMoney(toPlayerId, offeredMoney);
        subtractMoney(toPlayerId, requestedMoney);
        addMoney(fromPlayerId, requestedMoney);

        // Property transfer
        const newProperties = { ...gameState.properties };
        const newRailroads = { ...gameState.railroads };
        const newUtilities = { ...gameState.utilities };

        offeredProperties.forEach((propId: number) => {
            if (newProperties[propId]) newProperties[propId].owner = toPlayerId;
            if (newRailroads[propId]) newRailroads[propId].owner = toPlayerId;
            if (newUtilities[propId]) newUtilities[propId].owner = toPlayerId;
        });

        requestedProperties.forEach((propId: number) => {
            if (newProperties[propId])
                newProperties[propId].owner = fromPlayerId;
            if (newRailroads[propId]) newRailroads[propId].owner = fromPlayerId;
            if (newUtilities[propId]) newUtilities[propId].owner = fromPlayerId;
        });

        setGameState((prev) => ({
            ...prev!,
            properties: newProperties,
            railroads: newRailroads,
            utilities: newUtilities,
            players: prev!.players.map((p) => {
                if (p.id === fromPlayerId) {
                    return {
                        ...p,
                        properties: [
                            ...p.properties.filter(
                                (propId) => !offeredProperties.includes(propId)
                            ),
                            ...requestedProperties,
                        ],
                    };
                }
                if (p.id === toPlayerId) {
                    return {
                        ...p,
                        properties: [
                            ...p.properties.filter(
                                (propId) =>
                                    !requestedProperties.includes(propId)
                            ),
                            ...offeredProperties,
                        ],
                    };
                }
                return p;
            }),
        }));

        setIsTradeModalOpen(false);
    };

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
                onClose={() => {
                    setModalProperty(null);
                    setModalCard(null);
                }}
            />
            <TradeModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                players={gameState.players}
                properties={gameState.properties}
                onTrade={handleTrade}
                currentPlayer={currentPlayer!}
            />
        </div>
    );
};

export default MonopolyGame;
