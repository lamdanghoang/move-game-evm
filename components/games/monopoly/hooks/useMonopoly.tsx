import { useState, useEffect } from "react";
import {
    GameState,
    Player,
    Property,
    Card,
    GameEvent,
    TradeDetails,
} from "@/types";

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

const useMonopoly = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [modalProperty, setModalProperty] = useState<Property | null>(null);
    const [modalCard, setModalCard] = useState<Card | null>(null);
    const [inspectedProperty, setInspectedProperty] = useState<Property | null>(
        null
    );
    const [hasRolled, setHasRolled] = useState(false);
    const [animation, setAnimation] = useState<{
        playerId: number;
        startPosition: number;
        endPosition: number;
        currentPosition: number;
    } | null>(null);

    const addLog = (text: string) => {
        setGameState((prev) => {
            if (!prev) return null;
            const newLogEntry: GameEvent = {
                time: new Date().toLocaleTimeString(),
                text,
            };
            return {
                ...prev,
                gameLog: [...prev.gameLog, newLogEntry],
            };
        });
    };

    const closeModal = () => {
        setModalProperty(null);
        setModalCard(null);
    };

    const inspectProperty = (propertyId: number) => {
        if (!gameState) return;
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

    const closeInspectModal = () => {
        setInspectedProperty(null);
    };

    useEffect(() => {
        const initialGameState: GameState = {
            players: [
                {
                    id: 1,
                    name: "Player 1",
                    color: "#00ff88",
                    money: 1500,
                    position: 0,
                    properties: [],
                    inJail: false,
                    jailTurns: 0,
                },
                {
                    id: 2,
                    name: "Player 2",
                    color: "#ff0088",
                    money: 1500,
                    position: 0,
                    properties: [],
                    inJail: false,
                    jailTurns: 0,
                },
                {
                    id: 3,
                    name: "Player 3",
                    color: "#8800ff",
                    money: 1500,
                    position: 0,
                    properties: [],
                    inJail: false,
                    jailTurns: 0,
                },
                {
                    id: 4,
                    name: "Player 4",
                    color: "#ff8800",
                    money: 1500,
                    position: 0,
                    properties: [],
                    inJail: false,
                    jailTurns: 0,
                },
            ],
            currentPlayerIndex: 0,
            gameStarted: true,
            gameWon: false,
            winner: null,
            gameStartTime: Date.now(),
            totalTransactions: 0,
            doubleRollCount: 0,
            lastRoll: [0, 0],
            properties: {
                1: {
                    name: "Virtual Plaza",
                    group: "brown",
                    price: 60,
                    rent: [2, 10, 30, 90, 160, 250],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                3: {
                    name: "Neon District",
                    group: "brown",
                    price: 80,
                    rent: [4, 20, 60, 180, 320, 450],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                6: {
                    name: "Cyber Avenue",
                    group: "light_blue",
                    price: 100,
                    rent: [6, 30, 90, 270, 400, 550],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                8: {
                    name: "Data Street",
                    group: "light_blue",
                    price: 100,
                    rent: [6, 30, 90, 270, 400, 550],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                9: {
                    name: "Matrix Boulevard",
                    group: "light_blue",
                    price: 120,
                    rent: [8, 40, 100, 300, 450, 600],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                11: {
                    name: "Tech Central",
                    group: "pink",
                    price: 140,
                    rent: [10, 50, 150, 450, 625, 750],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                13: {
                    name: "AI Labs",
                    group: "pink",
                    price: 140,
                    rent: [10, 50, 150, 450, 625, 750],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                14: {
                    name: "Neural Network",
                    group: "pink",
                    price: 160,
                    rent: [12, 60, 180, 500, 700, 900],
                    owner: null,
                    houses: 0,
                    housePrice: 50,
                },
                16: {
                    name: "Quantum Plaza",
                    group: "orange",
                    price: 180,
                    rent: [14, 70, 200, 550, 750, 950],
                    owner: null,
                    houses: 0,
                    housePrice: 100,
                },
                18: {
                    name: "Hologram Heights",
                    group: "orange",
                    price: 180,
                    rent: [14, 70, 200, 550, 750, 950],
                    owner: null,
                    houses: 0,
                    housePrice: 100,
                },
                19: {
                    name: "Crypto Corner",
                    group: "orange",
                    price: 200,
                    rent: [16, 80, 220, 600, 800, 1000],
                    owner: null,
                    houses: 0,
                    housePrice: 100,
                },
                21: {
                    name: "Digital Domain",
                    group: "red",
                    price: 220,
                    rent: [18, 90, 250, 700, 875, 1050],
                    owner: null,
                    houses: 0,
                    housePrice: 150,
                },
                23: {
                    name: "Cloud City",
                    group: "red",
                    price: 220,
                    rent: [18, 90, 250, 700, 875, 1050],
                    owner: null,
                    houses: 0,
                    housePrice: 150,
                },
                24: {
                    name: "Meta Metropolis",
                    group: "red",
                    price: 240,
                    rent: [20, 100, 300, 750, 925, 1100],
                    owner: null,
                    houses: 0,
                    housePrice: 150,
                },
                26: {
                    name: "Blockchain Boulevard",
                    group: "yellow",
                    price: 260,
                    rent: [22, 110, 330, 800, 975, 1150],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                27: {
                    name: "NFT Plaza",
                    group: "yellow",
                    price: 260,
                    rent: [22, 110, 330, 800, 975, 1150],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                29: {
                    name: "Token Tower",
                    group: "yellow",
                    price: 280,
                    rent: [24, 120, 360, 850, 1025, 1200],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                31: {
                    name: "Cyberpunk Central",
                    group: "green",
                    price: 300,
                    rent: [26, 130, 390, 900, 1100, 1275],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                32: {
                    name: "Neo Tokyo",
                    group: "green",
                    price: 300,
                    rent: [26, 130, 390, 900, 1100, 1275],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                34: {
                    name: "Future City",
                    group: "green",
                    price: 320,
                    rent: [28, 150, 450, 1000, 1200, 1400],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                37: {
                    name: "Virtual Nexus",
                    group: "dark_blue",
                    price: 350,
                    rent: [35, 175, 500, 1100, 1300, 1500],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
                39: {
                    name: "Digital Paradise",
                    group: "dark_blue",
                    price: 400,
                    rent: [50, 200, 600, 1400, 1700, 2000],
                    owner: null,
                    houses: 0,
                    housePrice: 200,
                },
            },
            railroads: {
                5: { name: "Neural Station", price: 200, owner: null },
                15: { name: "Cyber Station", price: 200, owner: null },
                25: { name: "Virtual Station", price: 200, owner: null },
                35: { name: "Mainframe Station", price: 200, owner: null },
            },
            utilities: {
                12: { name: "Power Grid", price: 150, owner: null },
                28: { name: "Data Center", price: 150, owner: null },
            },
            chanceCards: [
                {
                    text: "Advance to GO and collect 200 credits",
                    action: "move_to_go",
                    amount: 200,
                },
                {
                    text: "Bank error in your favor, collect 200 credits",
                    action: "collect_money",
                    amount: 200,
                },
                {
                    text: "System malfunction, pay 50 credits for repairs",
                    action: "pay_money",
                    amount: 50,
                },
                {
                    text: "Advance to Neural Network",
                    action: "move_to_position",
                    position: 14,
                },
                { text: "Go directly to Jail", action: "go_to_jail" },
                {
                    text: "Make general repairs: Pay 25 credits per house, 100 credits per hotel",
                    action: "repair_buildings",
                },
                {
                    text: "You have been elected chairman of the board, pay each player 50 credits",
                    action: "pay_each_player",
                    amount: 50,
                },
                {
                    text: "Get out of Jail Free",
                    action: "get_out_of_jail_free",
                },
            ],
            communityChestCards: [
                {
                    text: "You won a coding contest! Collect 100 credits",
                    action: "collect_money",
                    amount: 100,
                },
                {
                    text: "Server maintenance fee, pay 100 credits",
                    action: "pay_money",
                    amount: 100,
                },
                {
                    text: "Crypto investment pays off! Collect 200 credits",
                    action: "collect_money",
                    amount: 200,
                },
                {
                    text: "Tax refund! Collect 20 credits",
                    action: "collect_money",
                    amount: 20,
                },
                {
                    text: "Go directly to GO and collect 200 credits",
                    action: "move_to_go",
                    amount: 200,
                },
                {
                    text: "Get out of Jail Free",
                    action: "get_out_of_jail_free",
                },
            ],
            gameLog: [],
        };
        setGameState(initialGameState);
    }, []);

    useEffect(() => {
        if (!animation) return;

        const { playerId, endPosition, currentPosition } = animation;

        if (currentPosition === endPosition) {
            setAnimation(null);
            const player = gameState!.players.find((p) => p.id === playerId)!;
            handleSquareLanding(player, player.position);
            return;
        }

        const timeout = setTimeout(() => {
            const nextPosition = (currentPosition + 1) % 40;
            setGameState((prev) => ({
                ...prev!,
                players: prev!.players.map((p) =>
                    p.id === playerId ? { ...p, position: nextPosition } : p
                ),
            }));
            setAnimation({
                ...animation,
                currentPosition: nextPosition,
            });
        }, 200);

        return () => clearTimeout(timeout);
    }, [animation, gameState]);

    const getCurrentPlayer = () => {
        if (!gameState) return null;
        return gameState.players[gameState.currentPlayerIndex];
    };

    const nextPlayer = () => {
        if (!gameState) return;
        setGameState((prev) => ({
            ...prev!,
            currentPlayerIndex:
                (prev!.currentPlayerIndex + 1) % prev!.players.length,
            doubleRollCount: 0,
        }));
    };

    const addMoney = (playerId: number, amount: number) => {
        if (!gameState) return;
        setGameState((prev) => ({
            ...prev!,
            players: prev!.players.map((p) =>
                p.id === playerId ? { ...p, money: p.money + amount } : p
            ),
            totalTransactions: prev!.totalTransactions + 1,
        }));
    };

    const subtractMoney = (playerId: number, amount: number) => {
        if (!gameState) return;
        setGameState((prev) => {
            const player = prev!.players.find((p) => p.id === playerId);
            if (!player) return prev!;

            const newMoney = Math.max(0, player.money - amount);
            const updatedPlayers = prev!.players.map((p) =>
                p.id === playerId ? { ...p, money: newMoney } : p
            );

            if (newMoney === 0 && getTotalAssets(player) === 0) {
                addLog(`${player.name} has gone bankrupt!`);
                return handleBankruptcy(player, {
                    ...prev!,
                    players: updatedPlayers,
                });
            }

            return {
                ...prev!,
                players: updatedPlayers,
                totalTransactions: prev!.totalTransactions + 1,
            };
        });
    };

    const getTotalAssets = (player: Player) => {
        if (!gameState) return 0;
        let totalValue = player.money;

        player.properties.forEach((propertyId) => {
            if (gameState.properties[propertyId]) {
                totalValue += gameState.properties[propertyId].price;
            } else if (gameState.railroads[propertyId]) {
                totalValue += gameState.railroads[propertyId].price;
            } else if (gameState.utilities[propertyId]) {
                totalValue += gameState.utilities[propertyId].price;
            }
        });

        return totalValue;
    };

    const handleBankruptcy = (player: Player, currentState: GameState) => {
        const updatedProperties = { ...currentState.properties };
        const updatedRailroads = { ...currentState.railroads };
        const updatedUtilities = { ...currentState.utilities };

        player.properties.forEach((propertyId) => {
            if (updatedProperties[propertyId]) {
                updatedProperties[propertyId].owner = null;
                updatedProperties[propertyId].houses = 0;
            } else if (updatedRailroads[propertyId]) {
                updatedRailroads[propertyId].owner = null;
            } else if (updatedUtilities[propertyId]) {
                updatedUtilities[propertyId].owner = null;
            }
        });

        const playerIndex = currentState.players.findIndex(
            (p) => p.id === player.id
        );
        const newPlayers = currentState.players.filter(
            (p) => p.id !== player.id
        );
        let newCurrentPlayerIndex = currentState.currentPlayerIndex;

        if (newCurrentPlayerIndex >= playerIndex) {
            newCurrentPlayerIndex = Math.max(0, newCurrentPlayerIndex - 1);
        }

        const gameWon = newPlayers.length === 1;
        const winner = gameWon ? newPlayers[0] : null;

        return {
            ...currentState,
            properties: updatedProperties,
            railroads: updatedRailroads,
            utilities: updatedUtilities,
            players: newPlayers,
            currentPlayerIndex: newCurrentPlayerIndex,
            gameWon,
            winner,
        };
    };

    const payRent = (payerId: number, propertyPosition: number) => {
        if (!gameState) return;

        const property = gameState.properties[propertyPosition];
        const railroad = gameState.railroads[propertyPosition];
        const utility = gameState.utilities[propertyPosition];

        const item = property || railroad || utility;

        if (!item || !item.owner || item.owner === payerId) {
            return;
        }

        const ownerId = item.owner;
        let rentAmount = 0;

        if (property) {
            // Rent for properties is based on the number of houses.
            rentAmount = property.rent[property.houses];
        } else if (railroad) {
            const owner = gameState.players.find((p) => p.id === ownerId);
            if (owner) {
                const railroadCount = owner.properties.filter(
                    (p) => gameState.railroads[p]
                ).length;
                // Rent for railroads: 1 owned: 25, 2 owned: 50, 3 owned: 100, 4 owned: 200
                rentAmount = 25 * Math.pow(2, railroadCount - 1);
            }
        } else if (utility) {
            const owner = gameState.players.find((p) => p.id === ownerId);
            if (owner) {
                const utilityCount = owner.properties.filter(
                    (p) => gameState.utilities[p]
                ).length;
                const lastRollTotal =
                    gameState.lastRoll[0] + gameState.lastRoll[1];
                // If one utility is owned, rent is 4 times amount shown on dice.
                // If both are owned, rent is 10 times amount shown on dice.
                rentAmount =
                    utilityCount === 1 ? lastRollTotal * 4 : lastRollTotal * 10;
            }
        }

        if (rentAmount > 0) {
            const owner = gameState.players.find((p) => p.id === ownerId);
            addLog(
                `${
                    gameState.players.find((p) => p.id === payerId)?.name
                } paid ${rentAmount} credits in rent to ${owner?.name}.`
            );
            subtractMoney(payerId, rentAmount);
            addMoney(ownerId, rentAmount);
        }
    };

    const getGameDuration = () => {
        if (!gameState) return "00:00";
        const elapsed = Date.now() - gameState.gameStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handleRollDice = () => {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || hasRolled) return;

        if (currentPlayer.inJail) {
            handleJailRoll();
            return;
        }

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        const isDouble = dice1 === dice2;

        setTimeout(() => {
            addLog(
                `${currentPlayer.name} rolled a ${total} (${dice1} + ${dice2})${
                    isDouble ? " (double)" : ""
                }`
            );
        }, 1000);

        setGameState((prev) => ({
            ...prev!,
            lastRoll: [dice1, dice2],
            doubleRollCount: isDouble ? prev!.doubleRollCount + 1 : 0,
        }));

        if (isDouble && gameState!.doubleRollCount >= 2) {
            setTimeout(() => {
                addLog(
                    `${currentPlayer.name} rolled three doubles in a row and went to jail!`
                );
            }, 1000);
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
            addLog(
                `${currentPlayer.name} passed GO and collected 200 credits.`
            );
            addMoney(currentPlayer.id, 200);
        }

        setTimeout(() => {
            setAnimation({
                playerId: currentPlayer.id,
                startPosition: oldPosition,
                endPosition: newPosition,
                currentPosition: oldPosition,
            });
        }, 1400);

        if (!isDouble) {
            setHasRolled(true);
        }
    };

    const handleJailRoll = () => {
        const currentPlayer = getCurrentPlayer();

        if (!currentPlayer) return;

        const dice1 = Math.floor(Math.random() * 6) + 1;

        const dice2 = Math.floor(Math.random() * 6) + 1;

        const isDouble = dice1 === dice2;

        setTimeout(() => {
            addLog(
                `${
                    currentPlayer.name
                } is in jail and rolled a ${dice1} + ${dice2}${
                    isDouble ? " (double)" : ""
                }`
            );
        }, 1000);

        setGameState((prev) => ({ ...prev!, lastRoll: [dice1, dice2] }));

        if (isDouble) {
            setTimeout(() => {
                addLog(
                    `${currentPlayer.name} rolled a double and got out of jail!`
                );
            }, 1000);

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
                setTimeout(() => {
                    addLog(
                        `${currentPlayer.name} did not roll a double for 3 turns and paid 50 credits to get out of jail.`
                    );
                }, 1000);

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
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        addLog(`${currentPlayer.name} paid 50 credits to get out of jail.`);
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
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        addLog(`${currentPlayer.name} used a Get Out of Jail Free card.`);
        // This should be handled by a card state
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

    const [recentlyPurchasedId, setRecentlyPurchasedId] = useState<
        number | null
    >(null);
    const [recentlyBuiltId, setRecentlyBuiltId] = useState<number | null>(null);
    const [buildingPropertyId, setBuildingPropertyId] = useState<number | null>(
        null
    );

    useEffect(() => {
        if (recentlyPurchasedId) {
            const timer = setTimeout(() => setRecentlyPurchasedId(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [recentlyPurchasedId]);

    useEffect(() => {
        if (recentlyBuiltId) {
            const timer = setTimeout(() => setRecentlyBuiltId(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [recentlyBuiltId]);

    useEffect(() => {
        if (buildingPropertyId) {
            const timer = setTimeout(() => setBuildingPropertyId(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [buildingPropertyId]);

    const handleBuyProperty = () => {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        const property =
            gameState!.properties[currentPlayer.position] ||
            gameState!.railroads[currentPlayer.position] ||
            gameState!.utilities[currentPlayer.position];
        if (
            property &&
            !property.owner &&
            currentPlayer.money >= property.price
        ) {
            addLog(
                `${currentPlayer.name} bought ${property.name} for ${property.price} credits.`
            );
            subtractMoney(currentPlayer.id, property.price);
            const newProperties = { ...gameState!.properties };
            if (newProperties[currentPlayer.position]) {
                newProperties[currentPlayer.position].owner = currentPlayer.id;
            }
            const newRailroads = { ...gameState!.railroads };
            if (newRailroads[currentPlayer.position]) {
                newRailroads[currentPlayer.position].owner = currentPlayer.id;
            }
            const newUtilities = { ...gameState!.utilities };
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
            setRecentlyPurchasedId(currentPlayer.position);
        }
    };

    const handleBuyHouse = (propertyId: number) => {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        const property = gameState!.properties[propertyId];
        if (!property || property.owner !== currentPlayer.id) return;

        const colorGroup = property.group;
        const groupProperties = Object.values(gameState!.properties).filter(
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
            addLog(
                `${currentPlayer.name} bought a house on ${property.name} for ${property.housePrice} credits.`
            );
            subtractMoney(currentPlayer.id, property.housePrice);
            const newProperties = { ...gameState!.properties };
            newProperties[propertyId].houses++;
            setGameState((prev) => ({
                ...prev!,
                properties: newProperties,
            }));
            setRecentlyBuiltId(propertyId);
            setBuildingPropertyId(propertyId);
        }
    };

    const handleSquareLanding = (player: Player, position: number) => {
        const square = squares[position];
        addLog(`${player.name} landed on ${square.name}`);
        switch (square.type) {
            case "property":
            case "railroad":
            case "utility":
                const actualProperty = gameState!.properties[position];
                const actualRailroad = gameState!.railroads[position];
                const actualUtility = gameState!.utilities[position];

                let modalProp: Property | null = null;

                if (actualProperty) {
                    modalProp = actualProperty;
                } else if (actualRailroad) {
                    // Create the full Property structure for Railroad
                    modalProp = {
                        name: actualRailroad.name,
                        price: actualRailroad.price,
                        owner: actualRailroad.owner,
                        group: "railroad",
                        rent: [25, 50, 100, 200], // Example rents
                        houses: 0,
                        housePrice: 0,
                    };
                } else if (actualUtility) {
                    // Create the full Property structure for Utility
                    modalProp = {
                        name: actualUtility.name,
                        price: actualUtility.price,
                        owner: actualUtility.owner,
                        group: "utility",
                        rent: [], // Rent is special for Utilities, so an empty array is fine
                        houses: 0,
                        housePrice: 0,
                    };
                }

                if (modalProp && !modalProp.owner) {
                    setModalProperty(modalProp); // Pass the new, full Property object
                } else if (modalProp && modalProp.owner !== player.id) {
                    payRent(player.id, position);
                }
                break;
            case "chance":
                const chanceCard =
                    gameState!.chanceCards[
                        Math.floor(
                            Math.random() * gameState!.chanceCards.length
                        )
                    ];
                setModalCard(chanceCard);
                addLog(
                    `${player.name} landed on Quantum Chance and drew a card: ${chanceCard.text}`
                );
                handleCardAction(player, chanceCard);
                break;
            case "community_chest":
                const communityChestCard =
                    gameState!.communityChestCards[
                        Math.floor(
                            Math.random() *
                                gameState!.communityChestCards.length
                        )
                    ];
                setModalCard(communityChestCard);
                addLog(
                    `${player.name} landed on System Chest and drew a card: ${communityChestCard.text}`
                );
                handleCardAction(player, communityChestCard);
                break;
            case "tax":
                addLog(
                    `${player.name} paid ${square.amount} credits in ${square.name}.`
                );
                subtractMoney(player.id, square.amount || 0);
                break;
            case "go_to_jail":
                addLog(`${player.name} went to jail!`);
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
                    const property = gameState!.properties[propertyId];
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
                    const property = gameState!.properties[propertyId];
                    if (property && property.houses === 5) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);
                subtractMoney(player.id, houses * 25 + hotels * 100);
                break;
            case "get_out_of_jail_free":
                // setGetOutOfJailCard(true);
                break;
            case "pay_each_player":
                gameState!.players.forEach((p) => {
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

    const handleTrade = (tradeDetails: TradeDetails) => {
        const {
            fromPlayerId,
            toPlayerId,
            offeredProperties,
            requestedProperties,
            offeredMoney,
            requestedMoney,
        } = tradeDetails;

        const fromPlayer = gameState!.players.find(
            (p) => p.id === fromPlayerId
        );
        const toPlayer = gameState!.players.find((p) => p.id === toPlayerId);

        if (!fromPlayer || !toPlayer) return;

        addLog(`${fromPlayer.name} and ${toPlayer.name} are trading.`);

        // Money transfer
        subtractMoney(fromPlayerId, offeredMoney);
        addMoney(toPlayerId, offeredMoney);
        subtractMoney(toPlayerId, requestedMoney);
        addMoney(fromPlayerId, requestedMoney);

        // Property transfer
        const newProperties = { ...gameState!.properties };
        const newRailroads = { ...gameState!.railroads };
        const newUtilities = { ...gameState!.utilities };

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
    };

    return {
        gameState,
        setGameState,
        getCurrentPlayer,
        nextPlayer,
        addMoney,
        subtractMoney,
        getGameDuration,
        payRent,
        modalProperty,
        modalCard,
        closeModal,
        squares,
        hasRolled,
        handleRollDice,
        handleEndTurn,
        handleBuyProperty,
        handleBuyHouse,
        handlePayJailFine,
        useGetOutOfJailCard,
        handleTrade,
        recentlyPurchasedId,
        recentlyBuiltId,
        buildingPropertyId,
        inspectedProperty,
        inspectProperty,
        closeInspectModal,
    };
};

export default useMonopoly;
