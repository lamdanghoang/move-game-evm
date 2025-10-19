"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateRoomModal from "@/components/games/monopoly/CreateRoomModal";
import { supabase } from "@/lib/supabaseClient";
import { socket } from "@/lib/socketClient";
import { Room } from "@/types";
import { useAccount } from "wagmi";

const MonopolyLobby = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { address } = useAccount();

    useEffect(() => {
        const fetchRooms = async () => {
            const { data, error } = await supabase.from("rooms").select("*");
            if (error) {
                console.error("Error fetching rooms:", error);
            } else {
                setRooms(data as Room[]);
            }
        };

        fetchRooms();

        const subscription = supabase
            .channel("rooms")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "rooms" },
                (payload) => {
                    fetchRooms();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        socket.on("game_created", ({ roomId }) => {
            handleJoinRoom(roomId);
        });

        return () => {
            socket.off("game_created");
        };
    }, []);

    const handleCreateRoom = (roomName: string) => {
        if (!address) return;

        socket.emit("create_game", {
            roomName,
            address,
        });
        setIsModalOpen(false);
    };

    const handleJoinRoom = (roomId: string) => {
        router.push(`/games/monopoly/${roomId}`);
    };

    return (
        <div
            className="min-h-screen py-8 bg-cover bg-center"
            style={{
                backgroundImage: "url('/path/to/your/background-image.jpg')",
            }}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        Monopoly Rooms
                    </h1>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create Room
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <Card
                                key={room.id}
                                className="bg-card/50 border-border/50 hover:border-primary transition-all duration-300"
                            >
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{room.room_name}</span>
                                        {room.status === "featured" && (
                                            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            <span>{`${room.game_state.players.length}/4`}</span>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                handleJoinRoom(room.id)
                                            }
                                        >
                                            <Play className="mr-2 h-4 w-4" />{" "}
                                            Join
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-muted-foreground">
                            <p>
                                No rooms available. Create a new room to start
                                playing!
                            </p>
                        </div>
                    )}
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
