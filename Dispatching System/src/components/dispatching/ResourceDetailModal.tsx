import React from 'react';
import { X, CheckCircle, AlertTriangle, Battery, Gauge, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { ResourceCard } from './ResourceCard';

interface ResourceDetailModalProps {
    resource: any; // Using any for rapid prototyping, define type properly later
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean; // New prop for inline display
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, isOpen, onClose, isInline = false }) => {
    if (!isOpen || !resource) return null;

    const Container = 'div';
    const containerClasses = isInline
        ? "w-full h-full bg-background" // Ensure bg is opaque
        : "absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200";

    const panelClasses = isInline
        ? "w-full h-full flex flex-col p-4 gap-4"
        : "glass-panel w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col p-6 gap-6 shadow-2xl ring-1 ring-white/10";

    return (
        <Container className={containerClasses}>
            <div className={panelClasses}>

                {/* Header Section */}
                <div className="flex justify-between items-start shrink-0 mb-2">
                    <div className="flex gap-4 items-center">
                        {/* Back Button for Inline Mode */}
                        {isInline && (
                            <button
                                onClick={onClose}
                                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group mr-2"
                                title="Back to List"
                            >
                                <ArrowLeft className="w-5 h-5 text-textMuted group-hover:text-white" />
                            </button>
                        )}
                        <div>
                            <div className="text-[10px] font-mono text-textMuted uppercase tracking-widest mb-1 opacity-70">
                                SYSTEM PROPOSAL (PRIMARY OPTION)
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
                                {resource.callsign}
                            </h1>
                            <div className="flex gap-4 text-xs text-textMuted mt-2 font-medium">
                                <span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5" /> 22% Battery</span>
                                <span className="flex items-center gap-1.5 text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Operational</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-5xl font-black text-white tracking-tight leading-none mb-1">
                            {resource.eta}
                        </div>
                        <div className={`text-lg font-bold ${resource.matchScore > 90 ? "text-green-500" : "text-yellow-500"}`}>
                            {resource.matchScore}% <span className="text-[10px] text-textMuted font-mono uppercase tracking-widest opacity-70 ml-1">SYSTEM CONFIDENCE</span>
                        </div>
                    </div>
                </div>

                {/* Top Status Cards */}
                <div className="grid grid-cols-3 gap-3 shrink-0">
                    <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-2">
                            <span className="text-textMuted">ROUTE</span>
                            <span className="text-yellow-500">STABLE</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[60%] rounded-full" />
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-2">
                            <span className="text-textMuted">EQUIPMENT</span>
                            <span className="text-red-500">MISSING</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[30%] rounded-full" />
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-2">
                            <span className="text-textMuted">CREW STATUS</span>
                            <span className="text-green-500">STABLE</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[85%] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* 2-Column Content Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden min-h-0">

                    {/* Left Column: AI Analysis */}
                    <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                        <div className="text-[10px] font-bold text-textMuted uppercase tracking-widest">
                            AI RATIONALE
                        </div>

                        {/* Blue Box */}
                        <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-4 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Gauge className="w-3.5 h-3.5" /> CONFIDENCE CALIBRATION
                            </h3>
                            <p className="text-sm text-blue-100/90 font-medium leading-relaxed">
                                Crew has an <span className="text-white font-bold">89% punctuality rate</span> for standard missions. <span className="text-green-400 text-xs">↗ Improving</span>
                            </p>
                        </div>

                        {/* Unified Status Cards */}
                        <div className="space-y-3 mt-2">
                            {/* Card A: Route + Distance */}
                            <div className="bg-white/5 rounded-lg border border-white/5 p-3 flex justify-between items-center group hover:border-white/10 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">ROUTE STATUS</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        <span className="text-white font-bold text-sm">Target Reachable</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">DISTANCE</div>
                                    <div className="font-mono text-white text-sm">3.0 km</div>
                                </div>
                            </div>

                            {/* Card B: Crew + Workload */}
                            <div className="bg-white/5 rounded-lg border border-white/5 p-3 flex justify-between items-center group hover:border-white/10 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">CREW STATUS</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        <span className="text-white font-bold text-sm">Fresh Crew</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">WORKLOAD</div>
                                    <div className="font-mono text-green-400 text-sm">Low Load</div>
                                </div>
                            </div>

                            {/* Card C: Protocol + Missing */}
                            <div className="bg-red-500/10 rounded-lg border border-red-500/20 p-3 flex justify-between items-center group hover:border-red-500/30 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-red-400/70 uppercase tracking-widest mb-1">PROTOCOL CHECK</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                        <span className="text-red-100 font-bold text-sm">Mismatch</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-red-400/70 uppercase tracking-widest mb-1">MISSING ITEMS</div>
                                    <div className="font-mono text-red-100 text-sm">Rescue Boat</div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Factors Footer (Directly below, no mt-auto) */}
                        <div className="pt-4 mt-2 border-t border-white/5">
                            <div className="text-[9px] font-bold text-textMuted uppercase tracking-widest mb-3 opacity-60">
                                SECONDARY FACTORS
                            </div>
                            <div className="flex gap-2">
                                <div className="bg-white/5 rounded px-2.5 py-1.5 border border-white/5 text-[10px] font-bold text-textMuted flex items-center gap-1.5 whitespace-nowrap">
                                    <Clock className="w-3 h-3 text-textMuted" /> System Load: 4/10
                                </div>
                                <div className="bg-white/5 rounded px-2.5 py-1.5 border border-white/5 text-[10px] font-bold text-textMuted flex items-center gap-1.5 whitespace-nowrap">
                                    <MapPin className="w-3 h-3 text-textMuted" /> Weather: Clear, 22°C
                                </div>
                                <div className="bg-white/5 rounded px-2.5 py-1.5 border border-white/5 text-[10px] font-bold text-textMuted flex items-center gap-1.5 whitespace-nowrap">
                                    Daylight
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Alternatives */}
                    <div className="flex flex-col gap-4 overflow-y-auto pl-1 border-l border-white/5">
                        <div className="text-[10px] font-bold text-textMuted uppercase tracking-widest px-2">
                            ALTERNATIVES
                        </div>

                        <div className="space-y-3 px-2 pb-2">
                            {/* Static Mock Alternatives for UI Polish */}
                            {[
                                { id: 'alt1', name: 'IN-RK 71/1', match: '36-40%', delta: '+1m Approach', warning: 'Equipment Missing' },
                                { id: 'alt2', name: 'IN-RK 71/3', match: '36-40%', delta: '+1m Approach', warning: 'Equipment Missing' },
                                { id: 'alt3', name: 'MHD-IN 1', match: '32-42%', delta: '+1m Approach', warning: 'Equipment Missing' },
                                { id: 'alt4', name: 'IN-RK 73/1', match: '16-20%', delta: '+6m Approach', warning: 'Equipment Missing' },
                            ].map((alt) => (
                                <div key={alt.id} className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white text-sm">{alt.name}</span>
                                        <span className="text-red-400 font-bold font-mono text-sm">{alt.match}</span>
                                    </div>
                                    <div className="text-xs text-textMuted mb-2">{alt.delta}</div>
                                    {alt.warning && (
                                        <div className="text-xs text-yellow-500 flex items-center gap-1.5 font-medium mb-3">
                                            <AlertTriangle className="w-3 h-3" /> {alt.warning}
                                        </div>
                                    )}
                                    <button className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider bg-transparent border border-white/20 hover:bg-primary hover:border-primary hover:text-white rounded transition-colors text-textMuted flex items-center justify-center gap-2">
                                        Select as Expert Choice
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </Container>
    );
};
