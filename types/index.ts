
export interface Player {
    id: number;
    name: string;
    color: string;
    money: number;
    position: number;
    properties: number[];
    inJail: boolean;
    jailTurns: number;
}

export interface Property {
    name: string;
    group: string;
    price: number;
    rent: number[];
    owner: number | null;
    houses: number;
}

export interface Railroad {
    name: string;
    price: number;
    owner: number | null;
}

export interface Utility {
    name: string;
    price: number;
    owner: number | null;
}

export interface Card {
    text: string;
    action: string;
    amount?: number;
    position?: number;
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
    properties: { [key: number]: Property };
    railroads: { [key: number]: Railroad };
    utilities: { [key: number]: Utility };
    chanceCards: Card[];
    communityChestCards: Card[];
}
