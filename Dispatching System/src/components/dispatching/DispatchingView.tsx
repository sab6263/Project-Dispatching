import React, { useState } from 'react';
import { ResourceCard } from './ResourceCard';
import { ResourceDetailModal } from './ResourceDetailModal';
import { AlertCircle, Flame, MapPin } from 'lucide-react';

const MOCK_RESOURCES = [
    { id: '1', type: 'RTW', callsign: 'IN-RK 74/1', eta: '5 min', matchScore: 94 },
    { id: '2', type: 'NEF', callsign: 'IN-RK 76/1', eta: '7 min', matchScore: 89 },
    { id: '3', type: 'HLF', callsign: 'IN-FW 10/1', eta: '4 min', matchScore: 91 },
    { id: '4', type: 'DLK', callsign: 'IN-FW 30/1', eta: '6 min', matchScore: 88 },
];

export const DispatchingView: React.FC = () => {
    const [selectedResource, setSelectedResource] = useState<any>(null);

    return (
        <div className="h-full w-full bg-background p-6 overflow-hidden relative flex flex-col gap-6">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Header Section */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30 text-red-500 animate-pulse">
                        <Flame className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-white tracking-tight">F2 - WOHNUNGSBRAND</h1>
                            <span className="bg-red-500 px-2 py-0.5 rounded text-xs font-bold text-white">KRITISCH</span>
                        </div>
                        <div className="flex gap-4 text-sm text-textMuted">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 45 Leopold St, 3. Stock</span>
                            <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Rauch sichtbar, Person in Gefahr</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Einsatzdauer</div>
                    <div className="font-mono text-2xl text-white">00:12:43</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

                {/* Resource Recommendation List */}
                <div className="glass-panel rounded-2xl p-6 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-bold text-textMuted uppercase tracking-widest">Vorgeschlagene Einsatzmittel</h2>
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold">Auto-Dispatch Aktiv</span>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2">
                        {MOCK_RESOURCES.map(res => (
                            <ResourceCard
                                key={res.id}
                                {...res}
                                isSelected={false}
                                onClick={() => setSelectedResource(res)}
                            />
                        ))}
                    </div>
                </div>

                {/* Map Placeholder or Secondary Info */}
                <div className="glass-panel rounded-2xl p-6 flex items-center justify-center text-textMuted border-dashed border-2 border-white/5">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Kartenansicht (Placeholder)</p>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <ResourceDetailModal
                resource={selectedResource}
                isOpen={!!selectedResource}
                onClose={() => setSelectedResource(null)}
            />

        </div>
    );
};
