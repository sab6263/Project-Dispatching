import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, MapPin, Loader2, AlertTriangle, ShieldCheck, RefreshCw, Plus, History, Siren, Brain, Trash2, ArrowRightCircle, Info } from 'lucide-react';
import { useCAD } from '../../context/CADContext';
import { cn } from '../../lib/utils';

// Mock Extended Unit Info for AI Explainability
interface DispatchUnit {
    id: string;
    callSign: string;
    type: string;
    station: string;
    eta: number;
    status: string;
    // Connect to AI Reasoning
    confidence: number;
    etaBreakdown: {
        route: number;
        traffic: number;
        chute: number; // Activation time
    };
    reasoning?: string;
}

// Requirement Slot definition
interface RequirementSlot {
    id: string;
    type: string;
    label: string;
    assignedUnit?: DispatchUnit;
    isFilled: boolean;
}

// Available Pool for Add/Swap
const AVAILABLE_UNITS_POOL: DispatchUnit[] = [
    { id: 'p1', callSign: 'ELW 2-11-1', type: 'ELW', station: 'Fire Station 2', eta: 12, status: 'S1', confidence: 85, etaBreakdown: { route: 9, traffic: 2, chute: 1 } },
    { id: 'p2', callSign: 'HLF 2-46-1', type: 'HLF', station: 'Fire Station 2', eta: 15, status: 'S1', confidence: 78, etaBreakdown: { route: 12, traffic: 2, chute: 1 } },
    { id: 'p3', callSign: 'DLK 2-33-1', type: 'DLK', station: 'Fire Station 2', eta: 14, status: 'S2', confidence: 82, etaBreakdown: { route: 11, traffic: 2, chute: 1 } },
    { id: 'p4', callSign: 'RTW 2-83-1', type: 'RTW', station: 'EMS Station 2', eta: 6, status: 'S1', confidence: 94, etaBreakdown: { route: 4, traffic: 1, chute: 1 } },
    { id: 'p5', callSign: 'NEF 1-82-1', type: 'NEF', station: 'North Hospital', eta: 9, status: 'S1', confidence: 89, etaBreakdown: { route: 6, traffic: 2, chute: 1 } },
];

