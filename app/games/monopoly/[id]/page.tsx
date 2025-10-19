"use client";

import { useParams } from "next/navigation";
import MonopolyGame from "@/components/pages/games/MonopolyGame";
import { useEffect } from "react";
import { socket } from "@/lib/socketClient";
import { useAccount } from "wagmi";

const MonopolyRoomPage = () => {
    const params = useParams();
    const { id: roomId } = params;
    const { address } = useAccount();

    useEffect(() => {
        if (roomId && address) {
            socket.emit("join_game", { roomId, address });
        }
    }, []);

    return <MonopolyGame />;
};

export default MonopolyRoomPage;
