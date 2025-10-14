import { Button } from "@/components/ui/button";
import { Card, Property } from "@/types";

interface ModalsProps {
    property: Property | null;
    card: Card | null;
    onClose: () => void;
}

const Modals: React.FC<ModalsProps> = ({ property, card, onClose }) => {
    if (!property && !card) return null;

    return (
        <div className="fixed top-0 left-0 bg-black/80 items-center justify-center z-100">
            {property && (
                <div className={`modalContent propertyCard`}>
                    <div className="propertyHeader">
                        <h3 className="text-xl font-semibold">
                            {property.name}
                        </h3>
                        <button className="closeBtn" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="propertyBody">
                        <div className="text-cyan-500 text-base/normal font-semibold">
                            Price: {property.price}
                        </div>
                        <div className="rentStructure">
                            <h4 className="text-lg font-semibold">
                                Rent Structure:
                            </h4>
                            <div className="flex flex-col gap-4">
                                {property.rent.map((rent, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between text-xs/normal"
                                    >
                                        <span>
                                            {index === 0
                                                ? "Base Rent"
                                                : `With ${index} House${
                                                      index > 1 ? "s" : ""
                                                  }`}
                                        </span>
                                        <span>{rent}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="propertyActions">
                            <Button>Buy Property</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
            {card && (
                <div className={`modalContent gameCard`}>
                    <div className="cardHeader">
                        <h3>
                            {card.action.includes("chance")
                                ? "Chance Card"
                                : "Community Chest"}
                        </h3>
                        <button className="closeBtn" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="cardBody">
                        <div className="cardText">{card.text}</div>
                        <button className="btn" onClick={onClose}>
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modals;
