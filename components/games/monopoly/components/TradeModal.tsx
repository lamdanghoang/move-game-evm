import { Player, Property, Railroad, Utility, TradeDetails } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OwnableAsset = Property | Railroad | Utility;

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    players: Player[];
    properties: { [key: number]: OwnableAsset };
    onTrade: (tradeDetails: TradeDetails) => void;
    currentPlayer: Player;
}

const TradeModal = ({
    isOpen,
    onClose,
    players,
    properties,
    onTrade,
    currentPlayer,
}: TradeModalProps) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
        null
    );
    const [offeredProperties, setOfferedProperties] = useState<number[]>([]);
    const [requestedProperties, setRequestedProperties] = useState<number[]>(
        []
    );
    const [offeredMoney, setOfferedMoney] = useState("0");
    const [requestedMoney, setRequestedMoney] = useState("0");

    if (!isOpen) return null;

    const handleTrade = () => {
        if (selectedPlayerId === null) {
            console.error("No player selected for trade.");
            return;
        }
        const offeredMoneyValue = parseInt(offeredMoney) || 0;
        const requestedMoneyValue = parseInt(requestedMoney) || 0;

        if (offeredMoneyValue > currentPlayer.money) {
            console.error("You don't have enough money to make this offer.");
            return;
        }
        const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
        if (selectedPlayer && requestedMoneyValue > selectedPlayer.money) {
            console.error(
                "The other player doesn't have enough money for this trade."
            );
            return;
        }

        onTrade({
            fromPlayerId: currentPlayer.id,
            toPlayerId: selectedPlayerId,
            offeredProperties,
            requestedProperties,
            offeredMoney: offeredMoneyValue,
            requestedMoney: requestedMoneyValue,
        });
    };

    const otherPlayers = players.filter((p) => p.id !== currentPlayer.id);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-3/4 h-5/6 max-w-4xl bg-neutral-900/80 border-2 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/20 rounded-2xl flex flex-col">
                <CardHeader className="border-b border-cyan-500/20 shrink-0">
                    <CardTitle className="text-cyan-400 text-2xl font-bold text-shadow-[0_0_10px_rgba(50,184,198,0.5)]">
                        Propose Trade
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 grid grid-cols-2 gap-6 grow overflow-hidden h-full">
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-full scroll-hide">
                        <h4 className="text-lg font-semibold text-cyan-300">
                            Your Offer
                        </h4>
                        <div className="flex flex-col gap-4 p-4 rounded-lg bg-neutral-800/50 border border-cyan-500/20 overflow-y-auto scroll-hide max-h-80">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm text-neutral-400">
                                    Money:
                                </Label>
                                <Input
                                    type="number"
                                    value={offeredMoney}
                                    onChange={(e) =>
                                        setOfferedMoney(e.target.value)
                                    }
                                    className="no-arrows bg-neutral-900 border-neutral-700 focus:border-cyan-500 focus:ring-cyan-500 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm text-neutral-400">
                                    Properties:
                                </Label>
                                <div className="max-h-48 overflow-y-auto scroll-hide p-2 rounded-md bg-neutral-900/50 border border-neutral-700/50">
                                    {currentPlayer.properties.map((propId) => (
                                        <div
                                            key={propId}
                                            className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800/70 transition-colors"
                                        >
                                            <input
                                                id={`offer-${propId}`}
                                                type="checkbox"
                                                className="appearance-none h-4 w-4 border-2 border-cyan-500/50 rounded-sm bg-neutral-800 checked:bg-cyan-500 checked:border-transparent focus:outline-none transition-all"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setOfferedProperties([
                                                            ...offeredProperties,
                                                            propId,
                                                        ]);
                                                    } else {
                                                        setOfferedProperties(
                                                            offeredProperties.filter(
                                                                (id) =>
                                                                    id !==
                                                                    propId
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                            <Label
                                                htmlFor={`offer-${propId}`}
                                                className="text-sm text-neutral-300 cursor-pointer"
                                            >
                                                {properties[propId]?.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-full scroll-hide">
                        <h4 className="text-lg font-semibold text-cyan-300">
                            Their Request
                        </h4>
                        <div className="flex flex-col gap-4 p-4 rounded-lg bg-neutral-800/50 border border-cyan-500/20 overflow-y-auto scroll-hide max-h-80">
                            <select
                                onChange={(e) =>
                                    setSelectedPlayerId(e.target.value)
                                }
                                className="bg-neutral-900 border-neutral-700 p-2 rounded-md focus:border-cyan-500 focus:ring-cyan-500 transition-all text-sm"
                            >
                                <option value="">Select Player</option>
                                {otherPlayers.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {selectedPlayerId && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-sm text-neutral-400">
                                            Money:
                                        </Label>
                                        <Input
                                            type="number"
                                            value={requestedMoney}
                                            onChange={(e) =>
                                                setRequestedMoney(
                                                    e.target.value
                                                )
                                            }
                                            className="no-arrows bg-neutral-900 border-neutral-700 focus:border-cyan-500 focus:ring-cyan-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-sm text-neutral-400">
                                            Properties:
                                        </Label>
                                        <div className="max-h-48 overflow-y-auto scroll-hide p-2 rounded-md bg-neutral-900/50 border border-neutral-700/50">
                                            {players
                                                .find(
                                                    (p) =>
                                                        p.id ===
                                                        selectedPlayerId
                                                )
                                                ?.properties.map((propId) => (
                                                    <div
                                                        key={propId}
                                                        className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800/70 transition-colors"
                                                    >
                                                        <input
                                                            id={`request-${propId}`}
                                                            type="checkbox"
                                                            className="appearance-none h-4 w-4 border-2 border-cyan-500/50 rounded-sm bg-neutral-800 checked:bg-cyan-500 checked:border-transparent focus:outline-none transition-all"
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    setRequestedProperties(
                                                                        [
                                                                            ...requestedProperties,
                                                                            propId,
                                                                        ]
                                                                    );
                                                                } else {
                                                                    setRequestedProperties(
                                                                        requestedProperties.filter(
                                                                            (
                                                                                id
                                                                            ) =>
                                                                                id !==
                                                                                propId
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor={`request-${propId}`}
                                                            className="text-sm text-neutral-300 cursor-pointer"
                                                        >
                                                            {
                                                                properties[
                                                                    propId
                                                                ]?.name
                                                            }
                                                        </Label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
                <div className="flex justify-end gap-4 p-6 border-t border-cyan-500/20 shrink-0">
                    <Button
                        onClick={onClose}
                        variant="destructive"
                        className="btn-secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTrade}
                        disabled={!selectedPlayerId}
                        className="btn-primary"
                    >
                        Propose Trade
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default TradeModal;
