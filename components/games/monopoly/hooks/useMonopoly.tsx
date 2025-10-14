import { useState, useEffect } from "react";
import { GameState, Player, Property, Card } from "../../../../types";

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

    const closeModal = () => {
        setModalProperty(null);
        setModalCard(null);
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
        };
        setGameState(initialGameState);
    }, []);

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
            const owner = gameState.players.find(p => p.id === ownerId);
            if (owner) {
                const railroadCount = owner.properties.filter(p => gameState.railroads[p]).length;
                // Rent for railroads: 1 owned: 25, 2 owned: 50, 3 owned: 100, 4 owned: 200
                rentAmount = 25 * Math.pow(2, railroadCount - 1);
            }
        } else if (utility) {
            const owner = gameState.players.find(p => p.id === ownerId);
            if (owner) {
                const utilityCount = owner.properties.filter(p => gameState.utilities[p]).length;
                const lastRollTotal = gameState.lastRoll[0] + gameState.lastRoll[1];
                // If one utility is owned, rent is 4 times amount shown on dice.
                // If both are owned, rent is 10 times amount shown on dice.
                rentAmount = utilityCount === 1 ? lastRollTotal * 4 : lastRollTotal * 10;
            }
        }

        if (rentAmount > 0) {
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
    };
};

export default useMonopoly;
