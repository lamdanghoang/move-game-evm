"use client";

import { io } from "socket.io-client";

const URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "https://move-game-evm.onrender.com";

export const socket = io(URL);
