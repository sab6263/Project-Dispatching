import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock, User, CheckCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_UNITS } from '../../data/mockData';

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: Date;
    isMe: boolean;
    read: boolean;
}

export const SecureChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'Florian München 1/46-1', text: 'Status 3, Anfahrt Einsatzort.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isMe: false, read: true },
        { id: '2', sender: 'ELW', text: 'Verstanden. Vorsicht an der Kreuzung Isarring.', timestamp: new Date(Date.now() - 1000 * 60 * 4), isMe: true, read: true },
        { id: '3', sender: 'Florian München 1/46-1', text: 'Roger. Melden uns bei Eintreffen.', timestamp: new Date(Date.now() - 1000 * 60 * 3), isMe: false, read: true },
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'ELW',
            text: input,
            timestamp: new Date(),
            isMe: true,
            read: false
        };

        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'Florian München 1/46-1',
                text: 'Verstanden, Ende.',
                timestamp: new Date(),
                isMe: false,
                read: true
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-surface rounded-xl border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-surfaceHighlight/30 flex items-center justify-between">
                <h3 className="font-semibold text-textMain tracking-wide flex items-center gap-2 text-sm">
                    <Lock className="w-3 h-3 text-success" /> SICHERE KOMMUNIKATION
                </h3>
                <div className="flex -space-x-2">
                    {MOCK_UNITS.slice(0, 3).map(u => (
                        <div key={u.id} className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] text-textMuted" title={u.callSign}>
                            <User className="w-3 h-3" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                        <div className={cn(
                            "px-3 py-2 rounded-lg text-sm",
                            msg.isMe ? "bg-primary text-black rounded-tr-none" : "bg-surfaceHighlight text-textMain border border-border rounded-tl-none"
                        )}>
                            {msg.text}
                        </div>
                        <div className="text-[10px] text-textMuted mt-1 flex items-center gap-1">
                            {msg.isMe && msg.read && <CheckCheck className="w-3 h-3 text-success" />}
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-border bg-surfaceHighlight/10 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Nachricht an alle Einheiten..."
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-textMuted"
                />
                <button type="submit" className="p-2 bg-primary text-black rounded-lg hover:bg-primaryHover transition-colors">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};
