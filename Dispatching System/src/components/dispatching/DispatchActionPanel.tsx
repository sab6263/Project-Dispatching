import React, { useState } from 'react';
import { useCAD } from '../../context/CADContext';
import { Send, MapPin, AlertCircle, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SecureChat } from './SecureChat';

export const DispatchActionPanel: React.FC = () => {
    const { incidents, units, assignUnit, updateIncidentStatus } = useCAD();
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'dispatch' | 'chat'>('dispatch');

    const openIncidents = incidents.filter(i => i.status !== 'Closed');

    const handleAssign = (unitId: string) => {
        if (!selectedIncidentId) return;
        assignUnit(selectedIncidentId, unitId);
        updateIncidentStatus(selectedIncidentId, 'Active'); // Automatically set to active
    };

    const freeUnits = units.filter(u => u.status === 'S1' || u.status === 'S2');
    const filteredUnits = freeUnits.filter(u => u.callSign.toLowerCase().includes(searchTerm.toLowerCase()) || u.type.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Incident Selection List */}
            <div className="h-1/2 bg-surface rounded-xl border border-border flex flex-col overflow-hidden">
                <div className="p-3 bg-surfaceHighlight/30 border-b border-border text-xs font-semibold text-textMain uppercase tracking-wider">
                    Offene Einsätze ({openIncidents.length})
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {openIncidents.map(inc => (
                        <div
                            key={inc.id}
                            onClick={() => setSelectedIncidentId(inc.id)}
                            className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all",
                                selectedIncidentId === inc.id
                                    ? "bg-surfaceHighlight border-primary"
                                    : "bg-background border-border hover:border-textMuted"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm text-white">{inc.code || inc.type}</span>
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                    inc.priority === '1' ? "bg-danger text-black" : "bg-surfaceHighlight text-textMuted"
                                )}>
                                    Prio {inc.priority}
                                </span>
                            </div>
                            <div className="text-xs text-textMuted flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {inc.location.address}
                            </div>
                            {inc.assignedUnits.length > 0 && (
                                <div className="mt-2 flex gap-1 flex-wrap">
                                    {inc.assignedUnits.map(uid => {
                                        const u = units.find(unit => unit.id === uid);
                                        return u ? (
                                            <span key={uid} className="text-[10px] bg-surfaceHighlight border border-border px-1.5 rounded text-textMuted">
                                                {u.callSign}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Panel: Disposition or Chat */}
            <div className="h-1/2 bg-surface rounded-xl border border-border flex flex-col overflow-hidden">
                <div className="flex border-b border-border bg-surfaceHighlight/30">
                    <button
                        onClick={() => setActiveTab('dispatch')}
                        className={cn(
                            "flex-1 p-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2",
                            activeTab === 'dispatch' ? "border-primary text-textMain bg-primary/5" : "border-transparent text-textMuted hover:text-textMain hover:bg-surfaceHighlight"
                        )}
                    >
                        Disposition
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={cn(
                            "flex-1 p-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2",
                            activeTab === 'chat' ? "border-primary text-textMain bg-primary/5" : "border-transparent text-textMuted hover:text-textMain hover:bg-surfaceHighlight"
                        )}
                    >
                        Funk (Chat)
                    </button>
                </div>

                {activeTab === 'dispatch' ? (
                    <>
                        <div className="p-3 border-b border-border">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-textMuted" />
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:border-primary outline-none"
                                    placeholder="Fahrzeug suchen..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {!selectedIncidentId ? (
                                <div className="h-full flex flex-col items-center justify-center text-textMuted opacity-50">
                                    <AlertCircle className="w-6 h-6 mb-2" />
                                    <span className="text-xs">Wähle einen Einsatz</span>
                                </div>
                            ) : (
                                filteredUnits.map(unit => (
                                    <div key={unit.id} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border hover:bg-surfaceHighlight transition-colors group">
                                        <div>
                                            <div className="font-medium text-sm text-white">{unit.callSign}</div>
                                            <div className="text-xs text-textMuted">{unit.type} • {unit.distance ?? '2 min'}</div>
                                        </div>
                                        <button
                                            onClick={() => handleAssign(unit.id)}
                                            className="p-2 bg-surfaceHighlight rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                                            title="Alarmieren"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 overflow-hidden">
                        <SecureChat />
                    </div>
                )}
            </div>
        </div>
    );
};
