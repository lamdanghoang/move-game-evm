const FactionStatus = () => {
    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Faction Status
            </h3>
            <div className="flex flex-col gap-0.5">
                <div className="font-semibold text-cyan-500 text-sm/normal">
                    Cyber Syndicate
                </div>
                <div className="text-neutral-400/70 text-xs/normal">
                    Level 2 Alliance
                </div>
                <div className="text-neutral-400/70 text-xs/normal">
                    4 Active Members
                </div>
            </div>
            <div className="flex flex-col gap-0.5 text-cyan-500 text-xs/normal">
                <div>+10% Rent Income</div>
                <div>Reduced Tax Rates</div>
            </div>
        </div>
    );
};

export default FactionStatus;
