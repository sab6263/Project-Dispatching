import React, { useState } from 'react';
import { useCAD } from '../../context/CADContext';
import { cn } from '../../lib/utils';
import { Clock, Flame, Ambulance, Wrench, ArrowUpRight } from 'lucide-react';

interface IncidentGridProps {
    isFullScreen?: boolean;
}

export const IncidentGrid: React.FC<IncidentGridProps> = ({ isFullScreen = false }) => {
    const { incidents } = useCAD();
    const [filter, setFilter] = useState<'all' | 'feuer' | 'rett' | 'thl' | 'prio' | 'active' | 'dispatching'>('all');

    const filteredIncidents = incidents.filter(inc => {
        if (filter === 'all') return true;
        if (filter === 'prio') return inc.priority === '1';
        if (filter === 'active') return inc.status === 'Active';
        if (filter === 'dispatching') return inc.status === 'Dispatching';
        // Check for both English and German to be safe with mock data
        if (filter === 'feuer') return inc.category.toLowerCase().includes('feuer') || inc.category.toLowerCase().includes('fire');
        if (filter === 'rett') return inc.category.toLowerCase().includes('rettung') || inc.category.toLowerCase().includes('rescue') || inc.category.toLowerCase().includes('ems');
        if (filter === 'thl') return inc.category.toLowerCase().includes('technisch') || inc.category.toLowerCase().includes('tech');
        return true;
    });

    return (
        <div className={cn(
            "h-full flex flex-col overflow-hidden transition-all duration-500",
            isFullScreen
                ? "bg-background border border-border"
                : "bg-surface rounded-xl border border-border"
        )}>
            {/* Header / Filter Bar */}
            <div className="p-5 border-b border-border flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight font-display">
                            INCIDENT OVERVIEW
                        </h3>
                        <p className="text-xs text-textMuted mt-1">
                            Active Incidents & Dispatch
                        </p>
                    </div>
                    <div className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        {filteredIncidents.length} ACTIVE
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex gap-1 p-1 bg-surfaceHighlight rounded-lg border border-border">
                        <button
                            onClick={() => setFilter('all')}
                            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
                                filter === 'all' ? "bg-white text-black shadow-sm" : "text-textMuted hover:text-white"
                            )}
                        >
                            All
                        </button>
                        <div className="w-px h-4 bg-border my-auto mx-1" />
                        <button
                            onClick={() => setFilter('active')}
                            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
                                filter === 'active' ? "bg-red-500 text-white shadow-sm" : "text-textMuted hover:text-red-400"
                            )}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('dispatching')}
                            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
                                filter === 'dispatching' ? "bg-yellow-500 text-black shadow-sm" : "text-textMuted hover:text-yellow-400"
                            )}
                        >
                            Disp.
                        </button>
                    </div>

                    <div className="flex gap-1 p-1 bg-surfaceHighlight rounded-lg border border-border">
                        <button
                            onClick={() => setFilter('feuer')}
                            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1",
                                filter === 'feuer' ? "bg-orange-500 text-black shadow-sm" : "text-textMuted hover:text-orange-400"
                            )}
                        >
                            <Flame className="w-3 h-3" /> <span className="hidden sm:inline">Fire</span>
                        </button>
                        <button
                            onClick={() => setFilter('rett')}
                            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1",
                                filter === 'rett' ? "bg-white text-black shadow-sm" : "text-textMuted hover:text-white"
                            )}
                        >
                            <Ambulance className="w-3 h-3" /> <span className="hidden sm:inline">EMS</span>
                        </button>
                        <button
                            onClick={() => setFilter('thl')}
                            className={cn("px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1",
                                filter === 'thl' ? "bg-blue-500 text-black shadow-sm" : "text-textMuted hover:text-blue-400"
                            )}
                        >
                            <Wrench className="w-3 h-3" /> <span className="hidden sm:inline">Tech</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-10">
                    {filteredIncidents.map((inc) => (
                        <div key={inc.id} className="group relative bg-surface border border-border hover:border-textMuted rounded-none p-4 transition-all duration-200 flex flex-col gap-3">

                            {/* Card Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-sm flex items-center justify-center text-lg font-bold border",
                                        inc.category.includes('Feuer') ? "bg-background text-orange-500 border-orange-500" :
                                            inc.category.includes('Rettung') ? "bg-background text-white border-white" :
                                                "bg-background text-blue-500 border-blue-500"
                                    )}>
                                        {inc.code || "?"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white font-bold leading-none mb-1 truncate">{inc.keyword || inc.type}</div>
                                        <div className="text-xs text-textMuted font-mono">{inc.id}</div>
                                    </div>
                                </div>

                                {inc.priority === '1' && (
                                    <div className="bg-red-500 text-black border border-red-600 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider shrink-0">
                                        PRIO 1
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="bg-background border border-border rounded-sm p-2.5 flex justify-between items-center group-hover:border-textMuted transition-colors">
                                <div className="truncate text-sm text-textMain font-medium">
                                    {inc.location.address}
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-textMuted" />
                            </div>

                            {/* Footer Info */}
                            <div className="mt-auto flex justify-between items-center pt-2 border-t border-border">
                                <div className="flex items-center gap-1.5 text-xs text-textMuted">
                                    <Clock className="w-3 h-3" />
                                    <span className="font-mono">
                                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        inc.status === 'Active' ? "bg-red-500" : "bg-textMuted"
                                    )} />
                                    <span className="text-xs font-bold text-textMain">{inc.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
