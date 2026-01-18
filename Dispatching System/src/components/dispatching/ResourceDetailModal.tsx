import React from 'react';
import { X, CheckCircle, AlertTriangle, Battery, Gauge, MapPin, Clock } from 'lucide-react';
import { ResourceCard } from './ResourceCard';

interface ResourceDetailModalProps {
    resource: any; // Using any for rapid prototyping, define type properly later
    isOpen: boolean;
    onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, isOpen, onClose }) => {
    if (!isOpen || !resource) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-5xl h-[85vh] rounded-2xl flex overflow-hidden shadow-2xl ring-1 ring-white/10">

                {/* Main Content (Left) */}
                <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-mono text-textMuted uppercase tracking-widest mb-1">Systemvorschlag (Primäre Option)</div>
                            <h1 className="text-5xl font-black text-white tracking-tight mb-2">{resource.callsign}</h1>
                            <div className="flex gap-4 text-sm text-textMuted">
                                <span className="flex items-center gap-1"><Battery className="w-4 h-4" /> 22% Batterie</span>
                                <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4" /> Einsatzbereit</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-white">{resource.eta}</div>
                            <div className={`text-xl font-bold ${resource.matchScore > 90 ? "text-green-500" : "text-yellow-500"}`}>
                                {resource.matchScore}% <span className="text-xs text-textMuted font-normal uppercase tracking-wider">Systemeinschätzung</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Bars */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-surfaceHighlight/50 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs font-bold uppercase text-textMuted mb-2">
                                <span>Route</span>
                                <span className="text-green-400">Stabil</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[90%] rounded-full" />
                            </div>
                        </div>
                        <div className="bg-surfaceHighlight/50 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs font-bold uppercase text-textMuted mb-2">
                                <span>Ausrüstung</span>
                                <span className="text-red-400">Fehlt</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[40%] rounded-full" />
                            </div>
                        </div>
                        <div className="bg-surfaceHighlight/50 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs font-bold uppercase text-textMuted mb-2">
                                <span>Crew Status</span>
                                <span className="text-green-400">Frisch</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[95%] rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* AI Reasoning Box */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Gauge className="w-4 h-4" /> KI Begründung
                        </h3>
                        <p className="text-lg text-blue-100 font-medium leading-relaxed">
                            Diese Crew hat eine <span className="text-white font-bold">89% Pünktlichkeitsrate</span> für Standard Einsätze.
                            Aktuelle Verkehrslage begünstigt Anfahrt via B13.
                        </p>
                    </div>

                    {/* Detailed Stats List */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-green-500 pl-4">
                            <MapPin className="w-5 h-5 text-green-500 mt-1" />
                            <div>
                                <div className="font-bold text-green-400 text-sm uppercase">Route</div>
                                <div className="text-sm text-textMuted">3.0 km Entfernung • Keine Staus gemeldet</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-green-500 pl-4">
                            <Gauge className="w-5 h-5 text-green-500 mt-1" />
                            <div>
                                <div className="font-bold text-green-400 text-sm uppercase">Crew</div>
                                <div className="text-sm text-textMuted">Geringe Last • Schichtende in 4h</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-red-500 pl-4 bg-red-500/5">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                            <div>
                                <div className="font-bold text-red-400 text-sm uppercase">Protokoll Warnung</div>
                                <div className="text-sm text-textMuted">Fehlt: <span className="text-white">Rettungsboot</span> (Für dieses Einsatzstichwort empfohlen)</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar (Alternatives) */}
                <div className="w-80 border-l border-white/10 bg-black/20 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">Alternativen</h3>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Mock Alternatives */}
                        <div className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-white">IN-RK 71/1</span>
                                <span className="text-red-400 font-mono text-sm">36-40%</span>
                            </div>
                            <div className="text-xs text-textMuted mb-2">+1m Anfahrt • <span className="text-red-400">Ausrüstung fehlt</span></div>
                            <button className="w-full py-1.5 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-primary hover:text-white rounded transition-colors text-textMuted">
                                Auswählen
                            </button>
                        </div>

                        <div className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-white">MHD-IN 1</span>
                                <span className="text-red-400 font-mono text-sm">32-42%</span>
                            </div>
                            <div className="text-xs text-textMuted mb-2">+4m Anfahrt • Verkehrsrisiko</div>
                            <button className="w-full py-1.5 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-primary hover:text-white rounded transition-colors text-textMuted">
                                Auswählen
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
