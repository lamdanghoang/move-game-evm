import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
    text: string;
}

interface ChatProps {
    messages: ChatMessage[];
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
    return (
        <div className="bg-neutral-800 border border-zinc-500/20 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-base text-cyan-500 text-shadow-[0_0_10px_rgba(50,184,198,0.5)] font-semibold">
                Stream Chat
            </h3>
            <div className="p-2 h-50 flex flex-col gap-2 bg-zinc-500/15 rounded-lg scroll-hide">
                {messages.map((msg, index) => (
                    <div key={index} className="text-xs/normal">
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    type="text"
                    className="border border-neutral-500/30 focus-visible:ring-transparent focus-visible:border-neutral-500/30"
                    placeholder="Type a message..."
                />
                <Button>Send</Button>
            </div>
        </div>
    );
};

export default Chat;
