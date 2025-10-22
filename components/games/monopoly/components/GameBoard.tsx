import { GameState } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface GameBoardProps {
    gameState: GameState;
    recentlyPurchasedId: number | null;
    recentlyBuiltId: number | null;
    inspectProperty: (propertyId: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
    gameState,
    recentlyPurchasedId,
    recentlyBuiltId,
    inspectProperty,
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
        <div className="relative w-full h-full grid grid-cols-[repeat(11,1fr)] grid-rows-[repeat(11,1fr)] gap-0.5 bg-neutral-800 border-2 border-[rgba(50,184,198,1)] rounded-2xl">
            {squares.map((square, index) => {
                const property =
                    gameState.properties[index] ||
                    gameState.railroads[index] ||
                    gameState.utilities[index];

                const owner =
                    property && property.owner
                        ? gameState.players.find((p) => p.id === property.owner)
                        : null;

                return (
                    <div
                        key={index}
                        className={`boardSquare ${`square-${index}`}
                         ${square.type} ${
                            square.group ? square.group : ""
                        } transition-all duration-300 ${`${
                            (index === 0 && "rounded-br-lg") ||
                            (index === 10 && "rounded-bl-lg") ||
                            (index === 20 && "rounded-tl-lg") ||
                            (index === 30 && "rounded-tr-lg")
                        }`}`}
                        style={{
                            boxShadow: owner
                                ? `inset 0 0 0 4px ${owner.color}`
                                : "none",
                        }}
                        onClick={() => {
                            if (
                                square.type === "property" ||
                                square.type === "railroad" ||
                                square.type === "utility"
                            ) {
                                inspectProperty(index);
                            }
                        }}
                    >
                        <AnimatePresence>
                            {recentlyPurchasedId === index && (
                                <motion.div
                                    className="absolute inset-0 bg-white/50"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1.2, 1],
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {square.type === "property" &&
                                property &&
                                "houses" in property &&
                                property.houses > 0 && (
                                    <motion.div
                                        className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-0.5"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {property.houses < 5 &&
                                            Array.from({
                                                length: property.houses,
                                            }).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1.5 h-1.5 bg-green-500 rounded-sm"
                                                    initial={{
                                                        scale: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        scale: 1,
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        scale: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            recentlyBuiltId ===
                                                            index
                                                                ? i * 0.1
                                                                : 0,
                                                    }}
                                                />
                                            ))}
                                        {property.houses === 5 && (
                                            <motion.div
                                                className="w-3 h-1.5 bg-red-500 rounded-sm"
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                )}
                        </AnimatePresence>
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
        </div>
    );
};

export default GameBoard;
