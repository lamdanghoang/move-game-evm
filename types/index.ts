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

export interface RoomPlayer {
    id: string; // uuid from Supabase
    room_id: string;
    user_id: string;
    player_order: number;
    is_ready: boolean;
    created_at: string; // ISO timestamp
}

export interface GameMove {
    id: number;
    room_id: string;
    user_id: string;
    move_type: string;
    move_data: any;
    created_at: string; // ISO timestamp
}

// --- Player Actions ---

export type ActionType =
    | "START_GAME"
    | "ROLL_DICE"
    | "BUY_PROPERTY"
    | "START_AUCTION"
    | "BID"
    | "BUY_HOUSE"
    | "TRADE"
    | "PAY_JAIL_FINE"
    | "USE_JAIL_CARD"
    | "END_TURN";

export interface BaseAction {
    type: ActionType;
}

export interface StartGameAction extends BaseAction {
    type: "START_GAME";
    payload?: never;
}

export interface RollDiceAction extends BaseAction {
    type: "ROLL_DICE";
    payload?: never;
}

export interface BuyPropertyAction extends BaseAction {
    type: "BUY_PROPERTY";
    payload: { propertyId: number };
}

export interface StartAuctionAction extends BaseAction {
    type: "START_AUCTION";
    payload: { propertyId: number };
}

export interface BidAction extends BaseAction {
    type: "BID";
    payload: { amount: number };
}

export interface BuyHouseAction extends BaseAction {
    type: "BUY_HOUSE";
    payload: { propertyId: number };
}

export interface TradeAction extends BaseAction {
    type: "TRADE";
    payload: TradeDetails;
}

export interface PayJailFineAction extends BaseAction {
    type: "PAY_JAIL_FINE";
    payload?: never;
}

export interface UseJailCardAction extends BaseAction {
    type: "USE_JAIL_CARD";
    payload?: never;
}

export interface EndTurnAction extends BaseAction {
    type: "END_TURN";
    payload?: never;
}

export type PlayerAction =
    | StartGameAction
    | RollDiceAction
    | BuyPropertyAction
    | StartAuctionAction
    | BidAction
    | BuyHouseAction
    | TradeAction
    | PayJailFineAction
    | UseJailCardAction
    | EndTurnAction;
