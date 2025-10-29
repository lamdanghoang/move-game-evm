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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    const waitingRooms = rooms.filter((room) => room.status === "waiting");
    const playingRooms = rooms.filter((room) => room.status === "playing");
    const finishedRooms = rooms.filter((room) => room.status === "finished");

    const renderRoomCard = (room: Room) => {
        const isFull = room.game_state.players.length >= 4;

        const isPlaying = room.status === "playing";

        const isFinished = room.status === "finished";

        return (
            <Card
                key={room.id}
                className="relative bg-linear-to-br from-card/60 to-card/40 border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-start text-xl font-semibold text-foreground">
                        <span className="truncate mr-2">{room.room_name}</span>

                        <div className="flex items-center gap-2">
                            {room.status === "featured" && (
                                <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Featured
                                </span>
                            )}

                            {isFinished ? (
                                <span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Finished
                                </span>
                            ) : isPlaying ? (
                                <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Playing
                                </span>
                            ) : (
                                <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    Waiting
                                </span>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-3">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center text-muted-foreground text-sm">
                            <Users className="mr-2 h-4 w-4 text-primary" />

                            <span className="font-medium text-foreground">
                                {`${room.game_state.players.length}/4 Players`}
                            </span>

                            {isFull && (
                                <span className="ml-3 text-red-500 font-semibold">
                                    (Full)
                                </span>
                            )}
                        </div>

                        <Button
                            onClick={() => handleJoinRoom(room.id)}
                            disabled={isFull || isFinished}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                        >
                            {isFinished ? (
                                <>
                                    <Play className="mr-2 h-4 w-4" /> View
                                    Results
                                </>
                            ) : isFull ? (
                                "Full"
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" /> Join Room
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div
            className="min-h-screen py-12 bg-gray-900 text-white relative overflow-hidden"
            style={{
                backgroundImage: "url('/monopoly-bg.jpg')", // Assuming you have a suitable background image in public folder
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>{" "}
            {/* Gradient Overlay */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow-lg text-center sm:text-left">
                        Monopoly Rooms
                    </h1>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Create New Room
                    </Button>
                </div>

                {rooms.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 py-16">
                        <p className="text-xl md:text-2xl font-bold mb-4">
                            No rooms available.
                        </p>
                        <p className="text-lg md:text-xl">
                            Be the first to create a new room to start playing!
                        </p>
                    </div>
                ) : (
                    <Tabs defaultValue="waiting" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-6 bg-transparent max-w-2xl mx-auto">
                            <TabsTrigger
                                value="waiting"
                                className="relative text-base text-gray-400 hover:text-white transition-colors duration-300 py-3 px-4 group cursor-pointer"
                            >
                                Waiting ({waitingRooms.length})
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-green-500 transition-all duration-300 scale-x-0 group-data-[state=active]:scale-x-100"></span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="playing"
                                className="relative text-base text-gray-400 hover:text-white transition-colors duration-300 py-3 px-4 group cursor-pointer"
                            >
                                Playing ({playingRooms.length})
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-blue-500 transition-all duration-300 scale-x-0 group-data-[state=active]:scale-x-100"></span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="finished"
                                className="relative text-base text-gray-400 hover:text-white transition-colors duration-300 py-3 px-4 group cursor-pointer"
                            >
                                Finished ({finishedRooms.length})
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-gray-500 transition-all duration-300 scale-x-0 group-data-[state=active]:scale-x-100"></span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="waiting">
                            {waitingRooms.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {waitingRooms.map(renderRoomCard)}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-lg">
                                    No waiting rooms available at the moment.
                                </p>
                            )}
                        </TabsContent>
                        <TabsContent value="playing">
                            {playingRooms.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {playingRooms.map(renderRoomCard)}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-lg">
                                    No playing rooms available at the moment.
                                </p>
                            )}
                        </TabsContent>
                        <TabsContent value="finished">
                            {finishedRooms.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {finishedRooms.map(renderRoomCard)}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8 text-lg">
                                    No finished rooms available at the moment.
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                )}

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
