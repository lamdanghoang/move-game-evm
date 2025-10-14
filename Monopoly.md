# Monopoly Game Logic

## High-Level Overview

The Monopoly game is implemented as a single-page application using **React** and **TypeScript**. The core game logic is encapsulated within a custom hook called `useMonopoly`, which manages the game state and provides functions for manipulating it. The main game component, `MonopolyGame`, uses this hook to render the game board, player information, and handle user interactions.

## Game State

The entire state of the game is stored in a single object managed by the `useMonopoly` hook. This state includes:

*   **Players:** An array of player objects, each containing their:
    *   `id`, `name`, and `color`
    *   Current `money`
    *   `position` on the board
    *   A list of `properties` they own
    *   `inJail` status and `jailTurns` counter
*   **Properties:** An object containing all the properties on the board, indexed by their position. Each property has a `name`, `price`, `rent` values, `owner`, and number of `houses`.
*   **Railroads and Utilities:** Similar to properties, these are stored in separate objects.
*   **Chance and Community Chest Cards:** Arrays of card objects, each with a `text` description and an `action` to be performed.
*   **Game Flow Control:** Variables such as `currentPlayerIndex`, `gameStarted`, `gameWon`, and `winner` to manage the turn-based nature of the game and its end condition.

## Game Mechanics

The game logic is implemented through a series of functions within the `MonopolyGame` component and the `useMonopoly` hook:

#### Player Turns

The game proceeds in turns, with the `currentPlayerIndex` determining whose turn it is. The `nextPlayer` function advances the turn to the next player.

#### Dice Rolling

The `handleRollDice` function simulates the rolling of two six-sided dice. It also handles the logic for rolling doubles, including sending a player to jail for rolling three consecutive doubles.

#### Player Movement

A player's position is updated based on the total of the dice roll. If a player passes "GO", they receive 200 credits.

#### Landing on Squares

When a player lands on a square, the `handleSquareLanding` function is called, which triggers different actions based on the square's type:

*   **Properties, Railroads, and Utilities:** If the property is unowned, the player can choose to buy it. If it's owned by another player, they must pay rent.
*   **Chance and Community Chest:** The player draws a card, and the `handleCardAction` function is called to execute the corresponding action (e.g., receive money, pay a fine, move to a new position).
*   **Go to Jail:** The player is moved to the "Jail" square and their `inJail` status is set to `true`.
*   **Taxes:** The player must pay a fixed amount to the bank.

#### Jail

A player in jail can get out by:

*   Paying a fine of 50 credits.
*   Using a "Get Out of Jail Free" card.
*   Rolling doubles on their turn. If they fail to roll doubles after three turns, they must pay the fine.

#### Buying Houses

A player can buy houses for their properties if they own all the properties in a single color group. The `handleBuyHouse` function handles this logic.

#### Trading

Players can trade properties and money with each other. The `TradeModal` component provides the UI for proposing and accepting trades, and the `handleTrade` function in `MonopolyGame` processes the exchange of assets.

#### Bankruptcy

If a player cannot pay their debts, they go bankrupt. The `handleBankruptcy` function removes the player from the game, and their properties are returned to the bank. The game ends when only one player remains.