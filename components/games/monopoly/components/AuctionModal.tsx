import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auction } from "@/types";

interface AuctionableProperty {
    name: string;
    price: number;
}

interface AuctionModalProps {
    auction: Auction | null;
    property: AuctionableProperty | null;
    onPlaceBid: (amount: number) => void;
    playerBalance: number;
}

const AuctionModal: React.FC<AuctionModalProps> = ({
    auction,
    property,
    onPlaceBid,
    playerBalance,
}) => {
    const [bidAmount, setBidAmount] = useState("");

    useEffect(() => {
        if (auction) {
            setBidAmount(String(auction.highestBid + 1));
        }
    }, [auction?.highestBid]);

    if (!auction || !property) {
        return null;
    }

    const handleBid = () => {
        const amount = parseInt(bidAmount, 10);
        if (!isNaN(amount) && amount > auction.highestBid) {
            onPlaceBid(amount);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900/80 border-2 border-amber-500/30 text-white shadow-lg shadow-amber-500/20 rounded-2xl w-full max-w-md">
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-amber-400 text-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                        Auction for {property.name}
                    </h2>
                    <p className="text-neutral-400 mt-2">
                        Original Price: ${property.price}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center bg-neutral-800/50 p-4 rounded-lg">
                        <div className="text-center">
                            <p className="text-sm text-neutral-400">
                                Time Remaining
                            </p>
                            <p className="text-3xl font-bold text-amber-400">
                                {auction.timer}s
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-neutral-400">
                                Highest Bid
                            </p>
                            <p className="text-3xl font-bold text-white">
                                ${auction.highestBid}
                            </p>
                            <p className="text-xs text-neutral-500">
                                by {auction.highestBidderName || "No one"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-center mb-4">
                        <p className="text-sm text-neutral-400">Your Balance</p>
                        <p className="text-xl font-bold text-white">
                            ${playerBalance}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`Enter bid > $${auction.highestBid}`}
                            className="no-arrows bg-neutral-900 border-neutral-700 focus:border-amber-500 focus:ring-amber-500 transition-all text-center text-xl"
                        />
                        <Button
                            onClick={handleBid}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3"
                            disabled={
                                parseInt(bidAmount, 10) <= auction.highestBid
                            }
                        >
                            Place Bid
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionModal;
