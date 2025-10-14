import { Player, Property, TradeDetails } from "@/types";
import { useState } from "react";

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    players: Player[];
    properties: { [key: number]: Property };
    onTrade: (tradeDetails: TradeDetails) => void;
    currentPlayer: Player;
}

const TradeModal = ({ isOpen, onClose, players, properties, onTrade, currentPlayer }: TradeModalProps) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [offeredProperties, setOfferedProperties] = useState<number[]>([]);
    const [requestedProperties, setRequestedProperties] = useState<number[]>([]);
    const [offeredMoney, setOfferedMoney] = useState(0);
    const [requestedMoney, setRequestedMoney] = useState(0);

    if (!isOpen) return null;

    const handleTrade = () => {
        if (selectedPlayerId === null) {
            console.error("No player selected for trade.");
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

    const otherPlayers = players.filter(p => p.id !== currentPlayer.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3 w-1/2">
                <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                    Trade
                </h3>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <h4 className="text-sm font-semibold">Your Offer</h4>
                        <div>
                            <label>Money:</label>
                            <input type="number" value={offeredMoney} onChange={(e) => setOfferedMoney(parseInt(e.target.value))} className="bg-neutral-700 text-white p-1 rounded" />
                        </div>
                        <div>
                            <label>Properties:</label>
                            {currentPlayer.properties.map(propId => (
                                <div key={propId}>
                                    <input type="checkbox" onChange={(e) => {
                                        if (e.target.checked) {
                                            setOfferedProperties([...offeredProperties, propId]);
                                        } else {
                                            setOfferedProperties(offeredProperties.filter(id => id !== propId));
                                        }
                                    }} />
                                    {properties[propId]?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <h4 className="text-sm font-semibold">Their Offer</h4>
                        <select onChange={(e) => setSelectedPlayerId(parseInt(e.target.value))} className="bg-neutral-700 text-white p-1 rounded">
                            <option>Select Player</option>
                            {otherPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {selectedPlayerId && (
                            <>
                                <div>
                                    <label>Money:</label>
                                    <input type="number" value={requestedMoney} onChange={(e) => setRequestedMoney(parseInt(e.target.value))} className="bg-neutral-700 text-white p-1 rounded" />
                                </div>
                                <div>
                                    <label>Properties:</label>
                                    {players.find(p => p.id === selectedPlayerId)?.properties.map(propId => (
                                        <div key={propId}>
                                            <input type="checkbox" onChange={(e) => {
                                                if (e.target.checked) {
                                                    setRequestedProperties([...requestedProperties, propId]);
                                                } else {
                                                    setRequestedProperties(requestedProperties.filter(id => id !== propId));
                                                }
                                            }} />
                                            {properties[propId]?.name}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={handleTrade} disabled={!selectedPlayerId} className="text-xs bg-cyan-500 text-white px-2 py-1 rounded disabled:bg-gray-500 disabled:cursor-not-allowed">Propose Trade</button>
                    <button onClick={onClose} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;