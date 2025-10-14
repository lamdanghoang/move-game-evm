import { Player, Property } from "@/types";

interface PropertyPortfolioProps {
    player: Player;
    properties: { [key: number]: Property };
    onBuyHouse: (propertyId: number) => void;
}

const PropertyPortfolio = ({ player, properties, onBuyHouse }: PropertyPortfolioProps) => {
    const playerProperties = player.properties.map((id) => properties[id]).filter(Boolean);

    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Property Portfolio
            </h3>
            <div className="max-h-50 scroll-hide">
                {playerProperties.length === 0 ? (
                    <div className="p-4 text-neutral-400/70 text-xs/normal text-center">
                        No properties owned
                    </div>
                ) : (
                    playerProperties.map((property) => (
                        <div key={property.name} className="flex justify-between items-center">
                            <span>{property.name}</span>
                            {property.houses < 5 && (
                                <button onClick={() => onBuyHouse(player.properties.find(id => properties[id] === property)!)} className="text-xs bg-cyan-500 text-white px-2 py-1 rounded">Buy House</button>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-between items-center font-semibold text-sm/normal">
                <span>Total Value:</span>
                <span>{player.money} Credits</span>
            </div>
        </div>
    );
};

export default PropertyPortfolio;
