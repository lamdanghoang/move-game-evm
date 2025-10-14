const PropertyPortfolio = () => {
    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Property Portfolio
            </h3>
            <div className="max-h-50 scroll-hide">
                <div className="p-4 text-neutral-400/70 text-xs/normal text-center">
                    No properties owned
                </div>
            </div>
            <div className="flex justify-between items-center font-semibold text-sm/normal">
                <span>Total Value:</span>
                <span>0 Credits</span>
            </div>
        </div>
    );
};

export default PropertyPortfolio;
