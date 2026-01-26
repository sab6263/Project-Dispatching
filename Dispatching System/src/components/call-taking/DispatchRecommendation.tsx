import React, { useState } from 'react';
import { ResourceCard } from '../dispatching/ResourceCard';
import { ResourceDetailModal } from '../dispatching/ResourceDetailModal'; // Using this as the view component
import { Flame, CheckCircle2 } from 'lucide-react';
import { useCAD } from '../../context/CADContext';
import { cn } from '../../lib/utils';

import { ProtocolCompliance } from '../dispatching/ProtocolCompliance';

import { AddUnitModal } from './AddUnitModal';

export const DispatchRecommendation: React.FC<{ onFocusModeChange: (isFocus: boolean) => void }> = ({ onFocusModeChange }) => {
    const {
        activeCall,
        dispatchProposalUnits,
        addToDispatchProposal,
        removeFromDispatchProposal,
        dispatchResources,
        deselectedManualIds,
        toggleResourceSelection
    } = useCAD();
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);

    // Combine mock recommendations (from Context) with units added from Map
    const allResources = React.useMemo(() => {
        const addedResources = dispatchProposalUnits.map(unit => ({
            id: unit.id,
            type: unit.type,
            category: unit.category,
            callsign: unit.callSign,
            eta: unit.eta || 'Calculated from Map',
            matchScore: 100,
            distance: unit.distance || '--',
            trafficInfo: 'Live Data',
            equipmentStatus: 'ready' as const,
            crewStatus: 'ready' as const,
            routeStatus: 'optimal' as const,
            isSelectedForDispatch: !deselectedManualIds.has(unit.id),
            isManual: true // To distinguish from mock
        }));

        // Use the persistent mock recommendations from context
        const persistentMockResources = dispatchResources.map(res => ({
            ...res,
            isManual: false
        }));

        return [...persistentMockResources, ...addedResources];
    }, [dispatchResources, dispatchProposalUnits, deselectedManualIds]);

    // Mock Requirements based on Call Code
    const REQUIRED_CATEGORIES = ['RTW', 'NEF', 'HLF'];

    const handleToggleResource = (id: string, isManual?: boolean) => {
        toggleResourceSelection(id, isManual);
    };

    const handleRemoveResource = (id: string, isManual?: boolean) => {
        if (isManual) {
            removeFromDispatchProposal(id);
        } else {
            // We can add a way to hide mock resources if needed,
            // but for now persistence is the priority.
            toggleResourceSelection(id, false); // Just deselect for now
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const vehicleData = e.dataTransfer.getData('vehicle');
        if (vehicleData) {
            try {
                const vehicle = JSON.parse(vehicleData);
                // Convert Map Vehicle to Unit type for context
                addToDispatchProposal({
                    id: vehicle.id,
                    callSign: vehicle.name,
                    type: vehicle.subtype as any, // Simple mapping
                    category: vehicle.category,
                    status: vehicle.status as any,
                    location: { lat: vehicle.position[0], lng: vehicle.position[1] },
                    capabilities: [],
                    statusLastUpdated: new Date().toISOString()
                });
            } catch (err) {
                console.error('Failed to parse dropped vehicle data', err);
            }
        }
    };

    // Strict Component Swapping Logic (State B)
    if (selectedResource) {
        return (
            <div className="h-full w-full bg-transparent animate-in slide-in-from-right duration-300">
                <ResourceDetailModal
                    resource={selectedResource}
                    isOpen={true}
                    onClose={() => setSelectedResource(null)}
                    isInline={true}
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "h-full w-full bg-transparent flex flex-col gap-4 relative animate-in fade-in transition-colors",
                isDraggingOver && "bg-primary/5 ring-2 ring-primary/20 rounded-xl"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >

            {/* Header */}
            <div className="shrink-0 flex flex-col border-b border-white/5 pb-2">
                <div className="flex items-center justify-between py-2">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                            <span className="text-red-500">{activeCall.code || "F2"}</span>
                            <span>{activeCall.keyword ? activeCall.keyword.split(',')[0] : "Housing Fire"}</span>
                        </h2>
                        <div className="text-xs text-textMuted uppercase tracking-widest mt-1">
                            {activeCall.keyword || "Smoke • Person in Danger • 3rd Floor"}
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Auto-Dispatch Ready
                    </div>
                </div>

                {/* Protocol Compliance Widget - Encapsulated */}
                <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3">
                    <ProtocolCompliance
                        requiredCategories={REQUIRED_CATEGORIES}
                        selectedResources={allResources}
                    />
                </div>
            </div>

            {/* Main Content: Larger Cards List */}
            <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-4 pt-2 pb-20"> {/* pb-20 for footer space */}
                {allResources.map(res => (
                    <ResourceCard
                        key={res.id}
                        {...res}
                        isSelected={selectedResource?.id === res.id}
                        onClick={() => {
                            setSelectedResource(res);
                            onFocusModeChange(true);
                        }}
                        // Pass Dispatch Selection Props
                        isSelectedForDispatch={res.isSelectedForDispatch}
                        onToggleSelection={() => handleToggleResource(res.id, (res as any).isManual)}
                        onRemove={() => handleRemoveResource(res.id, (res as any).isManual)}
                    />
                ))}
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface border-t border-white/10 backdrop-blur-md flex gap-4 z-20">
                <button
                    onClick={() => setIsAddUnitModalOpen(true)}
                    className="flex-1 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs transition-all"
                >
                    Add Unit
                </button>
                <button className="flex-[2] py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2">
                    <Flame className="w-4 h-4" /> Dispatch
                </button>
            </div>

            {/* Modals */}
            <AddUnitModal
                isOpen={isAddUnitModalOpen}
                onClose={() => setIsAddUnitModalOpen(false)}
            />
        </div>
    );
};
