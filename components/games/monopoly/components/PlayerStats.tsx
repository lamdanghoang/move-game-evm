"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayerStatsProps {
    players: Player[];
    currentPlayerIndex: number;
    onTrade: (player: Player) => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
    players,
    currentPlayerIndex,
    onTrade,
}) => {
    const [activeIndex, setActiveIndex] = useState(currentPlayerIndex);

    useEffect(() => {
        setActiveIndex(currentPlayerIndex);
    }, [currentPlayerIndex]);
    const [isHovered, setIsHovered] = useState(false);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % players.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + players.length) % players.length);
    };

    const player = players[activeIndex];
    // Check if the current active player is the same as the player whose turn it is
    const isCurrentTurnPlayer = activeIndex === currentPlayerIndex;
    // Check if there are multiple players to enable navigation
    const canNavigate = players.length > 1;

    return (
        <div
            className="w-full max-w-sm mx-auto relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-64 bg-neutral-800 border border-zinc-500/20 rounded-2xl overflow-hidden">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={activeIndex}
                        className="absolute inset-0 p-4 flex flex-col gap-3"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -10000) {
                                handleNext();
                            } else if (swipe > 10000) {
                                handlePrev();
                            }
                        }}
                    >
                        <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                            Player Stats
                        </h3>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400/70 text-xs/normal">
                                Current Turn:
                            </span>
                            <span className="text-sm/normal font-semibold">
                                {player.name}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400/70 text-xs/normal">
                                Credits:
                            </span>
                            <span className="text-sm/normal font-semibold">
                                {player.money}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400/70 text-xs/normal">
                                Properties:
                            </span>
                            <span className="text-sm/normal font-semibold">
                                {player.properties.length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400/70 text-xs/normal">
                                Position:
                            </span>
                            <span className="text-sm/normal font-semibold">
                                {player.position}
                            </span>
                        </div>
                        <Button
                            onClick={() => onTrade(player)}
                            className="w-full mt-2"
                        >
                            Trade
                        </Button>
                    </motion.div>
                </AnimatePresence>
                {canNavigate && (
                    <>
                        <button
                            onClick={handlePrev}
                            className={`absolute top-1/2 left-0 transform -translate-y-1/2 p-1 rounded-r-md bg-neutral-700/50 hover:bg-neutral-600/50 z-10 transition-opacity duration-300 ${
                                isHovered ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className={`absolute top-1/2 right-0 transform -translate-y-1/2 p-1 rounded-l-md bg-neutral-700/50 hover:bg-neutral-600/50 z-10 transition-opacity duration-300 ${
                                isHovered ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlayerStats;
