import dotenv from "dotenv";
dotenv.config();

import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import { Server, Socket } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import {
    GameState,
    Player,
    Card,
    Square,
    PlayerAction,
    RoomPlayer,
    TradeDetails,
} from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 10000;

const roomPlayers = new Map<string, string[]>();
const activeAuctionIntervals = new Map<string, NodeJS.Timeout>();

const squares: Square[] = [
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

const chanceCards: Card[] = [
    {
        text: "Advance to Go (Collect $200)",
        cardType: "chance",
        action: { type: "move", position: 0 },
    },
    {
        text: "Advance to Illinois Ave.",
        cardType: "chance",
        action: { type: "move", position: 24 },
    },
    {
        text: "Advance to St. Charles Place",
        cardType: "chance",
        action: { type: "move", position: 11 },
    },
    {
        text: "Advance to the nearest Utility.",
        cardType: "chance",
        action: { type: "move_nearest", group: "utility" },
    },
    {
        text: "Advance to the nearest Railroad.",
        cardType: "chance",
        action: { type: "move_nearest", group: "railroad" },
    },
    {
        text: "Bank pays you dividend of $50",
        cardType: "chance",
        action: { type: "collect", amount: 50 },
    },
    {
        text: "Get Out of Jail Free",
        cardType: "chance",
        action: { type: "get_out_of_jail_free" },
    },
    {
        text: "Go Back 3 Spaces",
        cardType: "chance",
        action: { type: "move_by", amount: -3 },
    },
    { text: "Go to Jail", cardType: "chance", action: { type: "go_to_jail" } },
    {
        text: "Make general repairs on all your property",
        cardType: "chance",
        action: { type: "pay_per_building", house: 25, hotel: 100 },
    },
    {
        text: "Pay poor tax of $15",
        cardType: "chance",
        action: { type: "pay", amount: 15 },
    },
    {
        text: "Take a trip to Reading Railroad",
        cardType: "chance",
        action: { type: "move", position: 5 },
    },
    {
        text: "You have been elected Chairman of the Board. Pay each player $50",
        cardType: "chance",
        action: { type: "pay_each_player", amount: 50 },
    },
    {
        text: "Your building and loan matures. Collect $150",
        cardType: "chance",
        action: { type: "collect", amount: 150 },
    },
    {
        text: "You have won a crossword competition. Collect $100",
        cardType: "chance",
        action: { type: "collect", amount: 100 },
    },
];

const communityChestCards: Card[] = [
    {
        text: "Advance to Go (Collect $200)",
        cardType: "community_chest",
        action: { type: "move", position: 0 },
    },
    {
        text: "Bank error in your favor. Collect $200",
        cardType: "community_chest",
        action: { type: "collect", amount: 200 },
    },
    {
        text: "Doctor’s fee. Pay $50",
        cardType: "community_chest",
        action: { type: "pay", amount: 50 },
    },
    {
        text: "From sale of stock you get $50",
        cardType: "community_chest",
        action: { type: "collect", amount: 50 },
    },
    {
        text: "Get Out of Jail Free",
        cardType: "community_chest",
        action: { type: "get_out_of_jail_free" },
    },
    {
        text: "Go to Jail",
        cardType: "community_chest",
        action: { type: "go_to_jail" },
    },
    {
        text: "Holiday fund matures. Receive $100",
        cardType: "community_chest",
        action: { type: "collect", amount: 100 },
    },
    {
        text: "Income tax refund. Collect $20",
        cardType: "community_chest",
        action: { type: "collect", amount: 20 },
    },
    {
        text: "It is your birthday. Collect $10 from every player",
        cardType: "community_chest",
        action: { type: "collect_from_each_player", amount: 10 },
    },
    {
        text: "Life insurance matures. Collect $100",
        cardType: "community_chest",
        action: { type: "collect", amount: 100 },
    },
    {
        text: "Pay hospital fees of $100",
        cardType: "community_chest",
        action: { type: "pay", amount: 100 },
    },
    {
        text: "Pay school fees of $50",
        cardType: "community_chest",
        action: { type: "pay", amount: 50 },
    },
    {
        text: "Receive $25 consultancy fee",
        cardType: "community_chest",
        action: { type: "collect", amount: 25 },
    },
    {
        text: "You are assessed for street repair. $40 per house, $115 per hotel",
        cardType: "community_chest",
        action: { type: "pay_per_building", house: 40, hotel: 115 },
    },
    {
        text: "You have won second prize in a beauty contest. Collect $10",
        cardType: "community_chest",
        action: { type: "collect", amount: 10 },
    },
    {
        text: "You inherit $100",
        cardType: "community_chest",
        action: { type: "collect", amount: 100 },
    },
];

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getInitialGameState(): GameState {
    return {
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false,
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
                mortgageValue: 30,
                isMortgaged: false,
            },
            3: {
                name: "Neon District",
                group: "brown",
                price: 80,
                rent: [4, 20, 60, 180, 320, 450],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 40,
                isMortgaged: false,
            },
            6: {
                name: "Cyber Avenue",
                group: "light_blue",
                price: 100,
                rent: [6, 30, 90, 270, 400, 550],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 50,
                isMortgaged: false,
            },
            8: {
                name: "Data Street",
                group: "light_blue",
                price: 100,
                rent: [6, 30, 90, 270, 400, 550],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 50,
                isMortgaged: false,
            },
            9: {
                name: "Matrix Boulevard",
                group: "light_blue",
                price: 120,
                rent: [8, 40, 100, 300, 450, 600],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 60,
                isMortgaged: false,
            },
            11: {
                name: "Tech Central",
                group: "pink",
                price: 140,
                rent: [10, 50, 150, 450, 625, 750],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 70,
                isMortgaged: false,
            },
            13: {
                name: "AI Labs",
                group: "pink",
                price: 140,
                rent: [10, 50, 150, 450, 625, 750],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 70,
                isMortgaged: false,
            },
            14: {
                name: "Neural Network",
                group: "pink",
                price: 160,
                rent: [12, 60, 180, 500, 700, 900],
                owner: null,
                houses: 0,
                housePrice: 50,
                mortgageValue: 80,
                isMortgaged: false,
            },
            16: {
                name: "Quantum Plaza",
                group: "orange",
                price: 180,
                rent: [14, 70, 200, 550, 750, 950],
                owner: null,
                houses: 0,
                housePrice: 100,
                mortgageValue: 90,
                isMortgaged: false,
            },
            18: {
                name: "Hologram Heights",
                group: "orange",
                price: 180,
                rent: [14, 70, 200, 550, 750, 950],
                owner: null,
                houses: 0,
                housePrice: 100,
                mortgageValue: 90,
                isMortgaged: false,
            },
            19: {
                name: "Crypto Corner",
                group: "orange",
                price: 200,
                rent: [16, 80, 220, 600, 800, 1000],
                owner: null,
                houses: 0,
                housePrice: 100,
                mortgageValue: 100,
                isMortgaged: false,
            },
            21: {
                name: "Digital Domain",
                group: "red",
                price: 220,
                rent: [18, 90, 250, 700, 875, 1050],
                owner: null,
                houses: 0,
                housePrice: 150,
                mortgageValue: 110,
                isMortgaged: false,
            },
            23: {
                name: "Cloud City",
                group: "red",
                price: 220,
                rent: [18, 90, 250, 700, 875, 1050],
                owner: null,
                houses: 0,
                housePrice: 150,
                mortgageValue: 110,
                isMortgaged: false,
            },
            24: {
                name: "Meta Metropolis",
                group: "red",
                price: 240,
                rent: [20, 100, 300, 750, 925, 1100],
                owner: null,
                houses: 0,
                housePrice: 150,
                mortgageValue: 120,
                isMortgaged: false,
            },
            26: {
                name: "Blockchain Boulevard",
                group: "yellow",
                price: 260,
                rent: [22, 110, 330, 800, 975, 1150],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 130,
                isMortgaged: false,
            },
            27: {
                name: "NFT Plaza",
                group: "yellow",
                price: 260,
                rent: [22, 110, 330, 800, 975, 1150],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 130,
                isMortgaged: false,
            },
            29: {
                name: "Token Tower",
                group: "yellow",
                price: 280,
                rent: [24, 120, 360, 850, 1025, 1200],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 140,
                isMortgaged: false,
            },
            31: {
                name: "Cyberpunk Central",
                group: "green",
                price: 300,
                rent: [26, 130, 390, 900, 1100, 1275],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 150,
                isMortgaged: false,
            },
            32: {
                name: "Neo Tokyo",
                group: "green",
                price: 300,
                rent: [26, 130, 390, 900, 1100, 1275],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 150,
                isMortgaged: false,
            },
            34: {
                name: "Future City",
                group: "green",
                price: 320,
                rent: [28, 150, 450, 1000, 1200, 1400],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 160,
                isMortgaged: false,
            },
            37: {
                name: "Virtual Nexus",
                group: "dark_blue",
                price: 350,
                rent: [35, 175, 500, 1100, 1300, 1500],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 175,
                isMortgaged: false,
            },
            39: {
                name: "Digital Paradise",
                group: "dark_blue",
                price: 400,
                rent: [50, 200, 600, 1400, 1700, 2000],
                owner: null,
                houses: 0,
                housePrice: 200,
                mortgageValue: 200,
                isMortgaged: false,
            },
        },
        railroads: {
            5: {
                name: "Neural Station",
                price: 200,
                owner: null,
                mortgageValue: 100,
                isMortgaged: false,
            },
            15: {
                name: "Cyber Station",
                price: 200,
                owner: null,
                mortgageValue: 100,
                isMortgaged: false,
            },
            25: {
                name: "Virtual Station",
                price: 200,
                owner: null,
                mortgageValue: 100,
                isMortgaged: false,
            },
            35: {
                name: "Mainframe Station",
                price: 200,
                owner: null,
                mortgageValue: 100,
                isMortgaged: false,
            },
        },
        utilities: {
            12: {
                name: "Power Grid",
                price: 150,
                owner: null,
                mortgageValue: 75,
                isMortgaged: false,
            },
            28: {
                name: "Data Center",
                price: 150,
                owner: null,
                mortgageValue: 75,
                isMortgaged: false,
            },
        },
        chanceCards: shuffle([...chanceCards]),
        communityChestCards: shuffle([...communityChestCards]),
        gameLog: [],
        currentTrade: null,
    };
}

function generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

class MonopolyGameManager {
    gameState: GameState;
    private socket: Socket;
    private io: Server;
    private roomId: string;

    constructor(
        gameState: GameState,
        socket: Socket,
        io: Server,
        roomId: string
    ) {
        this.gameState = gameState;
        this.socket = socket;
        this.io = io;
        this.roomId = roomId;
    }

    private handleBankruptcy(player: Player) {
        if (player.money < 0) {
            player.bankrupt = true;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} has gone bankrupt!`,
            });
            const activePlayers = this.gameState.players.filter(
                (p) => !p.bankrupt
            );
            if (activePlayers.length === 1) {
                this.gameState.gameWon = true;
                this.gameState.winner = activePlayers[0];
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${activePlayers[0].name} has won the game!`,
                });
            }
        }
    }

    private payRent(player: Player, property: any) {
        const owner = this.gameState.players.find(
            (p) => p.id === property.owner
        );
        if (!owner || owner.id === player.id || property.isMortgaged) return;

        let rentAmount = 0;
        if (property.group === "railroad") {
            const railroadCount = owner.properties.filter(
                (pId) => this.gameState.railroads[pId]
            ).length;
            rentAmount = 25 * Math.pow(2, railroadCount - 1);
        } else if (property.group === "utility") {
            const utilityCount = owner.properties.filter(
                (pId) => this.gameState.utilities[pId]
            ).length;
            const lastRollTotal =
                this.gameState.lastRoll[0] + this.gameState.lastRoll[1];
            rentAmount =
                utilityCount === 1 ? lastRollTotal * 4 : lastRollTotal * 10;
        } else {
            rentAmount = property.rent[property.houses];
            if (
                property.houses === 0 &&
                this.hasMonopoly(owner, property.group)
            ) {
                const groupProperties = this.getGroupProperties(property.group);
                const allUnmortgaged = groupProperties.every(
                    (p) => !p.isMortgaged
                );
                if (allUnmortgaged) {
                    rentAmount *= 2;
                }
            }
        }
        player.money -= rentAmount;
        owner.money += rentAmount;
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} paid ${rentAmount} in rent to ${owner.name}.`,
        });
        this.handleBankruptcy(player);
    }

    private getGroupProperties(group: string) {
        return Object.values(this.gameState.properties).filter(
            (prop) => prop.group === group
        );
    }

    private hasMonopoly(player: Player, group: string) {
        const groupProperties = this.getGroupProperties(group);
        return groupProperties.every((prop) => prop.owner === player.id);
    }

    private handleCardAction(player: Player, card: Card): boolean {
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} drew: "${card.text}"`,
        });
        const oldPosition = player.position;
        let moved = false;

        switch (card.action.type) {
            case "move":
                player.position = card.action.position!;
                if (player.position < oldPosition) {
                    player.money += 200;
                    this.gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${player.name} passed GO and collected 200 credits.`,
                    });
                }
                moved = true;
                break;
            case "move_nearest":
                const groupSquares = squares
                    .map((s, i) => ({ ...s, position: i }))
                    .filter((s) => s.group === card.action.group);
                let minDistance = 40;
                let nearestSquare: (Square & { position: number }) | null =
                    null;
                for (const square of groupSquares) {
                    let distance = square.position - player.position;
                    if (distance < 0) distance += 40;
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestSquare = square;
                    }
                }
                if (nearestSquare) {
                    if (nearestSquare.position < player.position) {
                        player.money += 200;
                        this.gameState.gameLog.push({
                            time: new Date().toLocaleTimeString(),
                            text: `${player.name} passed GO and collected 200 credits.`,
                        });
                    }
                    player.position = nearestSquare.position;
                    moved = true;
                }
                break;
            case "move_by":
                const newPos =
                    (player.position + card.action.amount! + 40) % 40;
                if (card.action.amount! > 0 && newPos < player.position) {
                    player.money += 200;
                    this.gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${player.name} passed GO and collected 200 credits.`,
                    });
                }
                player.position = newPos;
                moved = true;
                break;
            case "collect":
                player.money += card.action.amount!;
                break;
            case "pay":
                player.money -= card.action.amount!;
                this.handleBankruptcy(player);
                break;
            case "go_to_jail":
                player.position = 10;
                player.inJail = true;
                this.endTurn(player);
                return true;
            case "get_out_of_jail_free":
                player.getOutOfJailFreeCards =
                    (player.getOutOfJailFreeCards || 0) + 1;
                break;
            case "pay_per_building":
                let houses = 0;
                let hotels = 0;
                for (const propId of player.properties) {
                    const property = this.gameState.properties[propId];
                    if (property) {
                        if (property.houses === 5) hotels++;
                        else houses += property.houses;
                    }
                }
                player.money -=
                    houses * card.action.house! + hotels * card.action.hotel!;
                this.handleBankruptcy(player);
                break;
            case "pay_each_player":
                this.gameState.players.forEach((p) => {
                    if (p.id !== player.id) {
                        p.money += card.action.amount!;
                        player.money -= card.action.amount!;
                    }
                });
                this.handleBankruptcy(player);
                break;
            case "collect_from_each_player":
                this.gameState.players.forEach((p) => {
                    if (p.id !== player.id) {
                        p.money -= card.action.amount!;
                        player.money += card.action.amount!;
                        this.handleBankruptcy(p);
                    }
                });
                break;
        }
        if (moved) {
            this.handleSquareLanding(player);
        }
        return false;
    }

    private handleSquareLanding(player: Player): boolean {
        const square = squares[player.position];
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} landed on ${square.name}`,
        });
        switch (square.type) {
            case "property":
            case "railroad":
            case "utility":
                const property =
                    this.gameState.properties[player.position] ||
                    this.gameState.railroads[player.position] ||
                    this.gameState.utilities[player.position];
                if (property.owner && property.owner !== player.id) {
                    this.payRent(player, property);
                } else if (!property.owner) {
                    this.socket.emit("promptBuyOrAuction", {
                        propertyId: player.position,
                    });
                }
                break;
            case "tax":
                player.money -= square.amount!;
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} paid ${square.amount} in ${square.name}.`,
                });
                this.handleBankruptcy(player);
                break;
            case "go_to_jail":
                player.position = 10;
                player.inJail = true;
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} went to jail!`,
                });
                this.endTurn(player);
                return true;
            case "chance":
                const chanceCard = this.gameState.chanceCards.pop();
                if (chanceCard) {
                    this.socket.emit("cardDrawn", { card: chanceCard });
                    const turnEnded = this.handleCardAction(player, chanceCard);
                    this.gameState.chanceCards.unshift(chanceCard);
                    return turnEnded;
                }
                break;
            case "community_chest":
                const communityChestCard =
                    this.gameState.communityChestCards.pop();
                if (communityChestCard) {
                    this.socket.emit("cardDrawn", { card: communityChestCard });
                    const turnEnded = this.handleCardAction(
                        player,
                        communityChestCard
                    );
                    this.gameState.communityChestCards.unshift(
                        communityChestCard
                    );
                    return turnEnded;
                }
                break;
        }
        return false;
    }

    async updateSupabaseAndEmit() {
        const { error } = await supabase
            .from("rooms")
            .update({ game_state: this.gameState as any })
            .eq("id", this.roomId);
        if (error) {
            console.error("Could not update game state.", error);
            this.socket.emit("error", {
                message: "Could not update game state.",
            });
        }
        this.io
            .to(this.roomId)
            .emit("game_updated", { gameState: this.gameState });
    }

    rollDice(player: Player) {
        if (this.gameState.hasRolled) {
            this.socket.emit("error", { message: "You have already rolled." });
            return;
        }
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        const isDouble = dice1 === dice2;
        this.gameState.lastRoll = [dice1, dice2];
        this.io.to(this.roomId).emit("dice_rolled", { dice1, dice2, player });
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} rolled a ${total} (${dice1}+${dice2})${
                isDouble ? " (double)" : ""
            }`,
        });

        if (player.inJail) {
            if (isDouble) {
                player.inJail = false;
                player.jailTurns = 0;
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} rolled doubles and got out of jail!`,
                });
                this.gameState.hasRolled = false; // can roll again
            } else {
                player.jailTurns++;
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} is still in jail. Turns in jail: ${player.jailTurns}`,
                });
                if (player.jailTurns >= 3) {
                    player.money -= 50;
                    player.inJail = false;
                    player.jailTurns = 0;
                    this.gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${player.name} paid 50 credits to get out of jail after 3 turns.`,
                    });
                    this.handleBankruptcy(player);
                }
                this.endTurn(player);
            }
        } else {
            if (isDouble) {
                this.gameState.doubleRollCount++;
            } else {
                this.gameState.doubleRollCount = 0;
            }

            if (this.gameState.doubleRollCount === 3) {
                player.inJail = true;
                player.position = 10;
                this.gameState.doubleRollCount = 0;
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} rolled three doubles and went to jail!`,
                });
                this.endTurn(player);
            } else {
                const oldPosition = player.position;
                const newPosition = (oldPosition + total) % 40;
                player.position = newPosition;
                if (newPosition < oldPosition) {
                    player.money += 200;
                    this.gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${player.name} passed GO and collected 200 credits.`,
                    });
                }
                const turnEnded = this.handleSquareLanding(player);
                if (!isDouble && !turnEnded) {
                    this.gameState.hasRolled = true;
                }
            }
        }
    }

    endTurn(player: Player) {
        if (!this.gameState.hasRolled && !player.inJail) {
            return this.socket.emit("error", {
                message: "You must roll the dice before ending your turn.",
            });
        }
        if (
            this.gameState.lastRoll[0] === this.gameState.lastRoll[1] &&
            !player.inJail
        ) {
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} rolled doubles and gets another turn!`,
            });
            this.gameState.hasRolled = false;
            this.gameState.doubleRollCount = 0;
        } else {
            this.gameState.currentPlayerIndex =
                (this.gameState.currentPlayerIndex + 1) %
                this.gameState.players.length;
            this.gameState.hasRolled = false;
            this.gameState.doubleRollCount = 0;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `It is now ${
                    this.gameState.players[this.gameState.currentPlayerIndex]
                        .name
                }'s turn.`,
            });
        }
    }

    buyProperty(player: Player, propertyId: number) {
        const property =
            this.gameState.properties[propertyId] ||
            this.gameState.railroads[propertyId] ||
            this.gameState.utilities[propertyId];
        if (property && !property.owner && player.money >= property.price) {
            player.money -= property.price;
            property.owner = player.id;
            player.properties.push(propertyId);
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} bought ${property.name}.`,
            });
        } else {
            this.socket.emit("error", { message: "Cannot buy this property." });
        }
    }

    startAuction(propertyId: number) {
        const property =
            this.gameState.properties[propertyId] ||
            this.gameState.railroads[propertyId] ||
            this.gameState.utilities[propertyId];
        if (property && !property.owner) {
            this.gameState.auction = {
                propertyId,
                highestBid: 0,
                highestBidder: null,
                highestBidderName: null,
                timer: 10,
            };
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `An auction has started for ${property.name}.`,
            });

            if (activeAuctionIntervals.has(this.roomId)) {
                clearInterval(activeAuctionIntervals.get(this.roomId)!);
            }

            const interval = setInterval(async () => {
                const { data: room, error } = await supabase
                    .from("rooms")
                    .select("game_state")
                    .eq("id", this.roomId)
                    .single();

                if (error || !room) {
                    clearInterval(interval);
                    activeAuctionIntervals.delete(this.roomId);
                    console.error(
                        "Could not fetch game state in auction interval.",
                        error
                    );
                    return;
                }

                this.gameState = room.game_state as GameState;

                if (!this.gameState.auction) {
                    clearInterval(interval);
                    activeAuctionIntervals.delete(this.roomId);
                    return;
                }

                this.gameState.auction.timer--;
                if (this.gameState.auction.timer <= 0) {
                    clearInterval(interval);
                    activeAuctionIntervals.delete(this.roomId);
                    this.resolveAuction();
                }
                await this.updateSupabaseAndEmit();
            }, 1000);
            activeAuctionIntervals.set(this.roomId, interval);
        }
    }

    private resolveAuction() {
        if (!this.gameState.auction) return;

        const { propertyId, highestBid, highestBidder, highestBidderName } =
            this.gameState.auction;
        const property =
            this.gameState.properties[propertyId] ||
            this.gameState.railroads[propertyId] ||
            this.gameState.utilities[propertyId];

        if (highestBidder) {
            const winner = this.gameState.players.find(
                (p) => p.id === highestBidder
            );
            if (winner) {
                winner.money -= highestBid;
                property.owner = winner.id;
                winner.properties.push(propertyId);
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${highestBidderName} won the auction for ${property.name} for ${highestBid}.`,
                });
                this.handleBankruptcy(winner);
            }
        } else {
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `Auction for ${property.name} ended with no bids.`,
            });
        }
        this.gameState.auction = null;
    }

    proposeTrade(fromPlayer: Player, tradeDetails: TradeDetails) {
        const toPlayer = this.gameState.players.find(
            (p) => p.id === tradeDetails.toPlayerId
        );
        if (!toPlayer)
            return this.socket.emit("error", {
                message: "Trade recipient not found.",
            });

        for (const propId of tradeDetails.offeredProperties) {
            const prop =
                this.gameState.properties[propId] ||
                this.gameState.railroads[propId] ||
                this.gameState.utilities[propId];
            if (
                !prop ||
                prop.owner !== fromPlayer.id ||
                prop.isMortgaged ||
                (prop.houses && prop.houses > 0)
            ) {
                return this.socket.emit("error", {
                    message: "Invalid trade offer.",
                });
            }
        }
        for (const propId of tradeDetails.requestedProperties) {
            const prop =
                this.gameState.properties[propId] ||
                this.gameState.railroads[propId] ||
                this.gameState.utilities[propId];
            if (
                !prop ||
                prop.owner !== toPlayer.id ||
                prop.isMortgaged ||
                (prop.houses && prop.houses > 0)
            ) {
                return this.socket.emit("error", {
                    message: "Invalid trade request.",
                });
            }
        }

        this.gameState.currentTrade = tradeDetails;
        this.io
            .to(tradeDetails.toPlayerId)
            .emit("trade_proposed", { trade: tradeDetails });
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${fromPlayer.name} proposed a trade to ${toPlayer.name}.`,
        });
    }

    acceptTrade(player: Player) {
        const trade = this.gameState.currentTrade;
        if (!trade || trade.toPlayerId !== player.id) {
            return this.socket.emit("error", {
                message: "No active trade proposal for you to accept.",
            });
        }
        const fromPlayer = this.gameState.players.find(
            (p) => p.id === trade.fromPlayerId
        );
        if (!fromPlayer)
            return this.socket.emit("error", {
                message: "Proposing player not found.",
            });

        if (
            fromPlayer.money < trade.offeredMoney ||
            player.money < trade.requestedMoney
        ) {
            this.gameState.currentTrade = null;
            return this.socket.emit("error", {
                message: "A player does not have enough money for this trade.",
            });
        }

        trade.offeredProperties.forEach((propId) => {
            const prop =
                this.gameState.properties[propId] ||
                this.gameState.railroads[propId] ||
                this.gameState.utilities[propId];
            if (prop) {
                prop.owner = player.id;
                fromPlayer.properties = fromPlayer.properties.filter(
                    (id) => id !== propId
                );
                player.properties.push(propId);
            }
        });
        trade.requestedProperties.forEach((propId) => {
            const prop =
                this.gameState.properties[propId] ||
                this.gameState.railroads[propId] ||
                this.gameState.utilities[propId];
            if (prop) {
                prop.owner = fromPlayer.id;
                player.properties = player.properties.filter(
                    (id) => id !== propId
                );
                fromPlayer.properties.push(propId);
            }
        });

        fromPlayer.money -= trade.offeredMoney;
        player.money += trade.offeredMoney;
        player.money -= trade.requestedMoney;
        fromPlayer.money += trade.requestedMoney;

        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} accepted the trade with ${fromPlayer.name}.`,
        });
        this.gameState.currentTrade = null;
        this.io.to(this.roomId).emit("trade_accepted", { trade });
    }

    rejectTrade(player: Player) {
        const trade = this.gameState.currentTrade;
        if (!trade || trade.toPlayerId !== player.id) {
            return this.socket.emit("error", {
                message: "No active trade proposal for you to reject.",
            });
        }
        const proposer = this.gameState.players.find(
            (p) => p.id === trade.fromPlayerId
        );
        if (proposer) {
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} rejected the trade proposed by ${proposer.name}.`,
            });
        }
        this.gameState.currentTrade = null;
        this.io.to(this.roomId).emit("trade_rejected", { trade });
    }

    buyHouse(player: Player, propertyId: number) {
        const property = this.gameState.properties[propertyId];
        if (
            property &&
            property.owner === player.id &&
            !property.isMortgaged &&
            player.money >= property.housePrice
        ) {
            if (!this.hasMonopoly(player, property.group)) {
                return this.socket.emit("error", {
                    message:
                        "You must own all properties in this group to build houses.",
                });
            }
            const groupProperties = this.getGroupProperties(property.group);
            const minHouses = Math.min(...groupProperties.map((p) => p.houses));
            if (property.houses > minHouses) {
                return this.socket.emit("error", {
                    message:
                        "You must build houses evenly across the property group.",
                });
            }
            if (property.houses < 5) {
                property.houses++;
                player.money -= property.housePrice;
                this.gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} bought a ${
                        property.houses === 5 ? "hotel" : "house"
                    } on ${property.name}.`,
                });
            } else {
                return this.socket.emit("error", {
                    message: "Cannot build more on this property.",
                });
            }
        } else {
            return this.socket.emit("error", {
                message: "Cannot buy a house on this property.",
            });
        }
    }

    sellHouse(player: Player, propertyId: number) {
        const property = this.gameState.properties[propertyId];
        if (property && property.owner === player.id && property.houses > 0) {
            const groupProperties = this.getGroupProperties(property.group);
            const maxHouses = Math.max(...groupProperties.map((p) => p.houses));
            if (property.houses < maxHouses) {
                return this.socket.emit("error", {
                    message:
                        "You must sell houses evenly across the property group.",
                });
            }
            property.houses--;
            player.money += property.housePrice / 2;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} sold a ${
                    property.houses === 4 ? "hotel" : "house"
                } on ${property.name}.`,
            });
        } else {
            return this.socket.emit("error", {
                message: "Cannot sell a house from this property.",
            });
        }
    }

    mortgageProperty(player: Player, propertyId: number) {
        const property =
            this.gameState.properties[propertyId] ||
            this.gameState.railroads[propertyId] ||
            this.gameState.utilities[propertyId];
        if (
            property &&
            property.owner === player.id &&
            !property.isMortgaged &&
            (!property.houses || property.houses === 0)
        ) {
            property.isMortgaged = true;
            player.money += property.mortgageValue;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} mortgaged ${property.name}.`,
            });
        } else {
            return this.socket.emit("error", {
                message: "Cannot mortgage this property.",
            });
        }
    }

    unmortgageProperty(player: Player, propertyId: number) {
        const property =
            this.gameState.properties[propertyId] ||
            this.gameState.railroads[propertyId] ||
            this.gameState.utilities[propertyId];
        const cost = property.mortgageValue * 1.1;
        if (
            property &&
            property.owner === player.id &&
            property.isMortgaged &&
            player.money >= cost
        ) {
            property.isMortgaged = false;
            player.money -= cost;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} unmortgaged ${property.name}.`,
            });
        } else {
            return this.socket.emit("error", {
                message: "Cannot unmortgage this property.",
            });
        }
    }

    payJailFine(player: Player) {
        if (player.inJail) {
            player.money -= 50;
            player.inJail = false;
            player.jailTurns = 0;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} paid 50 credits to get out of jail.`,
            });
            this.handleBankruptcy(player);
            this.gameState.hasRolled = false;
        }
    }

    useJailCard(player: Player) {
        if (player.inJail && player.getOutOfJailFreeCards > 0) {
            player.getOutOfJailFreeCards--;
            player.inJail = false;
            player.jailTurns = 0;
            this.gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} used a Get Out of Jail Free card.`,
            });
            this.gameState.hasRolled = false;
        }
    }
}

app.prepare().then(() => {
    const httpServer = createServer(
        (req: IncomingMessage, res: ServerResponse) => {
            const parsedUrl = parse(req.url!, true);
            handle(req, res, parsedUrl);
        }
    );
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log("A user connected:", socket.id);

        socket.emit("welcome", { message: "Hello from server!" });
        io.emit("broadcast", { message: "Someone joined!" });

        socket.on(
            "create_game",
            async ({
                roomName,
                address,
            }: {
                roomName: string;
                address: string;
            }) => {
                console.log("Received create_game event with:", {
                    roomName,
                    address,
                });
                const roomCode = generateRoomId();
                const initialGameState = getInitialGameState();
                const newPlayer: Player = {
                    id: address,
                    name: "Player 1",
                    color: "#00ff88",
                    money: 1500,
                    position: 0,
                    properties: [],
                    inJail: false,
                    jailTurns: 0,
                    bankrupt: false,
                    getOutOfJailFreeCards: 0,
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
                            game_state: initialGameState as GameState,
                        },
                    ])
                    .select();
                if (error) {
                    console.error("Error creating game in Supabase:", error);
                    return socket.emit("error", {
                        message: "Could not create game.",
                    });
                }
                console.log("Game created successfully in Supabase:", room);
                const roomId = room[0].id;
                roomPlayers.set(roomId, [address]);
                const { error: playerError } = await supabase
                    .from("room_players")
                    .insert([
                        { room_id: roomId, user_id: address, player_order: 1 },
                    ]);
                if (playerError) {
                    console.error(
                        "Error adding player to room_players:",
                        playerError
                    );
                    return socket.emit("error", {
                        message: "Could not add player to game.",
                    });
                }
                socket.join(roomId);
                console.log(`Emitting game_created for room ${roomId}`);
                socket.emit("game_created", {
                    roomId,
                });
            }
        );

        socket.on(
            "join_game",
            async ({
                roomId,
                address,
            }: {
                roomId: string;
                address: string;
            }) => {
                const { data: room, error: roomError } = await supabase
                    .from("rooms")
                    .select("*, room_players(*)")
                    .eq("id", roomId)
                    .single();

                if (roomError || !room) {
                    return socket.emit("error", { message: "Game not found." });
                }

                const playerExists = room.room_players.some(
                    (p: RoomPlayer) => p.user_id === address
                );

                if (!playerExists) {
                    if (room.room_players.length >= 4) {
                        return socket.emit("error", {
                            message: "This game is full.",
                        });
                    }

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
                        if (playerError.code === '23505') { // Unique violation
                            // Player already exists, fetch the latest game state and send it
                            const { data: currentRoom, error: currentRoomError } = await supabase
                                .from("rooms")
                                .select("game_state")
                                .eq("id", roomId)
                                .single();

                            if (currentRoomError || !currentRoom) {
                                return socket.emit("error", { message: "Game not found." });
                            }
                            socket.join(roomId);
                            return socket.emit("game_updated", { gameState: currentRoom.game_state });
                        } else {
                            return socket.emit("error", {
                                message: "Could not add player to game.",
                            });
                        }
                    }

                    const playerColors = [
                        "#00ff88",
                        "#ff0088",
                        "#8800ff",
                        "#ff8800",
                    ];
                    const newPlayer: Player = {
                        id: address,
                        name: `Player ${room.room_players.length + 1}`,
                        color: playerColors[room.room_players.length],
                        money: 1500,
                        position: 0,
                        properties: [],
                        inJail: false,
                        jailTurns: 0,
                        bankrupt: false,
                        getOutOfJailFreeCards: 0,
                    };
                    const gameState = room.game_state as GameState;
                    gameState.players.push(newPlayer);
                    gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${newPlayer.name} has joined the game.`,
                    });
                    const { error: updateError } =
                        await supabase
                            .from("rooms")
                            .update({ game_state: gameState as any })
                            .eq("id", roomId);

                    if (updateError) {
                        return socket.emit("error", {
                            message: "Could not update game state.",
                        });
                    }

                    const playersInRoom = roomPlayers.get(roomId) || [];
                    roomPlayers.set(roomId, [...playersInRoom, address]);
                    io.to(roomId).emit("game_updated", {
                        gameState: gameState,
                    });
                }

                socket.join(roomId);
                socket.emit("game_updated", { gameState: room.game_state });
            }
        );

        socket.on(
            "player_action",
            async ({
                roomId,
                action,
                address,
            }: {
                roomId: string;
                action: PlayerAction;
                address: string;
            }) => {
                const { data: room, error } = await supabase
                    .from("rooms")
                    .select("game_state")
                    .eq("id", roomId)
                    .single();
                if (error || !room) {
                    return socket.emit("error", { message: "Game not found." });
                }

                const gameManager = new MonopolyGameManager(
                    room.game_state as GameState,
                    socket,
                    io,
                    roomId
                );
                const { gameState } = gameManager;
                const currentPlayer =
                    gameState.players[gameState.currentPlayerIndex];

                if (action.type === "START_GAME") {
                    if (gameState.gameStarted)
                        return socket.emit("error", {
                            message: "Game has already started.",
                        });
                    if (gameState.players[0].id !== address)
                        return socket.emit("error", {
                            message: "Only the host can start the game.",
                        });
                    if (gameState.players.length < 2)
                        return socket.emit("error", {
                            message: "Need at least 2 players to start.",
                        });
                    gameState.gameStarted = true;
                    gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `The game has started! It is now ${currentPlayer.name}'s turn.`,
                    });
                } else if (action.type === "BID") {
                    const bidder = gameState.players.find(
                        (p) => p.id === address
                    );
                    let error = null;
                    if (!gameState.auction) {
                        error = "There is no active auction.";
                    } else if (!bidder) {
                        error = "Player not found.";
                    } else if (
                        action.payload.amount <= gameState.auction.highestBid
                    ) {
                        error =
                            "Your bid must be higher than the current highest bid.";
                    } else if (bidder.money < action.payload.amount) {
                        error =
                            "You do not have enough money to place this bid.";
                    }

                    if (error) {
                        socket.emit("error", { message: error });
                    } else {
                        if (gameState.auction && bidder) {
                            gameState.auction.highestBid =
                                action.payload.amount;
                            gameState.auction.highestBidder = address;
                            gameState.auction.highestBidderName = bidder.name;
                            gameState.auction.timer = 10;
                        }
                    }
                } else {
                    if (!gameState.gameStarted)
                        return socket.emit("error", {
                            message: "The game has not started yet.",
                        });
                    if (currentPlayer.id !== address)
                        return socket.emit("error", {
                            message: "It's not your turn.",
                        });

                    switch (action.type) {
                        case "ROLL_DICE":
                            gameManager.rollDice(currentPlayer);
                            break;
                        case "BUY_PROPERTY":
                            gameManager.buyProperty(
                                currentPlayer,
                                action.payload.propertyId
                            );
                            break;
                        case "START_AUCTION":
                            gameManager.startAuction(action.payload.propertyId);
                            break;
                        case "END_TURN":
                            gameManager.endTurn(currentPlayer);
                            break;
                        case "PROPOSE_TRADE":
                            gameManager.proposeTrade(
                                currentPlayer,
                                action.payload
                            );
                            break;
                        case "ACCEPT_TRADE":
                            gameManager.acceptTrade(currentPlayer);
                            break;
                        case "REJECT_TRADE":
                            gameManager.rejectTrade(currentPlayer);
                            break;
                        case "BUY_HOUSE":
                            gameManager.buyHouse(
                                currentPlayer,
                                action.payload.propertyId
                            );
                            break;
                        case "SELL_HOUSE":
                            gameManager.sellHouse(
                                currentPlayer,
                                action.payload.propertyId
                            );
                            break;
                        case "MORTGAGE_PROPERTY":
                            gameManager.mortgageProperty(
                                currentPlayer,
                                action.payload.propertyId
                            );
                            break;
                        case "UNMORTGAGE_PROPERTY":
                            gameManager.unmortgageProperty(
                                currentPlayer,
                                action.payload.propertyId
                            );
                            break;
                        case "PAY_JAIL_FINE":
                            gameManager.payJailFine(currentPlayer);
                            break;
                        case "USE_JAIL_CARD":
                            gameManager.useJailCard(currentPlayer);
                            break;
                    }
                }

                await gameManager.updateSupabaseAndEmit();
            }
        );

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    httpServer
        .listen(port, () => {
            console.log(`> Ready on http://localhost:${port}`);
        })
        .on("error", (err: any) => {
            console.error("Server error:", err);
            process.exit(1);
        });
});
