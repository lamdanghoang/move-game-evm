import { GameState, Player, Card, Square } from "../types/index.js";
import { GO_MONEY, JAIL_POSITION, TOTAL_SQUARES } from "../constants/game.mjs";
import { handleBankruptcy } from "./game-logic.mjs";
import { handleSquareLanding } from "./square-handler.mjs";

export function handleCardAction(
    gameState: GameState,
    player: Player,
    card: Card,
    squares: (Square & { position: number })[],
    endTurn: (player: Player) => void
): boolean {
    gameState.gameLog.push({
        time: new Date().toLocaleTimeString(),
        text: `${player.name} drew: "${card.text}"`,
    });
    const oldPosition = player.position;
    let moved = false;

    switch (card.action.type) {
        case "move":
            player.position = card.action.position!;
            if (player.position < oldPosition) {
                player.money += GO_MONEY;
                gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} passed GO and collected ${GO_MONEY} credits.`,
                });
            }
            moved = true;
            break;
        case "move_nearest":
            const groupSquares = squares.filter(
                (s) => s.group === card.action.group
            );
            let minDistance = TOTAL_SQUARES;
            let nearestSquare: (Square & { position: number }) | null = null;
            for (const square of groupSquares) {
                let distance = square.position - player.position;
                if (distance <= 0) distance += TOTAL_SQUARES;
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSquare = square;
                }
            }
            if (nearestSquare) {
                if (nearestSquare.position < player.position) {
                    player.money += GO_MONEY;
                    gameState.gameLog.push({
                        time: new Date().toLocaleTimeString(),
                        text: `${player.name} passed GO and collected ${GO_MONEY} credits.`,
                    });
                }
                player.position = nearestSquare.position;
                moved = true;
            }
            break;
        case "move_by":
            const newPos =
                (player.position + card.action.amount! + TOTAL_SQUARES) %
                TOTAL_SQUARES;
            if (card.action.amount! > 0 && newPos < player.position) {
                player.money += GO_MONEY;
                gameState.gameLog.push({
                    time: new Date().toLocaleTimeString(),
                    text: `${player.name} passed GO and collected ${GO_MONEY} credits.`,
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
            handleBankruptcy(gameState, player);
            break;
        case "go_to_jail":
            player.position = JAIL_POSITION;
            player.inJail = true;
            endTurn(player);
            return true;
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
                    if (property.houses === 5) hotels++;
                    else houses += property.houses;
                }
            }
            player.money -=
                houses * card.action.house! + hotels * card.action.hotel!;
            handleBankruptcy(gameState, player);
            break;
        case "pay_each_player":
            gameState.players.forEach((p) => {
                if (p.id !== player.id) {
                    p.money += card.action.amount!;
                    player.money -= card.action.amount!;
                }
            });
            handleBankruptcy(gameState, player);
            break;
        case "collect_from_each_player":
            gameState.players.forEach((p) => {
                if (p.id !== player.id) {
                    p.money -= card.action.amount!;
                    player.money += card.action.amount!;
                    handleBankruptcy(gameState, p);
                }
            });
            break;
    }
    if (moved) {
        return handleSquareLanding(gameState, player, squares, endTurn, {
            isCardMove: true,
        });
    }
    return false;
}
