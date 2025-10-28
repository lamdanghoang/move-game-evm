import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { useState } from "react";
import ManagePropertyModal from "./ManagePropertyModal";
import { X } from "lucide-react";

interface ManageAssetsModalProps {
    properties: Property[];
    onClose: () => void;
    onMortgage: (propertyId: number) => void;
    onUnmortgage: (propertyId: number) => void;
    onSellHouse: (propertyId: number) => void;
}

const ManageAssetsModal: React.FC<ManageAssetsModalProps> = ({
    properties,
    onClose,
    onMortgage,
    onUnmortgage,
    onSellHouse,
}) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null
    );

    const handleManageProperty = (property: Property) => {
        setSelectedProperty(property);
    };

    const handleCloseManageProperty = () => {
        setSelectedProperty(null);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            <div
                className="max-w-lg w-full bg-neutral-800 border border-neutral-500 rounded-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-b-zinc-500/30">
                    <h3 className="text-2xl font-bold text-cyan-400">
                        Manage Assets
                    </h3>
                    <button
                        className="border-0 bg-transparent text-white text-3xl cursor-pointer p-0 size-8 flex items-center justify-center rounded-full hover:bg-neutral-700 transition-colors"
                        onClick={onClose}
                    >
                        <X className="size-6" />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-6 max-h-[calc(80vh-120px)] overflow-y-auto scroll-hide">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {properties.map((property) => (
                            <div
                                key={property.id}
                                className="p-4 bg-neutral-700/50 border border-neutral-600 rounded-lg shadow-md hover:bg-neutral-700 transition-colors flex flex-col gap-2"
                            >
                                <p className="text-lg font-semibold text-white">
                                    {property.name}
                                </p>
                                <Button
                                    onClick={() =>
                                        handleManageProperty(property)
                                    }
                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Manage
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-t-zinc-500/30 flex justify-center">
                    <Button
                        onClick={onClose}
                        className="w-full bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Done
                    </Button>
                </div>
            </div>
            {selectedProperty && (
                <ManagePropertyModal
                    property={selectedProperty}
                    onClose={handleCloseManageProperty}
                    onMortgage={onMortgage}
                    onUnmortgage={onUnmortgage}
                    onSellHouse={onSellHouse}
                />
            )}
        </div>
    );
};

export default ManageAssetsModal;
