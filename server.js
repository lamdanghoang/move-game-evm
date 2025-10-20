import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;
const roomPlayers = new Map();

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

const chanceCards = [
    {
        text: "Advance to Go (Collect $200)",
        action: { type: "move", position: 0 },
    },
    {
        text: "Advance to Illinois Ave.",
        action: { type: "move", position: 24 },
    },
    {
        text: "Advance to St. Charles Place",
        action: { type: "move", position: 11 },
    },
    {
        text: "Advance to the nearest Utility.",
        action: { type: "move_nearest", group: "utility" },
    },
    {
        text: "Advance to the nearest Railroad.",
        action: { type: "move_nearest", group: "railroad" },
    },
    {
        text: "Bank pays you dividend of $50",
        action: { type: "collect", amount: 50 },
    },
    { text: "Get Out of Jail Free", action: { type: "get_out_of_jail_free" } },
    { text: "Go Back 3 Spaces", action: { type: "move_by", amount: -3 } },
    { text: "Go to Jail", action: { type: "go_to_jail" } },
    {
        text: "Make general repairs on all your property",
        action: { type: "pay_per_building", house: 25, hotel: 100 },
    },
    { text: "Pay poor tax of $15", action: { type: "pay", amount: 15 } },
    {
        text: "Take a trip to Reading Railroad",
        action: { type: "move", position: 5 },
    },
    {
        text: "You have been elected Chairman of the Board. Pay each player $50",
        action: { type: "pay_each_player", amount: 50 },
    },
    {
        text: "Your building and loan matures. Collect $150",
        action: { type: "collect", amount: 150 },
    },
    {
        text: "You have won a crossword competition. Collect $100",
        action: { type: "collect", amount: 100 },
    },
];

