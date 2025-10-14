import { GameState } from "@/types";
import Controls from "./Controls";

interface GameBoardProps {
    gameState: GameState;
    onRollDice: () => void;
    onEndTurn: () => void;
    onBuyProperty: () => void;
    lastRoll: [number, number];
    hasRolled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
    gameState,
    onRollDice,
    onEndTurn,
    onBuyProperty,
    lastRoll,
    hasRolled,
}) => {
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

    return (
        <div className="relative w-full h-full grid grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(11,_1fr)] gap-0.5 bg-neutral-800 border-2 border-[rgba(50,184,198,1)] rounded-2xl">
            {squares.map((square, index) => {
                const property =
                    gameState.properties[index] ||
                    gameState.railroads[index] ||
                    gameState.utilities[index];
                return (
                    <div
                        key={index}
                        className={`boardSquare ${`square-${index}`}
                         ${square.type} ${
                            square.group ? square.group : ""
                        } ${`${
                            (index === 0 && "rounded-br-lg") ||
                            (index === 10 && "rounded-bl-lg") ||
                            (index === 20 && "rounded-tl-lg") ||
                            (index === 30 && "rounded-tr-lg")
                        }`}`}
                    >
                        <div
                            className={`squareName ${
                                (square.type === "go" ||
                                    square.type === "jail" ||
                                    square.type === "free_parking" ||
                                    square.type === "go_to_jail") &&
                                "my-auto"
                            }`}
                        >
                            {square.name}
                        </div>
                        {property && (
                            <div className="squarePrice">{property.price}¢</div>
                        )}
                        {square.type === "tax" && (
                            <div className="squareTax">{square.amount}¢</div>
                        )}
                        {gameState.players.map((player) => {
                            if (player.position === index) {
                                return (
                                    <div
                                        key={player.id}
                                        className={`absolute size-3 rounded-full border-2 border-white/80 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] z-20
                                            ${`player-${player.id}`}`}
                                        style={{
                                            backgroundColor: player.color,
                                        }}
                                    ></div>
                                );
                            }
                            return null;
                        })}
                    </div>
                );
            })}
            <Controls
                onRollDice={onRollDice}
                onEndTurn={onEndTurn}
                onBuyProperty={onBuyProperty}
                lastRoll={gameState.lastRoll}
                hasRolled={hasRolled}
            />
        </div>
    );
};

export default GameBoard;
