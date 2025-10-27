import { Button } from "@/components/ui/button";

interface BuyableProperty {
    name: string;
    price: number;
}

interface BuyOrAuctionModalProps {
    property: BuyableProperty | null;
    onBuy: () => void;
    onAuction: () => void;
}

const BuyOrAuctionModal: React.FC<BuyOrAuctionModalProps> = ({
  property,
  onBuy,
  onAuction,
}) => {
  if (!property) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900/80 border-2 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/20 rounded-2xl w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cyan-400 text-shadow-[0_0_10px_rgba(50,184,198,0.5)]">
            You landed on {property.name}
          </h2>
          <p className="text-neutral-400 mt-2">
            Price: ${property.price}
          </p>
        </div>

        <div className="mt-6 flex justify-around">
          <Button
            onClick={onBuy}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6"
          >
            Buy Property
          </Button>
          <Button
            onClick={onAuction}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6"
          >
            Start Auction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyOrAuctionModal;
