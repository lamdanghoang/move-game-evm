import { Button } from "@/components/ui/button";
import { Player, Property, Railroad, Utility } from "@/types";
import { toast } from "sonner";

type OwnableProperty = Property | Railroad | Utility;

interface PropertyPortfolioProps {
    player: Player;
    properties: { [key: number]: OwnableProperty };
    onBuyHouse: (propertyId: number) => void;
    isCurrentPlayerTurn: boolean;
    onManageAssets: () => void;
}

const PropertyPortfolio = ({
    player,
    properties,
    onBuyHouse,
    isCurrentPlayerTurn,
    onManageAssets,
}: PropertyPortfolioProps) => {
    const playerProperties = player.properties
        .map((id) => properties[id])
        .filter(Boolean);

    const totalValue =
        player.money +
        playerProperties.reduce((acc, property) => acc + property.price, 0);

    const groupedProperties = playerProperties.reduce((acc, property) => {
        const group = "group" in property ? property.group : "Other";
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(property);
        return acc;
    }, {} as { [key: string]: OwnableProperty[] });

    const handleBuyHouse = (propertyId: number) => {
        if (!isCurrentPlayerTurn) {
            toast.error("It's not your turn!");
            return;
        }
        onBuyHouse(propertyId);
    };

    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Property Portfolio
            </h3>
            <div className="max-h-96 scroll-hide overflow-y-auto">
                {Object.keys(groupedProperties).length === 0 ? (
                    <div className="p-4 text-neutral-400/70 text-xs/normal text-center">
                        No properties owned
                    </div>
                ) : (
                    Object.entries(groupedProperties).map(([group, props]) => (
                        <div key={group} className="mb-2">
                            <h4 className="text-sm font-semibold text-cyan-300/80 mb-1 capitalize">
                                {group}
                            </h4>
                            <div className="flex flex-col gap-1">
                                {props.map((property) => (
                                    <div
                                        key={property.name}
                                        className="flex justify-between items-center text-xs/normal"
                                    >
                                        <span>{property.name}</span>
                                        {"houses" in property &&
                                            property.houses < 5 && (
                                                <Button
                                                    onClick={() =>
                                                        handleBuyHouse(
                                                            player.properties.find(
                                                                (id) =>
                                                                    properties[
                                                                        id
                                                                    ] ===
                                                                    property
                                                            )!
                                                        )
                                                    }
                                                    className="h-fit text-xs bg-cyan-500 text-white px-2 py-1 rounded"
                                                >
                                                    Buy House
                                                </Button>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-between items-center font-semibold text-sm/normal">
                <span>Total Value:</span>
                <span>{totalValue} Credits</span>
            </div>
            <Button onClick={onManageAssets} className="w-full mt-2">
                Manage Assets
            </Button>
        </div>
    );
};

export default PropertyPortfolio;
