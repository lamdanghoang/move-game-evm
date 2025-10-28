import {
    GameState,
    Player,
    Property,
    Railroad,
    Square,
    Utility,
} from "../types";
import { JAIL_POSITION, SquareType } from "../constants/game.mjs";
import { handleBankruptcy, payRent } from "./game-logic.mjs";
import { handleCardAction } from "./card-handler.mjs";
import { Socket } from "socket.io";

export function handleSquareLanding(
    gameState: GameState,
    player: Player,
    squares: (Square & { position: number })[],
    endTurn: (player: Player) => void,
    options: { isCardMove?: boolean } = {},
    socket?: Socket
): boolean {
    const square = squares[player.position];
    gameState.gameLog.push({
        time: new Date().toLocaleTimeString(),
        text: `${player.name} landed on ${square.name}`,
    });
    switch (square.type) {
        case SquareType.PROPERTY:
        case SquareType.RAILROAD:
        case SquareType.UTILITY: {
            const propertyFromState =
                gameState.properties[player.position] ??
                gameState.railroads[player.position] ??
                gameState.utilities[player.position];

            if (!propertyFromState) break;

            let propertyForRent: (Property | Railroad | Utility) & {
                group: string;
            };

            if (square.type === SquareType.PROPERTY) {
                propertyForRent = propertyFromState as Property;
            } else if (square.type === SquareType.RAILROAD) {
                propertyForRent = {
                    ...(propertyFromState as Railroad),
                    group: square.type,
                };
            } else {
                // UTILITY
                propertyForRent = {
                    ...(propertyFromState as Utility),
                    group: square.type,
                };
            }

            if (propertyForRent.owner && propertyForRent.owner !== player.id) {
                payRent(gameState, player, propertyForRent, options);
            } else if (!propertyForRent.owner && socket) {
                socket.emit("promptBuyOrAuction", {
                    propertyId: player.position,
                });
            }
            break;
        }
        case SquareType.TAX:
            player.money -= square.amount!;
            gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} paid ${square.amount} in ${square.name}.`,
            });
            handleBankruptcy(gameState, player);
            break;
        case SquareType.GO_TO_JAIL:
            player.position = JAIL_POSITION;
            player.inJail = true;
            gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${player.name} went to jail!`,
            });
            endTurn(player);
            return true;
        case SquareType.CHANCE:
            const chanceCard = gameState.chanceCards.pop();
            if (chanceCard) {
                socket?.emit("cardDrawn", { card: chanceCard });
                const turnEnded = handleCardAction(
                    gameState,
                    player,
                    chanceCard,
                    squares,
                    endTurn
                );
                gameState.chanceCards.unshift(chanceCard);
                return turnEnded;
            }
            break;
        case SquareType.COMMUNITY_CHEST:
            const communityChestCard = gameState.communityChestCards.pop();
            if (communityChestCard) {
                socket?.emit("cardDrawn", { card: communityChestCard });
                const turnEnded = handleCardAction(
                    gameState,
                    player,
                    communityChestCard,
                    squares,
                    endTurn
                );
                gameState.communityChestCards.unshift(communityChestCard);
                return turnEnded;
            }
            break;
    }
    return false;
}
