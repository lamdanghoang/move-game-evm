"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socketClient";
import { Player } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
    sender: {
        id: string;
        name: string;
    };
    text: string;
    timestamp: string;
}

interface ChatProps {
    currentPlayer: Player | undefined;
}

const Chat: React.FC<ChatProps> = ({ currentPlayer }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const params = useParams();
    const { id: roomId } = params;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleChatMessage = (newMessage: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on("chat_message", handleChatMessage);

        return () => {
            socket.off("chat_message", handleChatMessage);
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim() && currentPlayer && roomId) {
            const newMessage: ChatMessage = {
                sender: {
                    id: currentPlayer.id,
                    name: currentPlayer.name,
                },
                text: message,
                timestamp: new Date().toISOString(),
            };
            socket.emit("send_chat_message", { roomId, message: newMessage });
            setMessage("");
        }
    };

    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Stream Chat
            </h3>
            <div className="p-2 h-50 flex flex-col gap-2 bg-zinc-500/15 rounded-lg overflow-y-auto scroll-hide">
                {messages.map((msg, index) => (
                    <div key={index} className="text-xs/normal">
                        <span className="font-bold" style={{ color: msg.sender.id === currentPlayer?.id ? currentPlayer.color : 'white' }}>
                            {msg.sender.name}:
                        </span>{" "}
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="border border-neutral-500/30 focus-visible:ring-transparent focus-visible:border-neutral-500/30"
                    placeholder="Type a message..."
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </div>
        </div>
    );
};

export default Chat;
