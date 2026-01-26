import React, { useState, useMemo } from 'react';
import { X, Search, Ambulance, Truck, Check, Plus } from 'lucide-react';
import { useCAD, type Unit } from '../../context/CADContext';
import { cn } from '../../lib/utils';

interface AddUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose }) => {
    const { units, dispatchProposalUnits, addToDispatchProposal } = useCAD();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUnits = useMemo(() => {
        return units.filter(unit =>
            unit.callSign.toLowerCase().includes(searchTerm.toLowerCase()) ||
            unit.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [units, searchTerm]);

    const groupedUnits = useMemo(() => {
        return {
            EMS: filteredUnits.filter(u => u.category === 'EMS'),
            Fire: filteredUnits.filter(u => u.category === 'Fire')
        };
    }, [filteredUnits]);

    if (!isOpen) return null;

    const handleAdd = (unit: Unit) => {
        addToDispatchProposal({
            ...unit,
            eta: unit.eta || 'Calculated from Map',
            distance: unit.distance || '-- km'
        });
        // We don't close immediately to allow adding multiple
    };

    const isAlreadyAdded = (unitId: string) => {
        return dispatchProposalUnits.some(u => u.id === unitId);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surfaceHighlight/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Add Units to Proposal</h2>
                            <p className="text-xs text-textMuted uppercase tracking-wider">Select additional resources for the current case</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-textMuted hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-black/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
                        <input
                            type="text"
                            placeholder="Search by callsign or type (e.g. RTW, HLF)..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Units List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth">
                    {Object.entries(groupedUnits).map(([category, items]) => (
                        items.length > 0 && (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    {category === 'EMS' ? <Ambulance className="w-4 h-4 text-blue-400" /> : <Truck className="w-4 h-4 text-red-400" />}
                                    <h3 className="text-xs font-black text-textMuted uppercase tracking-[0.2em]">{category} UNITS</h3>
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-textMuted ml-auto">{items.length} units</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {items.map(unit => {
                                        const added = isAlreadyAdded(unit.id);
                                        return (
                                            <button
                                                key={unit.id}
                                                disabled={added}
                                                onClick={() => handleAdd(unit)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group relative overflow-hidden",
                                                    added
                                                        ? "bg-primary/5 border-primary/20 opacity-80 cursor-default"
                                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-2 rounded-lg shrink-0 transition-colors",
                                                    added ? "bg-primary/20 text-primary" : "bg-black/20 text-textMuted group-hover:text-white"
                                                )}>
                                                    {category === 'EMS' ? <Ambulance className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm text-white truncate">{unit.callSign}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-textMuted uppercase font-semibold">{unit.type}</span>
                                                        <span className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            unit.status === 'S1' ? "bg-green-500" : "bg-yellow-500"
                                                        )} />
                                                        <span className="text-[9px] text-textMuted font-mono">{unit.status}</span>
                                                    </div>
                                                </div>
                                                {added ? (
                                                    <Check className="w-5 h-5 text-primary shrink-0" />
                                                ) : (
                                                    <Plus className="w-5 h-5 text-textMuted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}

                    {filteredUnits.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 bg-white/5 rounded-full mb-4">
                                <Search className="w-8 h-8 text-textMuted opacity-20" />
                            </div>
                            <h3 className="text-white font-bold">No units found</h3>
                            <p className="text-sm text-textMuted mt-1">Try a different search term or category.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-all"
                    >
                        Close
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
