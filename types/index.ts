export interface Player {
    id: string;
    name: string;
    color: string;
    money: number;
    position: number;
    properties: number[];
    inJail: boolean;
    jailTurns: number;
    bankrupt: boolean;
    getOutOfJailFreeCards: number;
}

export interface Property {
    name: string;
    group: string;
    price: number;
    rent: number[];
    owner: string | null;
    houses: number;
    housePrice: number;
}

export interface Railroad {
    name: string;
    price: number;
    owner: string | null;
}

export interface Utility {
    name: string;
    price: number;
    owner: string | null;
}

export interface Card {
    text: string;
    cardType: "chance" | "community_chest";
    action: {
        type: string;
        position?: number;
        group?: string;
        amount?: number;
        house?: number;
        hotel?: number;
    };
}

export interface Square {
    name: string;
    type: string;
    group?: string;
    amount?: number;
}

export interface GameState {
    players: Player[];
    currentPlayerIndex: number;
    gameStarted: boolean;
    gameWon: boolean;
    winner: Player | null;
    gameStartTime: number;
    totalTransactions: number;
    doubleRollCount: number;
    lastRoll: [number, number];
    hasRolled: boolean;
    auction: {
        propertyId: number;
        highestBid: number;
        highestBidder: string | null;
        timer: number;
    } | null;
    properties: { [key: number]: Property };
    railroads: { [key: number]: Railroad };
    utilities: { [key: number]: Utility };
    chanceCards: Card[];
    communityChestCards: Card[];
    gameLog: GameEvent[];
}

export interface TradeDetails {
    fromPlayerId: string;
    toPlayerId: string;
    offeredProperties: number[];
    requestedProperties: number[];
    offeredMoney: number;
    requestedMoney: number;
}

export interface GameEvent {
    time: string;
    text: string;
}

export interface Room {
    id: string; // uuid from Supabase
    room_code: string;
    room_name: string;
    game_state: GameState; // jsonb
    status: "waiting" | "playing" | "finished" | string;
    max_players: number;
    created_at: string; // ISO timestamp
    updated_at: string;
}
