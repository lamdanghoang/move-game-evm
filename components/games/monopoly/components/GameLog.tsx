import { GameEvent } from "@/types";
import { useEffect, useRef } from "react";

interface GameLogProps {
    events: GameEvent[];
}

const GameLog: React.FC<GameLogProps> = ({ events }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [events]);

    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Game Log
            </h3>
            <div
                ref={logContainerRef}
                className="flex flex-col gap-2 overflow-y-auto h-40 scroll-hide"
            >
                {events.map((event, index) => (
                    <div key={index} className="text-xs">
                        <span className="text-neutral-400/70">[{event.time}]</span>{" "}
                        <span className="text-white">{event.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameLog;
