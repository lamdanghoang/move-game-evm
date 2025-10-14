const GameAnalytics = () => {
    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Game Analytics
            </h3>
            <div className="flex justify-between items-center">
                <span className="text-neutral-400/70 text-xs/normal">
                    Game Duration:
                </span>
                <span className="text-sm/normal font-semibold">12:10</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-neutral-400/70 text-xs/normal">
                    Total Transactions:
                </span>
                <span className="text-sm/normal font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-neutral-400/70 text-xs/normal">
                    Market Activity:
                </span>
                <span className="text-sm/normal font-semibold">High</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-neutral-400/70 text-xs/normal">
                    Leading Player:
                </span>
                <span className="text-sm/normal font-semibold">Player 1</span>
            </div>
        </div>
    );
};

export default GameAnalytics;
