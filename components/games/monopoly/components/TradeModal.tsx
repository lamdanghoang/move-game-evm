import { Player, Property, TradeDetails } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    players: Player[];
    properties: { [key: number]: Property };
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
    const [offeredMoney, setOfferedMoney] = useState(0);
    const [requestedMoney, setRequestedMoney] = useState(0);

    if (!isOpen) return null;

    const handleTrade = () => {
        if (selectedPlayerId === null) {
            console.error("No player selected for trade.");
            return;
        }
        if (offeredMoney > currentPlayer.money) {
            console.error("You don't have enough money to make this offer.");
            return;
        }
        const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
        if (selectedPlayer && requestedMoney > selectedPlayer.money) {
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
            offeredMoney,
            requestedMoney,
        });
    };

    const otherPlayers = players.filter((p) => p.id !== currentPlayer.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-1/2 bg-neutral-800 border-zinc-500/20 text-white">
                <CardHeader>
                    <CardTitle className="text-cyan-500">Trade</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-1/2 flex flex-col gap-2">
                            <h4 className="text-sm font-semibold">
                                Your Offer
                            </h4>
                            <div>
                                <Label>Money:</Label>
                                <Input
                                    type="number"
                                    value={offeredMoney}
                                    onChange={(e) =>
                                        setOfferedMoney(
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="bg-neutral-700"
                                />
                            </div>
                            <div>
                                <Label>Properties:</Label>
                                <div className="flex flex-col gap-1">
                                    {currentPlayer.properties.map((propId) => (
                                        <div
                                            key={propId}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
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
                                            <span>
                                                {properties[propId]?.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <h4 className="text-sm font-semibold">
                                Their Offer
                            </h4>
                            <select
                                onChange={(e) =>
                                    setSelectedPlayerId(e.target.value)
                                }
                                className="bg-neutral-700 p-2 rounded"
                            >
                                <option>Select Player</option>
                                {otherPlayers.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {selectedPlayerId && (
                                <>
                                    <div>
                                        <Label>Money:</Label>
                                        <Input
                                            type="number"
                                            value={requestedMoney}
                                            onChange={(e) =>
                                                setRequestedMoney(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="bg-neutral-700"
                                        />
                                    </div>
                                    <div>
                                        <Label>Properties:</Label>
                                        <div className="flex flex-col gap-1">
                                            {players
                                                .find(
                                                    (p) =>
                                                        p.id ===
                                                        selectedPlayerId
                                                )
                                                ?.properties.map((propId) => (
                                                    <div
                                                        key={propId}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <input
                                                            type="checkbox"
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
                                                        <span>
                                                            {
                                                                properties[
                                                                    propId
                                                                ]?.name
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={handleTrade}
                            disabled={!selectedPlayerId}
                        >
                            Propose Trade
                        </Button>
                        <Button onClick={onClose} variant="destructive">
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TradeModal;
