import { Button } from "@/components/ui/button";
import { Card, Property } from "@/types";
import ManageAssetsModal from "./ManageAssetsModal";

interface ModalsProps {
    property: Property | null;
    card: Card | null;
    onClose: () => void;
    onBuyProperty?: (propertyId: number) => void;
    showManageAssetsModal?: boolean;
    playerProperties?: Property[];
    onMortgage?: (propertyId: number) => void;
    onUnmortgage?: (propertyId: number) => void;
    onSellHouse?: (propertyId: number) => void;
}

const Modals: React.FC<ModalsProps> = ({
    property,
    card,
    onClose,
    onBuyProperty,
    showManageAssetsModal,
    playerProperties,
    onMortgage,
    onUnmortgage,
    onSellHouse,
}) => {
    if (!property && !card && !showManageAssetsModal) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            {property && (
                <div className="max-w-100 w-9/10 bg-neutral-800 border border-neutral-500 rounded-lg">
                    <div className="flex justify-between items-center p-4 border-b border-b-zinc-500/30">
                        <h3 className="text-xl font-semibold">
                            {property.name}
                        </h3>
                        <button
                            className="border-0 bg-transparent text-white text-2xl cursor-pointer p-0 size-6 flex items-center justify-center"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        <div className="text-cyan-500 text-base/normal font-semibold">
                            Price: {property.price}
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="text-lg font-semibold">
                                Rent Structure:
                            </h4>
                            {property.group === "utility" ? (
                                <div className="text-xs/normal">
                                    If one utility is owned, rent is 4 times
                                    amount shown on dice. If both are owned,
                                    rent is 10 times amount shown on dice.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {property.rent &&
                                        property.rent.map((rent, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between text-xs/normal"
                                            >
                                                <span>
                                                    {property.group ===
                                                    "railroad"
                                                        ? `With ${
                                                              index + 1
                                                          } Railroad${
                                                              index > 0
                                                                  ? "s"
                                                                  : ""
                                                          }`
                                                        : index === 0
                                                        ? "Base Rent"
                                                        : index === 5
                                                        ? "With Hotel"
                                                        : `With ${index} House${
                                                              index > 1
                                                                  ? "s"
                                                                  : ""
                                                          }`}
                                                </span>
                                                <span>{rent}</span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={() =>
                                    onBuyProperty &&
                                    property &&
                                    property.id &&
                                    onBuyProperty(property.id)
                                }
                            >
                                Buy Property
                            </Button>
                            <Button
                                onClick={onClose}
                                className="border border-neutral-500 bg-neutral-500/25 text-white hover:bg-neutral-400/25"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {card && (
                <div className="max-w-100 w-9/10 bg-neutral-800 border border-neutral-500 rounded-lg">
                    <div className="flex justify-between items-center p-4 border-b border-b-zinc-500/30">
                        <h3 className="text-xl font-semibold">
                            {card.cardType === "chance"
                                ? "Chance Card"
                                : "Community Chest"}
                        </h3>
                        <button
                            className="border-0 bg-transparent text-white text-2xl cursor-pointer p-0 size-6 flex items-center justify-center"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        <div className="text-base text-center">{card.text}</div>
                        <Button onClick={onClose} className="mx-auto min-w-30">
                            Continue
                        </Button>
                    </div>
                </div>
            )}
            {showManageAssetsModal && playerProperties && onMortgage && onUnmortgage && onSellHouse && (
                <ManageAssetsModal
                    properties={playerProperties}
                    onClose={onClose}
                    onMortgage={onMortgage}
                    onUnmortgage={onUnmortgage}
                    onSellHouse={onSellHouse}
                />
            )}
        </div>
    );
};

export default Modals;
