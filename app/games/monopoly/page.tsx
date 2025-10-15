"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateRoomModal from "@/components/games/monopoly/CreateRoomModal";

const MonopolyLobby = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState([
        { id: "1", name: "Classic Monopoly", players: 2, maxPlayers: 4 },
        { id: "2", name: "Speed Monopoly", players: 3, maxPlayers: 4 },
        { id: "3", name: "High Rollers", players: 1, maxPlayers: 2 },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateRoom = (roomName: string) => {
        const newRoom = {
            id: (rooms.length + 1).toString(),
            name: roomName,
            players: 1,
            maxPlayers: 4,
        };
        setRooms([...rooms, newRoom]);
        setIsModalOpen(false);
    };

    const handleJoinRoom = (roomId: string) => {
        router.push(`/games/monopoly/${roomId}`);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Monopoly Rooms</h1>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create Room
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <Card key={room.id} className="bg-card/50 border-border/50">
                            <CardHeader>
                                <CardTitle>{room.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>{`${room.players}/${room.maxPlayers}`}</span>
                                    </div>
                                    <Button onClick={() => handleJoinRoom(room.id)}>
                                        <Play className="mr-2 h-4 w-4" /> Join
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <CreateRoomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreateRoom={handleCreateRoom}
                />
            </div>
        </div>
    );
};

export default MonopolyLobby;
