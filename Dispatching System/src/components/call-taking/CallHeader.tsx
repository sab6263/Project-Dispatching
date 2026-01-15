import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Moon } from 'lucide-react';
import { useCAD } from '../../context/CADContext';

export const CallHeader: React.FC = () => {
    const { activeCall, theme, toggleTheme } = useCAD();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Derived dynamic title based on call priority/code
    const getDynamicTitle = () => {
        if (activeCall.priority && activeCall.summary) {
            return `${activeCall.summary} (${activeCall.priority})`;
        }
        return "Incoming Emergency - Unclassified";
    };

    return (
        <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
            {/* Left: Case Info */}
            <div className="flex items-center gap-6">
                <div>
                    <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider mb-0.5">Case ID</div>
                    <div className="text-lg font-mono font-bold text-white tracking-widest leading-none">
                        {activeCall.id || "C-2025-0001"}
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div>
                    <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider mb-0.5">Status</div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-bold text-red-100 dark:text-red-100">Call Taking</span>
                    </div>
                </div>
            </div>

            {/* Center: Dynamic Classification Headline */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-black/20 border border-white/5 px-6 py-1.5 rounded-full backdrop-blur-md">
                    <h1 className="text-base font-bold text-textMain tracking-wide text-center uppercase flex items-center gap-2">
                        {getDynamicTitle()}
                    </h1>
                </div>
            </div>

            {/* Right: Meta Info (Time/Date) */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-textMuted hover:text-white"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="h-8 w-px bg-white/10" />

                <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end text-textMuted text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        <Calendar className="w-3 h-3" /> Date
                    </div>
                    <div className="font-mono text-sm text-stone-300">
                        {time.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end text-textMuted text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        <Clock className="w-3 h-3" /> Time
                    </div>
                    <div className="font-mono text-xl font-bold text-white leading-none">
                        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    );
};