const communityChestCards = [
    {
        text: "Advance to Go (Collect $200)",
        action: { type: "move", position: 0 },
    },
    {
        text: "Bank error in your favor. Collect $200",
        action: { type: "collect", amount: 200 },
    },
    { text: "Doctor’s fee. Pay $50", action: { type: "pay", amount: 50 } },
    {
        text: "From sale of stock you get $50",
        action: { type: "collect", amount: 50 },
    },
    { text: "Get Out of Jail Free", action: { type: "get_out_of_jail_free" } },
    { text: "Go to Jail", action: { type: "go_to_jail" } },
    {
        text: "Holiday fund matures. Receive $100",
        action: { type: "collect", amount: 100 },
    },
    {
        text: "Income tax refund. Collect $20",
        action: { type: "collect", amount: 20 },
    },
    {
        text: "It is your birthday. Collect $10 from every player",
        action: { type: "collect_from_each_player", amount: 10 },
    },
    {
        text: "Life insurance matures. Collect $100",
        action: { type: "collect", amount: 100 },
    },
    { text: "Pay hospital fees of $100", action: { type: "pay", amount: 100 } },
    { text: "Pay school fees of $50", action: { type: "pay", amount: 50 } },
    {
        text: "Receive $25 consultancy fee",
        action: { type: "collect", amount: 25 },
    },
    {
        text: "You are assessed for street repair. $40 per house, $115 per hotel",
        action: { type: "pay_per_building", house: 40, hotel: 115 },
    },
    {
        text: "You have won second prize in a beauty contest. Collect $10",
        action: { type: "collect", amount: 10 },
    },
    { text: "You inherit $100", action: { type: "collect", amount: 100 } },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getInitialGameState() {
    return {
        players: [],
        currentPlayerIndex: 0,
        gameStarted: true,
        gameWon: false,
        winner: null,
        gameStartTime: Date.now(),
        totalTransactions: 0,
        doubleRollCount: 0,
        lastRoll: [0, 0],
        hasRolled: false,
        auction: null,
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
        chanceCards: shuffle([...chanceCards]),
        communityChestCards: shuffle([...communityChestCards]),
        gameLog: [],
    };
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // --- Game Logic Helpers ---
    const handleBankruptcy = (gameState, player) => {
        if (player.money < 0) {
            player.bankrupt = true;
            gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} has gone bankrupt!`,
            });

            const activePlayers = gameState.players.filter((p) => !p.bankrupt);
            if (activePlayers.length === 1) {
                gameState.gameWon = true;
                gameState.winner = activePlayers[0].id;
                gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${activePlayers[0].name} has won the game!`,
                });
            }
        }
    };

    const payRent = (gameState, player, property) => {
        const owner = gameState.players.find((p) => p.id === property.owner);
        if (!owner || owner.id === player.id) return;

        let rentAmount = 0;
        if (property.group === "railroad") {
            const railroadCount = owner.properties.filter(
                (pId) => gameState.railroads[pId]
            ).length;
            rentAmount = 25 * Math.pow(2, railroadCount - 1);
        } else if (property.group === "utility") {
            const utilityCount = owner.properties.filter(
                (pId) => gameState.utilities[pId]
            ).length;
            const lastRollTotal = gameState.lastRoll[0] + gameState.lastRoll[1];
            rentAmount =
                utilityCount === 1 ? lastRollTotal * 4 : lastRollTotal * 10;
        } else {
            rentAmount = property.rent[property.houses];
        }

        player.money -= rentAmount;
        owner.money += rentAmount;
        gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} paid ${rentAmount} in rent to ${owner.name}.`,
        });
        handleBankruptcy(gameState, player);
    };

    const handleCardAction = (gameState, player, card) => {
        gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} drew: "${card.text}"`,
        });
        switch (card.action.type) {
            case "move":
                player.position = card.action.position;
                break;
            case "move_nearest":
                const groupSquares = squares
                    .map((s, i) => ({ ...s, position: i }))
                    .filter((s) => s.group === card.action.group);
                let minDistance = 40;
                let nearestSquare = null;
                for (const square of groupSquares) {
                    let distance = square.position - player.position;
                    if (distance < 0) {
                        distance += 40;
                    }
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestSquare = square;
                    }
                }
                if (nearestSquare) {
                    player.position = nearestSquare.position;
                }
                break;
            case "move_by":
                player.position += card.action.amount;
                break;
            case "collect":
                player.money += card.action.amount;
                break;
            case "pay":
                player.money -= card.action.amount;
                handleBankruptcy(gameState, player);
                break;
            case "go_to_jail":
                player.position = 10;
                player.inJail = true;
                break;
            case "get_out_of_jail_free":
                player.getOutOfJailFreeCards =
                    (player.getOutOfJailFreeCards || 0) + 1;
                break;
            case "pay_per_building":
                let houses = 0;
                let hotels = 0;
                for (const propId of player.properties) {
                    const property = gameState.properties[propId];
                    if (property) {
                        if (property.houses === 5) {
                            hotels++;
                        } else {
                            houses += property.houses;
                        }
                    }
                }
                player.money -=
                    houses * card.action.house + hotels * card.action.hotel;
                handleBankruptcy(gameState, player);
                break;
            case "pay_each_player":
                gameState.players.forEach((p) => {
                    if (p.id !== player.id) {
                        p.money += card.action.amount;
                        player.money -= card.action.amount;
                    }
                });
                handleBankruptcy(gameState, player);
                break;
            case "collect_from_each_player":
                gameState.players.forEach((p) => {
                    if (p.id !== player.id) {
                        p.money -= card.action.amount;
                        player.money += card.action.amount;
                    }
                });
                break;
        }
    };

    const handleSquareLanding = (socket, gameState, player) => {
        const square = squares[player.position];
        gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} landed on ${square.name}`,
        });

        switch (square.type) {
            case "property":
            case "railroad":
            case "utility":
                const property =
                    gameState.properties[player.position] ||
                    gameState.railroads[player.position] ||
                    gameState.utilities[player.position];
                if (property.owner && property.owner !== player.id) {
                    payRent(gameState, player, property);
                } else if (!property.owner) {
                    socket.emit("promptBuyOrAuction", {
                        propertyId: player.position,
                    });
                }
                break;
            case "tax":
                player.money -= square.amount;
                gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} paid ${square.amount} in ${square.name}.`,
                });
                handleBankruptcy(gameState, player);
                break;
            case "go_to_jail":
                player.position = 10;
                player.inJail = true;
                gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} went to jail!`,
                });
                break;
            case "chance":
                const chanceCard = gameState.chanceCards.pop();
                if (chanceCard) {
                    socket.emit("cardDrawn", { card: chanceCard });
                    handleCardAction(gameState, player, chanceCard);
                    gameState.chanceCards.unshift(chanceCard);
                }
                break;
            case "community_chest":
                const communityChestCard = gameState.communityChestCards.pop();
                if (communityChestCard) {
                    socket.emit("cardDrawn", { card: communityChestCard });
                    handleCardAction(gameState, player, communityChestCard);
                    gameState.communityCards.unshift(communityChestCard);
                }
                break;
        }
    };

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("create_game", async ({ roomName, address }) => {
            const roomCode = generateRoomId();
            const initialGameState = getInitialGameState();
            const newPlayer = {
                id: address,
                name: "Player 1",
                color: "#00ff88",
                money: 1500,
                position: 0,
                properties: [],
                inJail: false,
                jailTurns: 0,
                bankrupt: false,
            };
            initialGameState.players.push(newPlayer);
            initialGameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${newPlayer.name} created the game.`,
            });

            const { data: room, error } = await supabase
                .from("rooms")
                .insert([
                    {
                        room_code: roomCode,
                        room_name: roomName,
                        game_state: initialGameState,
                    },
                ])
                .select();

            if (error) {
                return socket.emit("error", {
                    message: "Could not create game.",
                });
            }

            const roomId = room[0].id;
            roomPlayers.set(roomId, [address]);

            const { error: playerError } = await supabase
                .from("room_players")
                .insert([
                    { room_id: roomId, user_id: address, player_order: 1 },
                ]);

            if (playerError) {
                return socket.emit("error", {
                    message: "Could not add player to game.",
                });
            }

            socket.join(roomId);
            socket.emit("game_created", {
                roomId,
            });
        });

        socket.on("join_game", async ({ roomId, address }) => {
            const { data: room, error } = await supabase
                .from("rooms")
                .select("*, room_players(*)")
                .eq("id", roomId)
                .single();

            if (error || !room) {
                return socket.emit("error", { message: "Game not found." });
            }

            const playerExists = room.room_players.some(
                (p) => p.user_id === address
            );

            if (!playerExists) {
                if (playersInRoom.length >= 4) {
                    return socket.emit("error", {
                        message: "This game is full.",
                    });
                }

                const playerColors = [
                    "#00ff88",
                    "#ff0088",
                    "#8800ff",
                    "#ff8800",
                ];
                const newPlayer = {
                    id: address,
                    name: `Player ${room.room_players.length + 1}`,
                    color: playerColors[room.room_players.length],
                    money: 1500,
                    position: 0,
                    properties: [],
                    inJail: false,
                    jailTurns: 0,
                    bankrupt: false,
                };

                const gameState = room.game_state;
                gameState.players.push(newPlayer);
                gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${newPlayer.name} has joined the game.`,
                });

                const { error: updateError, data: updatedRoom } = await supabase
                    .from("rooms")
                    .update({ game_state: gameState })
                    .eq("id", roomId)
                    .select();

                if (updateError) {
                    return socket.emit("error", {
                        message: "Could not update game state.",
                    });
                }

                room.game_state = updatedRoom[0].game_state;

                const { error: playerError } = await supabase
                    .from("room_players")
                    .insert([
                        {
                            room_id: roomId,
                            user_id: address,
                            player_order: room.room_players.length + 1,
                        },
                    ]);

                if (playerError) {
                    return socket.emit("error", {
                        message: "Could not add player to game.",
                    });
                }
                roomPlayers.set(roomId, [...playersInRoom, address]);

                io.to(roomId).emit("game_updated", {
                    gameState: room.game_state,
                });
            } else {
                socket.join(roomId);

                socket.emit("game_updated", { gameState: room.game_state });
            }

            socket.join(roomId);
        });

        socket.on("player_action", async ({ roomId, action, address }) => {
            const playersInRoom = roomPlayers.get(roomId) || [];
            if (!playersInRoom.includes(address)) {
                return socket.emit("error", {
                    message: "You are not a player in this game.",
                });
            }

            const { data: room, error } = await supabase
                .from("rooms")
                .select("game_state")
                .eq("id", roomId)
                .single();

            if (error || !room) {
                return socket.emit("error", { message: "Game not found." });
            }

            const gameState = room.game_state;
            const currentPlayer =
                gameState.players[gameState.currentPlayerIndex];
            if (currentPlayer.id !== address)
                return socket.emit("error", { message: "It's not your turn." });

            switch (action.type) {
                case "ROLL_DICE":
                    if (gameState.hasRolled)
                        return socket.emit("error", {
                            message: "You have already rolled.",
                        });
                    const dice1 = Math.floor(Math.random() * 6) + 1;
                    const dice2 = Math.floor(Math.random() * 6) + 1;
                    const total = dice1 + dice2;
                    const isDouble = dice1 === dice2;
                    gameState.lastRoll = [dice1, dice2];
                    gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${
                            currentPlayer.name
                        } rolled a ${total} (${dice1}+${dice2})${
                            isDouble ? " (double)" : ""
                        }`,
                    });
                    if (isDouble) gameState.doubleRollCount++;
                    else gameState.doubleRollCount = 0;

                    if (gameState.doubleRollCount === 3) {
                        currentPlayer.inJail = true;
                        currentPlayer.position = 10;
                        gameState.doubleRollCount = 0;
                        gameState.gameLog.push({
                            time: new Date().toLocaleTimeString(),
                            text: `${currentPlayer.name} rolled three doubles and went to jail!`,
                        });
                        gameState.currentPlayerIndex =
                            (gameState.currentPlayerIndex + 1) %
                            gameState.players.length;
                        gameState.hasRolled = false;
                    } else {
                        const oldPosition = currentPlayer.position;
                        const newPosition = (oldPosition + total) % 40;
                        currentPlayer.position = newPosition;
                        if (newPosition < oldPosition) {
                            currentPlayer.money += 200;
                            gameState.gameLog.push({
                                time: new Date().toLocaleTimeString(),
                                text: `${currentPlayer.name} passed GO and collected 200 credits.`,
                            });
                        }
                        handleSquareLanding(socket, gameState, currentPlayer);
                        if (!isDouble) gameState.hasRolled = true;
                    }
                    break;

                case "BUY_PROPERTY":
                    const property =
                        gameState.properties[currentPlayer.position] ||
                        gameState.railroads[currentPlayer.position] ||
                        gameState.utilities[currentPlayer.position];
                    if (
                        property &&
                        !property.owner &&
                        currentPlayer.money >= property.price
                    ) {
                        currentPlayer.money -= property.price;
                        property.owner = currentPlayer.id;
                        currentPlayer.properties.push(currentPlayer.position);
                        gameState.gameLog.push({
                            time: new Date().toLocaleTimeString(),
                            text: `${currentPlayer.name} bought ${property.name}.`,
                        });
                    }
                    break;

                case "START_AUCTION":
                    const auctionProperty =
                        gameState.properties[action.payload.propertyId] ||
                        gameState.railroads[action.payload.propertyId] ||
                        gameState.utilities[action.payload.propertyId];
                    if (auctionProperty && !auctionProperty.owner) {
                        gameState.auction = {
                            propertyId: action.payload.propertyId,
                            highestBid: 0,
                            highestBidder: null,
                            timer: 10,
                        };

                        const auctionInterval = setInterval(async () => {
                            if (gameState.auction) {
                                gameState.auction.timer--;
                                if (gameState.auction.timer <= 0) {
                                    clearInterval(auctionInterval);
                                    const winner = gameState.players.find(
                                        (p) =>
                                            p.id ===
                                            gameState.auction.highestBidder
                                    );
                                    if (winner) {
                                        const property =
                                            gameState.properties[
                                                gameState.auction.propertyId
                                            ] ||
                                            gameState.railroads[
                                                gameState.auction.propertyId
                                            ] ||
                                            gameState.utilities[
                                                gameState.auction.propertyId
                                            ];
                                        winner.money -=
                                            gameState.auction.highestBid;
                                        property.owner = winner.id;
                                        winner.properties.push(
                                            gameState.auction.propertyId
                                        );
                                        gameState.gameLog.push({
                                            time: new Date().toLocaleTimeString(),
                                            text: `${winner.name} won the auction for ${property.name} for ${gameState.auction.highestBid}.`,
                                        });
                                    }
                                    gameState.auction = null;
                                }
                                const { error: updateError } = await supabase
                                    .from("rooms")
                                    .update({ game_state: gameState })
                                    .eq("id", roomId);

                                if (updateError) {
                                    console.error(
                                        "Could not update game state after auction tick."
                                    );
                                }
                            }
                        }, 1000);
                    }
                    break;

                case "BID":
                    if (
                        gameState.auction &&
                        action.payload.amount > gameState.auction.highestBid
                    ) {
                        gameState.auction.highestBid = action.payload.amount;
                        gameState.auction.highestBidder = currentPlayer.id;
                        gameState.auction.timer = 10;
                    }
                    break;

                case "BUY_HOUSE":
                    const houseProperty =
                        gameState.properties[action.payload.propertyId];
                    if (
                        houseProperty &&
                        houseProperty.owner === currentPlayer.id
                    ) {
                        houseProperty.houses++;
                        currentPlayer.money -= houseProperty.housePrice;
                        gameState.gameLog.push({
                            time: new Date().toLocaleTimeString(),
                            text: `${currentPlayer.name} bought a house on ${houseProperty.name}.`,
                        });
                    }
                    break;

                case "TRADE":
                    // Implement trade logic here
                    break;

                case "PAY_JAIL_FINE":
                    if (currentPlayer.inJail) {
                        currentPlayer.money -= 50;
                        currentPlayer.inJail = false;
                        currentPlayer.jailTurns = 0;
                        gameState.gameLog.push({
                            time: new Date().toLocaleTimeString(),
                            text: `${currentPlayer.name} paid a 50 credit fine to get out of jail.`,
                        });
                    }
                    break;

                case "USE_JAIL_CARD":
                    if (
                        currentPlayer.inJail &&
                        currentPlayer.getOutOfJailFreeCards > 0
                    ) {
                        currentPlayer.getOutOfJailFreeCards--;
                        currentPlayer.inJail = false;
                        currentPlayer.jailTurns = 0;
                        gameState.gameLog.push({
                            time: new Date().toLocaleTimeString(),
                            text: `${currentPlayer.name} used a Get Out of Jail Free card.`,
                        });
                    }
                    break;

                case "END_TURN":
                    if (!gameState.hasRolled)
                        return socket.emit("error", {
                            message:
                                "You must roll the dice before ending your turn.",
                        });
                    gameState.currentPlayerIndex =
                        (gameState.currentPlayerIndex + 1) %
                        gameState.players.length;
                    gameState.hasRolled = false;
                    gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `It is now ${
                            gameState.players[gameState.currentPlayerIndex].name
                        }'s turn.`,
                    });
                    break;
            }

            const { error: updateError } = await supabase
                .from("rooms")
                .update({ game_state: gameState })
                .eq("id", roomId);

            if (updateError) {
                return socket.emit("error", {
                    message: "Could not update game state.",
                });
            }

            io.to(roomId).emit("game_updated", { gameState });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            // for (const [roomId, players] of roomPlayers.entries()) {
            //     const newPlayers = players.filter((p) => p !== socket.id);
            //     if (newPlayers.length < players.length) {
            //         roomPlayers.set(roomId, newPlayers);
            //         break;
            //     }
            // }
        });
    });

    httpServer
        .listen(port, () => {
            console.log(`> Ready on http://localhost:${port}`);
        })
        .on("error", (err) => {
            console.error("Server error:", err);
            process.exit(1);
        });
});
