"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateRoom: (roomName: string) => void;
}

const CreateRoomModal = ({
    isOpen,
    onClose,
    onCreateRoom,
}: CreateRoomModalProps) => {
    const [roomName, setRoomName] = useState("");

    const handleCreate = () => {
        if (roomName.trim()) {
            onCreateRoom(roomName.trim());
            setRoomName("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create a new room</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="room-name">Room Name</Label>
                            <Input
                                id="room-name"
                                placeholder="Enter room name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate}>Create</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateRoomModal;