export const DispatchRecommendation: React.FC = () => {
    const { activeCall, updateUnitStatus, units } = useCAD();
    const [step, setStep] = useState<'HIDDEN' | 'WAITING' | 'LOADING' | 'HIERARCHY' | 'CONFIRM_MODAL' | 'HISTORY'>('HIDDEN');

    // Slots State
    const [requirements, setRequirements] = useState<RequirementSlot[]>([]);

    // Modal State
    const [modalMode, setModalMode] = useState<'NONE' | 'ADD' | 'SWAP'>('NONE');
    const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
    const [activeGroupType, setActiveGroupType] = useState<string | null>(null);

    // 1. Visibility & Flow Logic
    useEffect(() => {
        const hasData = activeCall.location && activeCall.location.length > 2 && activeCall.keyword;

        if (!hasData) {
            setStep('HIDDEN');
            return;
        }

        if (step === 'HIDDEN' && hasData) {
            setStep('LOADING');
            setTimeout(() => {
                initializeProposal();
                setStep('HIERARCHY');
            }, 1500);
        }
    }, [activeCall.location, activeCall.keyword, step]);

    const initializeProposal = () => {
        const initialSlots: RequirementSlot[] = [
            { id: 's1', type: 'ELW', label: 'ELW', isFilled: true, assignedUnit: { id: 'u1', callSign: 'ELW 1-11-1', type: 'ELW', station: 'Fire Station 1', eta: 4, status: 'S1', confidence: 96, etaBreakdown: { route: 2, traffic: 1, chute: 1 } } },
            { id: 's2', type: 'HLF', label: 'HLF', isFilled: true, assignedUnit: { id: 'u2', callSign: 'HLF 1-46-1', type: 'HLF', station: 'Fire Station 1', eta: 4, status: 'S2', confidence: 98, etaBreakdown: { route: 3, traffic: 0, chute: 1 } } },
            { id: 's3', type: 'HLF', label: 'HLF', isFilled: true, assignedUnit: { id: 'u3', callSign: 'HLF 1-40-2', type: 'HLF', station: 'Fire Station 1', eta: 6, status: 'S1', confidence: 92, etaBreakdown: { route: 4, traffic: 1, chute: 1 } } },
            { id: 's4', type: 'DLK', label: 'DLK', isFilled: true, assignedUnit: { id: 'u4', callSign: 'DLK 1-33-1', type: 'DLK', station: 'Fire Station 1', eta: 5, status: 'S1', confidence: 95, etaBreakdown: { route: 3, traffic: 1, chute: 1 } } },
            { id: 's5', type: 'RTW', label: 'RTW', isFilled: true, assignedUnit: { id: 'u5', callSign: 'RTW 1-83-1', type: 'RTW', station: 'EMS Station 1', eta: 7, status: 'S1', confidence: 88, etaBreakdown: { route: 5, traffic: 1, chute: 1 } } }
        ];
        setRequirements(initialSlots);
    };

    const handleAssignUnit = (unit: DispatchUnit) => {
        if (activeSlotId) {
            setRequirements(prev => prev.map(slot =>
                slot.id === activeSlotId ? { ...slot, assignedUnit: unit, isFilled: true } : slot
            ));
        } else if (activeGroupType) {
            const newSlot: RequirementSlot = {
                id: `s-${Date.now()}`,
                type: activeGroupType,
                label: activeGroupType,
                isFilled: true,
                assignedUnit: unit
            };
            setRequirements(prev => [...prev, newSlot]);
        }
        setModalMode('NONE');
        setActiveSlotId(null);
        setActiveGroupType(null);
    };

    const handleRemoveSlot = (slotId: string) => {
        setRequirements(prev => prev.filter(s => s.id !== slotId));
    };

    const openSwapModal = (slotId: string) => {
        setActiveSlotId(slotId);
        setActiveGroupType(null);
        setModalMode('SWAP');
    };

    const openAddModal = (groupType: string) => {
        setActiveGroupType(groupType);
        setActiveSlotId(null);
        setModalMode('ADD');
    };

    const handleExecuteAlert = () => {
        const assigned = requirements.filter(r => r.isFilled && r.assignedUnit).map(r => r.assignedUnit!);
        assigned.forEach(rec => {
            const realUnit = units.find(u => u.callSign === rec.callSign);
            if (realUnit) updateUnitStatus(realUnit.id, 'S3');
        });
        setStep('HISTORY');
    };

    // --- SUB-COMPONENT: INTELLIGENCE CARD ---
    const UnitIntelligenceCard = ({ slot, onSwap, onRemove }: { slot: RequirementSlot, onSwap: () => void, onRemove: () => void }) => {
        const u = slot.assignedUnit;
        if (!u) return null;

        return (
            <div className="group relative bg-surface border border-white/5 hover:border-white/20 rounded-lg p-2 transition-all shadow-sm hover:shadow-md">
                {/* Header: ID, Status, Actions */}
                <div className="flex justify-between items-start mb-1.5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{u.callSign}</span>
                            <span className={cn(
                                "text-[9px] px-1 py-0.5 rounded font-mono font-bold leading-none",
                                u.status === 'S1' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            )}>
                                {u.status}
                            </span>
                        </div>
                        <div className="text-[10px] text-textMuted flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" /> {u.station}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onSwap} className="p-1.5 hover:bg-white/10 rounded text-textMuted hover:text-white transition-colors" title="Swap Unit">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={onRemove} className="p-1.5 hover:bg-red-500/10 rounded text-textMuted hover:text-red-400 transition-colors" title="Remove Unit">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Intelligence Block: Time Math & Confidence */}
                <div className="bg-black/20 rounded border border-white/5 p-1.5 space-y-1.5">
                    {/* Time Math */}
                    <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-1 text-white font-bold">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span className="text-sm leading-none">{u.eta}</span>
                            <span className="text-[9px] text-textMuted font-normal uppercase mt-0.5">min</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-stone-500 font-mono" title="Route + Traffic + Activation">
                            <span>{u.etaBreakdown.route}m</span>
                            <span>+</span>
                            <span className={u.etaBreakdown.traffic > 0 ? "text-yellow-500" : ""}>{u.etaBreakdown.traffic}m</span>
                            <span>+</span>
                            <span>{u.etaBreakdown.chute}m</span>
                        </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[9px] uppercase tracking-wider font-bold text-textMuted">
                            <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> AI Match</span>
                            <span className={u.confidence > 90 ? "text-green-400" : "text-yellow-400"}>{u.confidence}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-1000", u.confidence > 90 ? "bg-green-500" : "bg-yellow-500")}
                                style={{ width: `${u.confidence}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER HELPERS ---

    const renderUnitModal = () => {
        if (modalMode === 'NONE') return null;
        const isSwap = modalMode === 'SWAP';
        const title = isSwap ? "Swap Unit" : `Add Unit`;

        return (
            <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-200 rounded-xl">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
                    <button onClick={() => setModalMode('NONE')} className="p-1 hover:bg-white/10 rounded"><X className="w-4 h-4 text-textMuted" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {AVAILABLE_UNITS_POOL.map(u => (
                        <button
                            key={u.id}
                            onClick={() => handleAssignUnit(u)}
                            className="w-full flex items-center justify-between p-3 rounded bg-surface border border-white/10 hover:border-primary hover:bg-white/5 transition-all group text-left"
                        >
                            <div>
                                <div className="font-bold text-sm text-white">{u.callSign}</div>
                                <div className="text-[10px] text-textMuted flex gap-2">
                                    <span className="text-blue-300 font-mono">{u.type}</span>
                                    <span>•</span>
                                    <span>{u.station}</span>
                                    <span>•</span>
                                    <span>~{u.eta} min</span>
                                </div>
                            </div>
                            {u.status === 'S1' ? <Check className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-yellow-500" />}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderConfirmationModal = () => {
        if (step !== 'CONFIRM_MODAL') return null;
        const assignedCount = requirements.filter(r => r.isFilled).length;

        return (
            <div className="absolute inset-0 z-[70] bg-surfaceHigh/95 backdrop-blur-md flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-300 rounded-xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-400" /> Confirm Dispatch
                        </h3>
                        <p className="text-xs text-textMuted mt-1">Please verify all units before alerting.</p>
                    </div>
                    <button onClick={() => setStep('HIERARCHY')} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-textMuted" /></button>
                </div>

                <div className="flex-1 overflow-y-auto mb-6">
                    <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-stone-400 uppercase">Alert Recipients</h4>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-mono">{assignedCount} Units</span>
                        </div>
                        <ul className="space-y-3">
                            {requirements.filter(r => r.assignedUnit).map((slot, idx) => (
                                <li key={slot.id} className="flex items-center justify-between text-sm text-white border-b border-white/5 last:border-0 pb-2 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-surface border border-white/10 flex items-center justify-center text-[10px] font-bold text-stone-400">{idx + 1}</div>
                                        <div>
                                            <div className="font-bold">{slot.assignedUnit?.callSign}</div>
                                            <div className="text-[10px] text-textMuted">{slot.assignedUnit?.station} ({slot.assignedUnit?.eta} min)</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-green-400 font-mono tracking-wide">DIGITAL ALERT</span>
                                        <span className="text-[9px] text-stone-500 uppercase">Target Locked</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button
                    onClick={handleExecuteAlert}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 transition-transform active:scale-95 text-base border-t border-red-400/20"
                >
                    <Bell className="w-5 h-5 animate-wiggle" />
                    TRIGGER ALARM
                </button>
            </div>
        );
    };

    // --- MAIN VIEWS ---

    if (step === 'HIDDEN') {
        const missing = [];
        if (!activeCall.location || activeCall.location.length < 3) missing.push("Location");
        if (!activeCall.keyword) missing.push("Classification");

        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl opacity-70">
                <AlertTriangle className="w-8 h-8 text-yellow-500/50 mb-3" />
                <h3 className="text-sm font-bold text-textMuted mb-2">Insufficient Data</h3>
                <p className="text-xs text-stone-500 mb-4">
                    Waiting for intake inputs...
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {missing.map(m => (
                        <span key={m} className="text-[10px] font-mono uppercase bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-1 rounded">
                            {m}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 'LOADING') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-surface/30 rounded-xl">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Analyzing AAO Protocols...</h3>
                <p className="text-xs text-purple-300">Calculating routes & unit availability</p>
            </div>
        );
    }

    if (step === 'HIERARCHY') {
        const groupedRequirements = requirements.reduce((acc, slot) => {
            if (!acc[slot.type]) acc[slot.type] = [];
            acc[slot.type].push(slot);
            return acc;
        }, {} as Record<string, RequirementSlot[]>);

        return (
            <div className="h-full w-full flex flex-col gap-0 relative overflow-hidden bg-surface rounded-xl border border-border shadow-sm">
                {renderUnitModal()}
                {renderConfirmationModal()}

                {/* 1. STRATEGIC HEADER */}
                <div className="p-4 py-3 bg-surfaceHighlight/5 border-b border-border flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Siren className="w-4 h-4 text-red-500" />
                            Strategy: {activeCall.keyword}
                        </h3>
                    </div>
                    {/* Strategic Reasoning Block */}
                    <div className="bg-blue-500/10 border-l-2 border-blue-500/50 p-2 rounded-r text-xs text-blue-100 flex gap-2">
                        <Info className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                            <span className="font-bold text-blue-300">Protocol 4B (Fire/Urban):</span>
                            <span className="opacity-80 ml-1">Requires standard suppression train + aerial ladder due to 3rd floor report.</span>
                        </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(groupedRequirements).map(([type, slots]) => (
                            <div key={type} className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded px-2 py-1">
                                <span className="text-sm font-bold text-white mr-1.5">{slots.length}x</span>
                                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. GROUPED TACTICAL LIST */}
                <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
                    {Object.entries(groupedRequirements).map(([type, slots]) => (
                        <div key={type} className="mb-4 last:mb-2">
                            <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2 ml-1 opacity-70 sticky top-0 bg-surface/95 backdrop-blur z-20 py-1">
                                {type}
                            </h4>
                            <div className="space-y-2">
                                {slots.map(slot => (
                                    <UnitIntelligenceCard
                                        key={slot.id}
                                        slot={slot}
                                        onSwap={() => openSwapModal(slot.id)}
                                        onRemove={() => handleRemoveSlot(slot.id)}
                                    />
                                ))}
                                {/* Add Button PER Group */}
                                <button
                                    onClick={() => openAddModal(type)}
                                    className="w-full py-2 border border-dashed border-white/5 rounded text-[10px] text-textMuted hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-1.5 group/add"
                                >
                                    <Plus className="w-3 h-3 group-hover/add:text-blue-400" />
                                    Add another {type}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. COMMIT ACTION */}
                <div className="p-3 border-t border-border bg-surfaceHighlight/5">
                    <button
                        onClick={() => setStep('CONFIRM_MODAL')}
                        className="w-full bg-primary hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <ArrowRightCircle className="w-5 h-5" />
                        Review & Alert
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'HISTORY') {
        return (
            <div className="h-full flex flex-col gap-4 bg-surface rounded-xl border border-border p-4 shadow-sm animate-in zoom-in-95 duration-300">
                <div className="border-b border-border pb-3 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-textMuted" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Dispatch Log</h3>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto relative">
                    <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-white/10" />
                    <div className="relative pl-6 pt-1">
                        <div className="absolute left-0 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-surface shadow-glow" />
                        <div className="text-[10px] text-textMuted mb-0.5 font-mono">Just now</div>
                        <div className="text-sm text-white font-bold">Alert Successful</div>
                        <div className="text-xs text-stone-400 mt-1">{requirements.filter(r => r.isFilled).length} units dispatched (S3).</div>
                    </div>
                </div>
                <button onClick={() => setStep('LOADING')} className="text-xs text-textMuted underline hover:text-white">Run New Simulation</button>
            </div>
        );
    }

    return null;
};
