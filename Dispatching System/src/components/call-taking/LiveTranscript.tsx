import React, { useEffect, useState, useRef } from 'react';
import { Mic, PauseCircle, PlayCircle, PanelLeftClose, PanelLeftOpen, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCAD } from '../../context/CADContext';

const MOCK_TRANSCRIPT_STREAM = [
    "Emergency Dispatch Fire and Rescue, what is the location of the emergency?",
    "Hello, this is Miller. At 45 Leopold Street, smoke is coming out of the window!",
    "Okay, 45 Leopold Street. Which floor?",
    "Third floor, I think. It's the large building on the corner.",
    "Are there any persons inside the apartment?",
    "I'm not sure, but an elderly lady lives there. I rang the doorbell but no answer.",
    "Understood. We are dispatching units immediately. Do you see flames?",
    "Not yet, but the smoke is getting thicker and it is black.",
    "Please wait on the street and guide the fire department. Do not put yourself in danger.",
    "Yes, I will. Please hurry!",
];

interface LiveTranscriptProps {
    onToggleCollapse?: () => void;
    isCollapsed?: boolean;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ onToggleCollapse, isCollapsed }) => {
    const { activeCall, setActiveCall, activeTranscriptHighlight } = useCAD();
    // Initialize with existing data or at least the first line (Dispatcher)
    const [lines, setLines] = useState<string[]>(activeCall.transcript?.length ? activeCall.transcript : [MOCK_TRANSCRIPT_STREAM[0]]);
    const [isPaused] = useState(false);
    // Start index: if we have lines, start from length, else 1 (since 0 is already set)
    const [currentIndex, setCurrentIndex] = useState(activeCall.transcript?.length || 1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [confidenceScore, setConfidenceScore] = useState(92);
    const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);
    const [isListening, setIsListening] = useState(true);
    const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
    const [hasNewMessages, setHasNewMessages] = useState(false);

    useEffect(() => {
        // Fluctuate confidence slightly for realism
        const interval = setInterval(() => {
            setConfidenceScore(prev => Math.min(99, Math.max(85, prev + (Math.random() - 0.5) * 5)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isPaused || currentIndex >= MOCK_TRANSCRIPT_STREAM.length) return;

        const timeout = setTimeout(() => {
            const newLine = MOCK_TRANSCRIPT_STREAM[currentIndex];
            if (!newLine) return;

            setLines(prev => [...prev, newLine]);
            setActiveCall(prev => ({
                ...prev,
                transcript: [...(prev.transcript || []), newLine]
            }));

            setCurrentIndex(prev => prev + 1);

            // If auto-scroll is paused, notify user about new messages
            if (isAutoScrollPaused) {
                setHasNewMessages(true);
            }
        }, 2000); // 2 seconds between lines

        return () => clearTimeout(timeout);
    }, [currentIndex, isPaused, setActiveCall, isAutoScrollPaused]);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current && !isAutoScrollPaused) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, isAutoScrollPaused]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Detect if we are at the bottom (with some tolerance)
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

            if (isAtBottom) {
                setIsAutoScrollPaused(false);
                setHasNewMessages(false);
            } else {
                setIsAutoScrollPaused(true);
            }
        }
    };

    const resumeAutoScroll = () => {
        setIsAutoScrollPaused(false);
        setHasNewMessages(false);
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handleDragStart = (e: React.DragEvent, text: string, type: string) => {
        e.dataTransfer.setData("text/plain", text);
        // Context-Aware Logic: Add specific MIME type
        e.dataTransfer.setData(`application/x-cad-${type}`, text);
        e.dataTransfer.effectAllowed = "copy";
    };

    // Helper to highlight keywords and entities
    const renderLine = (text: string, isCaller: boolean) => {
        // --- LOGIC CHANGE: Only Caller (isCaller=true) gets highlighting ---
        if (!isCaller) return text;

        const entities = [
            { text: 'Miller', type: 'callerName', label: 'Name', category: 'Caller' },
            { text: '45 Leopold Street', type: 'location', label: 'Address', category: 'Location' },
            { text: 'smoke', type: 'keyword', label: 'Symptom', category: 'Classification' },
            { text: 'Fire', type: 'code', label: 'Type', category: 'Classification' },
            { text: 'Third floor', type: 'details', label: 'Floor', category: 'Location' },
            { text: 'elderly lady', type: 'notes', label: 'Person', category: 'Caller' },
            { text: 'black', type: 'notes', label: 'Detail', category: 'Hint' },
        ];
        const lowConfidenceWords = ['think', 'not sure'];

        let parts: React.ReactNode[] = [text];

        const getCategoryStyles = (cat: string) => {
            switch (cat) {
                case 'Caller': return "bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/40 hover:border-blue-400";
                case 'Location': return "bg-orange-500/20 text-orange-200 border-orange-500/30 hover:bg-orange-500/40 hover:border-orange-400";
                case 'Classification': return "bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/40 hover:border-purple-400";
                default: return "bg-white/10 text-white border-white/20";
            }
        };

        // 1. Entities
        entities.forEach(entity => {
            const newParts: React.ReactNode[] = [];
            parts.forEach(part => {
                if (typeof part === 'string') {
                    const idx = part.toLowerCase().indexOf(entity.text.toLowerCase());
                    if (idx !== -1) {
                        const before = part.slice(0, idx);
                        const match = part.slice(idx, idx + entity.text.length);
                        const after = part.slice(idx + entity.text.length);
                        if (before) newParts.push(before);
                        newParts.push(
                            <span
                                key={`${entity.type}-${idx}`}
                                id={`transcript-${entity.type}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, match, entity.type)}
                                className={cn(
                                    "inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded cursor-grab active:cursor-grabbing transition-all hover:scale-105 border font-sans", // Reset font for badges? Or keep mono? Keeping Badge distinct.
                                    getCategoryStyles(entity.category),
                                    activeTranscriptHighlight === entity.type && "ring-2 ring-yellow-400 scale-110 z-10"
                                )}
                                title={`Category: ${entity.category}`}
                            >
                                {match}
                                <span className={cn("text-[9px] opacity-60 uppercase tracking-tighter px-1 rounded bg-black/20")}>
                                    {entity.label}
                                </span>
                            </span>
                        );
                        if (after) newParts.push(after);
                    } else { newParts.push(part); }
                } else { newParts.push(part); }
            });
            parts = newParts;
        });

        // 2. Low Confidence
        const finalParts: React.ReactNode[] = [];
        parts.forEach(part => {
            if (typeof part === 'string') {
                let subParts: React.ReactNode[] = [part];
                lowConfidenceWords.forEach(word => {
                    const tempParts: React.ReactNode[] = [];
                    subParts.forEach(sp => {
                        if (typeof sp === 'string') {
                            const idx = sp.toLowerCase().indexOf(word.toLowerCase());
                            if (idx !== -1) {
                                const before = sp.slice(0, idx);
                                const match = sp.slice(idx, idx + word.length);
                                const after = sp.slice(idx + word.length);
                                if (before) tempParts.push(before);
                                tempParts.push(
                                    <span key={`lc-${idx}`} className="underline decoration-wavy decoration-red-500 text-white/70 bg-red-500/10 rounded px-0.5" title="Low Confidence">
                                        {match}
                                    </span>
                                );
                                if (after) tempParts.push(after);
                            } else { tempParts.push(sp); }
                        } else { tempParts.push(sp); }
                    });
                    subParts = tempParts;
                });
                finalParts.push(...subParts);
            } else { finalParts.push(part); }
        });

        return <>{finalParts}</>;
    };

    if (isCollapsed) {
        return (
            <div className="h-full bg-surface border-r border-border flex flex-col items-center py-4 gap-4">
                <button
                    onClick={onToggleCollapse}
                    className="p-2 hover:bg-surfaceHighlight rounded-lg text-textMuted hover:text-white transition-colors"
                    title="Open Transcript"
                >
                    <PanelLeftOpen className="w-5 h-5" />
                </button>
                <div className="writing-mode-vertical text-xs font-bold text-textMuted uppercase tracking-widest opacity-50 select-none">
                    Live Transcript
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-surface rounded-xl border border-border shadow-inner min-h-0 relative overflow-visible">
            <div className="p-3 border-b border-border bg-surfaceHighlight/30 flex justify-between items-center backdrop-blur-sm">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-textMain flex items-center gap-2 text-sm tracking-wide">
                        <div className="relative">
                            <Mic className={cn("w-4 h-4", isListening ? "text-red-500 animate-pulse" : "text-textMuted")} />
                            {isListening && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                        </div>
                        LIVE TRANSCRIPT
                    </h3>
                    <div
                        className="flex items-center gap-2 mt-1 cursor-pointer group relative"
                        onClick={() => setShowConfidenceHelp(!showConfidenceHelp)}
                        title="Click for Details"
                    >
                        <span className="text-[10px] text-textMuted group-hover:text-white transition-colors">AI Confidence:</span>
                        <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-1000"
                                style={{ width: `${confidenceScore}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono text-green-400 group-hover:text-green-300">{confidenceScore.toFixed(0)}%</span>

                        {/* Tooltip */}
                        {showConfidenceHelp && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-neutral-900 border-2 border-neutral-700 rounded-xl p-4 shadow-2xl z-[9999] animate-in fade-in slide-in-from-top-2 text-left ring-2 ring-black/50">
                                <h4 className="text-sm font-bold text-white mb-2">Confidence Analysis</h4>
                                <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-3">
                                    <li>Acoustic Quality: <span className="text-green-400 font-bold">High (98%)</span></li>
                                    <li>Context Validity: <span className="text-green-400 font-bold">Plausible</span></li>
                                    <li>Background Noise: <span className="text-yellow-400 font-bold">Low</span></li>
                                </ul>
                                <div className="mt-3 text-[10px] italic text-neutral-500 border-t border-neutral-800 pt-2">
                                    AI-Model: Whisper-v3-Turbo
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => setIsListening(!isListening)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        title={isListening ? "Pause" : "Resume"}
                    >
                        {isListening ? <PauseCircle className="w-5 h-5 text-textMuted" /> : <PlayCircle className="w-5 h-5 text-primary" />}
                    </button>
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            title="Collapse"
                        >
                            <PanelLeftClose className="w-5 h-5 text-textMuted" />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Transcript Area - Now uses flex to fill available space */}
            <div
                className="flex-1 min-h-0 w-full overflow-y-auto p-4 space-y-4 scroll-smooth border-t border-white/5 bg-black/20"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {lines.map((line, idx) => {
                    const isCaller = idx % 2 !== 0;

                    return (
                        <div key={idx} className="flex flex-col gap-1 group">
                            <div className="mb-2 transition-all duration-300">
                                <div className="text-[10px] text-textMuted mb-1 font-mono uppercase tracking-wider opacity-60 flex justify-between ml-1 mr-1">
                                    <span>{isCaller ? "Caller" : "Dispatcher"}</span>
                                    <span>00:{String(idx * 5).padStart(2, '0')}</span>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl relative leading-relaxed text-sm shadow-sm border font-mono",
                                    isCaller
                                        ? "bg-surfaceHighlight/40 text-blue-100 border-white/5 rounded-tl-sm ml-0 mr-4"
                                        : "bg-surface/60 text-stone-300 border-white/5 rounded-tr-sm ml-8 mr-0"
                                )}>
                                    {renderLine(line, isCaller)}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator if listening */}
                {isListening && currentIndex < MOCK_TRANSCRIPT_STREAM.length && (
                    <div className="flex gap-1 ml-4 mt-2">
                        <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}
            </div>

            {/* Resume Auto-scroll Button - Minimalist Stationary Arrow */}
            {isAutoScrollPaused && (
                <button
                    onClick={resumeAutoScroll}
                    className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-md border border-white/20 text-white/70 shadow-xl hover:bg-white/20 hover:text-white active:scale-95 group",
                    )}
                    title="Resume Auto-scroll"
                >
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                </button>
            )}
        </div>
    );
};
