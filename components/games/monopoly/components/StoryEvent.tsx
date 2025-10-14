const StoryEvents = () => {
    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Story Events
            </h3>
            <div className="max-h-50 flex flex-col gap-2 scroll-hide">
                <div className="p-2 rouded-lg border-l-4 border-l-cyan-500 bg-cyan-500/10 rounded-sm">
                    <div className="font-semibold text-xs/normal">
                        Market Surge
                    </div>
                    <div className="text-[11px] leading-4">
                        All property values increased by 10%
                    </div>
                </div>
                <div className="p-2 rouded-lg border-l-4 border-l-red-500 bg-red-500/10 rounded-sm">
                    <div className="font-semibold text-xs/normal">
                        Data Breach
                    </div>
                    <div className="text-[11px] leading-4">
                        All players pay security tax
                    </div>
                </div>
                <div className="p-2 rouded-lg border-l-4 border-l-neutral-500 bg-neutral-500/10 rounded-sm">
                    <div className="font-semibold text-xs/normal">
                        Tech Innovation
                    </div>
                    <div className="text-[11px] leading-4">
                        Utilities generate double income this turn
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryEvents;
