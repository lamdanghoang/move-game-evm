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

const MonopolyGame = () => {
    const {
        gameState,
        setGameState,
        getCurrentPlayer,
        nextPlayer,
        addMoney,
        subtractMoney,
        getGameDuration,
    } = useMonopoly();

    const [modalProperty, setModalProperty] = useState<Property | null>(null);
    const [modalCard, setModalCard] = useState<Card | null>(null);

    if (!gameState) {
        return <div>Loading...</div>;
    }

    const currentPlayer = getCurrentPlayer();

    const handleRollDice = () => {
        if (!currentPlayer) return;

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
            // nextPlayer();
        }
    };

    const handleEndTurn = () => {
        nextPlayer();
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
                    // Pay rent
                }
                break;
            case "chance":
                const chanceCard =
                    gameState.chanceCards[
                        Math.floor(Math.random() * gameState.chanceCards.length)
                    ];
                setModalCard(chanceCard);
                break;
            case "community_chest":
                const communityChestCard =
                    gameState.communityChestCards[
                        Math.floor(
                            Math.random() * gameState.communityChestCards.length
                        )
                    ];
                setModalCard(communityChestCard);
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

    const squares = [
        { name: "GO", type: "go" },
        { name: "Virtual Plaza", type: "property", group: "brown" },
        { name: "System Chest", type: "community_chest" },
        { name: "Neon District", type: "property", group: "brown" },
        { name: "Data Tax", type: "tax", amount: 200 },
        { name: "Neural Station", type: "railroad" },
        { name: "Cyber Avenue", type: "property", group: "light_blue" },
        { name: "Quantum Chance", type: "chance" },
        { name: "Data Street", type: "property", group: "light_blue" },
        { name: "Matrix Boulevard", type: "property", group: "light_blue" },
        { name: "Jail", type: "jail" },
        { name: "Tech Central", type: "property", group: "pink" },
        { name: "Power Grid", type: "utility" },
        { name: "AI Labs", type: "property", group: "pink" },
        { name: "Neural Network", type: "property", group: "pink" },
        { name: "Cyber Station", type: "railroad" },
        { name: "Quantum Plaza", type: "property", group: "orange" },
        { name: "System Chest", type: "community_chest" },
        { name: "Hologram Heights", type: "property", group: "orange" },
        { name: "Crypto Corner", type: "property", group: "orange" },
        { name: "Free Parking", type: "free_parking" },
        { name: "Digital Domain", type: "property", group: "red" },
        { name: "Quantum Chance", type: "chance" },
        { name: "Cloud City", type: "property", group: "red" },
        { name: "Meta Metropolis", type: "property", group: "red" },
        { name: "Virtual Station", type: "railroad" },
        { name: "Blockchain Boulevard", type: "property", group: "yellow" },
        { name: "NFT Plaza", type: "property", group: "yellow" },
        { name: "Data Center", type: "utility" },
        { name: "Token Tower", type: "property", group: "yellow" },
        { name: "Go to Jail", type: "go_to_jail" },
        { name: "Cyberpunk Central", type: "property", group: "green" },
        { name: "Neo Tokyo", type: "property", group: "green" },
        { name: "System Chest", type: "community_chest" },
        { name: "Future City", type: "property", group: "green" },
        { name: "Mainframe Station", type: "railroad" },
        { name: "Quantum Chance", type: "chance" },
        { name: "Virtual Nexus", type: "property", group: "dark_blue" },
        { name: "System Tax", type: "tax", amount: 100 },
        { name: "Digital Paradise", type: "property", group: "dark_blue" },
    ];

    return (
        <div className="grid grid-cols-[300px_1fr_300px] h-screen gap-4 p-4 max-w-[1600px] mx-auto my-0">
            <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100%-4rem)]">
                {currentPlayer && (
                    <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100%-4rem)]">
                        <PlayerStats player={currentPlayer} />
                        <FactionStatus />
                        <PropertyPortfolio />
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
        </div>
    );
};

export default MonopolyGame;
