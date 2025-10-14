import styles from "./Monopoly.module.css";
import { Player } from "@/types";

interface PlayerStatsProps {
    player: Player;
    onTrade: () => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, onTrade }) => {
    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
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
            <button onClick={onTrade} className="text-xs bg-cyan-500 text-white px-2 py-1 rounded mt-2">Trade</button>
        </div>
    );
};

export default PlayerStats;
