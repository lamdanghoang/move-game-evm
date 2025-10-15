"use client";

import { useParams } from "next/navigation";
import MonopolyGame from "@/components/pages/games/MonopolyGame";

const MonopolyRoomPage = () => {
    const params = useParams();
    const { id: roomId } = params;

    // TODO: Fetch room data using roomId

    return <MonopolyGame />;
};

export default MonopolyRoomPage;
