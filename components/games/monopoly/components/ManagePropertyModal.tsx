import { Button } from "@/components/ui/button";
import { Property, Railroad, Utility } from "@/types";
import { X } from "lucide-react";

type ManageableProperty = Property | Railroad | Utility;

interface ManagePropertyModalProps {
    property: ManageableProperty;
    onClose: () => void;
    onMortgage: (propertyId: number) => void;
    onUnmortgage: (propertyId: number) => void;
    onSellHouse: (propertyId: number) => void;
}

const ManagePropertyModal: React.FC<ManagePropertyModalProps> = ({
    property,
    onClose,
    onMortgage,
    onUnmortgage,
    onSellHouse,
}) => {
    const isPropertyWithHouses = (
        prop: ManageableProperty
    ): prop is Property => {
        return (prop as Property).houses !== undefined;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            <div
                className="max-w-md w-11/12 bg-neutral-800 border border-neutral-500 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto scroll-hide"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-b-zinc-500/30">
                    <h3 className="text-2xl font-bold text-cyan-400">
                        {property.name}
                    </h3>
                    <button
                        className="border-0 bg-transparent text-white text-3xl cursor-pointer p-0 size-8 flex items-center justify-center rounded-full hover:bg-neutral-700 transition-colors"
                        onClick={onClose}
                    >
                        <X className="size-6" />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-6">
                    {isPropertyWithHouses(property) &&
                        property.houses === 0 && (
                            <p className="text-base text-neutral-400 text-center">
                                No houses built on this property.
                            </p>
                        )}
                    <div className="flex flex-col gap-4">
                        {property.isMortgaged ? (
                            <Button
                                onClick={() => onUnmortgage(property.id!)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Unmortgage
                            </Button>
                        ) : (
                            <Button
                                onClick={() => onMortgage(property.id!)}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Mortgage
                            </Button>
                        )}
                        {isPropertyWithHouses(property) &&
                            property.houses > 0 && (
                                <Button
                                    onClick={() => onSellHouse(property.id!)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Sell House
                                </Button>
                            )}
                        <Button
                            onClick={onClose}
                            className="w-full bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>{" "}
        </div>
    );
};

export default ManagePropertyModal;
