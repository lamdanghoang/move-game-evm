import { GameState, Player, Property, Railroad, Utility } from "../types";
import { PropertyGroup } from "../constants/game";

export function getGroupProperties(gameState: GameState, group: string) {
    return Object.values(gameState.properties).filter(
        (prop) => prop.group === group
    );
}

export function hasMonopoly(gameState: GameState, player: Player, group: string) {
    const groupProperties = getGroupProperties(gameState, group);
    return groupProperties.every((prop) => prop.owner === player.id);
}

export function handleBankruptcy(gameState: GameState, player: Player) {
    if (player.money < 0) {
        player.bankrupt = true;
        gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            text: `${player.name} has gone bankrupt!`,
        });
        const activePlayers = gameState.players.filter((p) => !p.bankrupt);
        if (activePlayers.length === 1) {
            gameState.gameWon = true;
            gameState.winner = activePlayers[0];
            gameState.gameLog.push({
                time: new Date().toLocaleTimeString(),
                text: `${activePlayers[0].name} has won the game!`,
            });
        }
    }
}

type PayableProperty = (Property | Railroad | Utility) & { group: string };

export function payRent(
    gameState: GameState,
    player: Player,
    property: PayableProperty,
    options: { isCardMove?: boolean } = {}
) {
    const owner = gameState.players.find((p) => p.id === property.owner);
    if (!owner || owner.id === player.id || property.isMortgaged) return;

    let rentAmount = 0;
    if (property.group === PropertyGroup.RAILROAD) {
        const railroadCount = owner.properties.filter(
            (pId) => gameState.railroads[pId]
        ).length;
        rentAmount = 25 * Math.pow(2, railroadCount - 1);
        if (options.isCardMove) {
            rentAmount *= 2;
        }
    } else if (property.group === PropertyGroup.UTILITY) {
        const utilityCount = owner.properties.filter(
            (pId) => gameState.utilities[pId]
        ).length;
        const lastRollTotal = gameState.lastRoll[0] + gameState.lastRoll[1];

        let multiplier = 10;
        if (options.isCardMove) {
            multiplier = 10; // The rule is 10x dice roll if moved by card
        } else {
            multiplier = utilityCount === 1 ? 4 : 10;
        }
        rentAmount = lastRollTotal * multiplier;
    } else {
        const prop = property as Property;
        rentAmount = prop.rent[prop.houses];
        if (
            prop.houses === 0 &&
            hasMonopoly(gameState, owner, prop.group)
        ) {
            const groupProperties = getGroupProperties(gameState, prop.group);
            const allUnmortgaged = groupProperties.every((p) => !p.isMortgaged);
            if (allUnmortgaged) {
                rentAmount *= 2;
            }
        }
    }
    player.money -= rentAmount;
    owner.money += rentAmount;
    gameState.gameLog.push({
        time: new Date().toLocaleTimeString(),
        text: `${player.name} paid ${rentAmount} in rent to ${owner.name}.`,
    });
    handleBankruptcy(gameState, player);
}
