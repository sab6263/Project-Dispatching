import React, { useEffect, useState } from 'react';
import { useCAD } from '../../context/CADContext';
import { cn } from '../../lib/utils';
import { Truck, Radio, Clock, MapPin, PhoneIncoming, Check } from 'lucide-react';

export const ResourceGrid: React.FC = () => {
    const { units, updateUnitStatus, selectedUnitId, setSelectedUnitId, incidents } = useCAD();
    const [, setTick] = useState(0);

    // Identify active incident
    const activeIncident = incidents.find(i => i.status === 'Open' || i.status === 'Dispatching');

    // Update timers every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const getStatusDuration = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        return minutes;
    };

    const pendingUnits = units.filter(u => u.status === 'S5');
    const standardUnits = units.filter(u => u.status !== 'S5');

    const handleClearS5 = (unitId: string) => { updateUnitStatus(unitId, 'S3'); };

    return (
        <div className="h-full flex flex-col gap-2">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                        <Truck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm tracking-wide text-white">RESOURCES</span>
                </div>
                <div className="flex gap-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                        {units.length} TOTAL
                    </span>
                </div>
            </div>

            {/* Pending Requests */}
            {pendingUnits.length > 0 && (
                <div className="px-2">
                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-3 animate-pulse-soft relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 animate-pulse" />
                        <div className="flex items-center gap-2 mb-2">
                            <PhoneIncoming className="w-4 h-4 text-yellow-500 animate-bounce" />
                            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Radio Requests ({pendingUnits.length})</span>
                        </div>
                        <div className="space-y-2">
                            {pendingUnits.map(unit => (
                                <div key={unit.id} className="bg-black/40 rounded-lg p-2 flex justify-between items-center border border-yellow-500/30">
                                    <div>
                                        <div className="font-bold text-white text-sm">{unit.callSign}</div>
                                        <div className="text-[10px] text-textMuted flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {getStatusDuration(unit.statusLastUpdated)}m ago
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleClearS5(unit.id)} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors" title="Process Status 5"><Check className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-2 space-y-2 pb-2">
                {standardUnits.map((unit) => {
                    const duration = unit.statusLastUpdated ? getStatusDuration(unit.statusLastUpdated) : 0;
                    const isLongStatus = duration > 30 && (unit.status === 'S4' || unit.status === 'S3');

                    const isSelected = unit.id === selectedUnitId;
                    const isAssigned = activeIncident?.assignedUnits?.includes(unit.id);
                    const isRelevant = isSelected || isAssigned;

                    return (
                        <div
                            key={unit.id}
                            id={`unit-card-${unit.id}`}
                            onClick={() => setSelectedUnitId(isSelected ? null : unit.id)}
                            className={cn(
                                "group rounded-xl border p-3 transition-all cursor-pointer select-none",
                                isRelevant
                                    ? "bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.02]"
                                    : "bg-surface/40 hover:bg-surface border-white/5 hover:border-white/20",
                                isAssigned && "animate-pulse-soft ring-1 ring-blue-500/50"
                            )}
                        >

                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={cn("text-sm font-bold transition-colors tracking-tight", isRelevant ? "text-blue-300" : "text-white")}>
                                        {unit.callSign}
                                    </div>
                                    <div className="text-[10px] text-textMuted uppercase flex items-center gap-1.5 mt-0.5">
                                        <Radio className="w-3 h-3 opacity-50" /> {unit.type}
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg border border-white/10",
                                    unit.status === 'S1' || unit.status === 'S2' ? "bg-green-500/20 text-green-500 border-green-500/30" :
                                        unit.status === 'S3' || unit.status === 'S4' ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                                            "bg-white/5 text-textMuted"
                                )}>
                                    {unit.status}
                                </div>
                            </div>

                            {/* Info Row */}
                            <div className="flex items-center justify-between text-[10px] text-textMuted mt-2">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 opacity-50" />
                                    <span className="truncate max-w-[120px]">
                                        {isAssigned ? activeIncident?.location.address.split(',')[0] : "Station"}
                                    </span>
                                </div>
                                {unit.statusLastUpdated && (
                                    <div className={cn("flex items-center gap-1 font-mono", isLongStatus ? "text-red-400 animate-pulse" : "")}>
                                        <Clock className="w-3 h-3 opacity-50" /> {duration}m
                                    </div>
                                )}
                            </div>

                            {/* Capabilities */}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {unit.capabilities?.slice(0, 3).map(cap => (
                                    <span key={cap} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-gray-400">
                                        {cap}
                                    </span>
                                ))}
                            </div>

                            {/* Status Actions */}
                            <div
                                className="grid grid-cols-6 gap-1 pt-2 mt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {(['S1', 'S2', 'S3', 'S4', 'S5', 'S6'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => updateUnitStatus(unit.id, s)}
                                        className={cn(
                                            "text-[9px] py-1 rounded transition-colors font-medium border",
                                            unit.status === s
                                                ? "bg-blue-500/30 text-blue-300 border-blue-500/50 shadow-inner"
                                                : "bg-transparent border-transparent text-textMuted hover:bg-white/10 hover:text-white"
                                        )}
                                        title={`Status ${s}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
