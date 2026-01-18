import React, { useState } from 'react';
import { ResourceCard } from '../dispatching/ResourceCard';
import { ResourceDetailModal } from '../dispatching/ResourceDetailModal';
import { Flame, CheckCircle2 } from 'lucide-react';

// Mock Data for the Recommendation logic
const MOCK_RECOMMENDATIONS = [
    { id: '1', type: 'RTW', callsign: 'IN-RK 74/1', eta: '5 min', matchScore: 94 },
    { id: '2', type: 'NEF', callsign: 'IN-RK 76/1', eta: '7 min', matchScore: 89 },
    { id: '3', type: 'HLF', callsign: 'IN-FW 10/1', eta: '4 min', matchScore: 91 },
    { id: '4', type: 'DLK', callsign: 'IN-FW 30/1', eta: '6 min', matchScore: 88 },
];

export const DispatchRecommendation: React.FC = () => {
    const [selectedResource, setSelectedResource] = useState<any>(null);

    return (
        <div className="h-full w-full bg-transparent flex flex-col gap-4 relative overflow-hidden">

            {/* Header: Simplified as requested */}
            <div className="shrink-0 flex items-center justify-between py-2 border-b border-white/5">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                        <span className="text-red-500">F2</span>
                        <span>Wohnungsbrand</span>
                    </h2>
                    <div className="text-xs text-textMuted uppercase tracking-widest mt-1">Rauch • Person in Gefahr • 3. OG</div>
                </div>
                <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-Dispatch Ready
                </div>
            </div>

            {/* Main Content: Larger Cards List */}
            <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-4 pt-2">
                {MOCK_RECOMMENDATIONS.map(res => (
                    <ResourceCard
                        key={res.id}
                        {...res}
                        isSelected={selectedResource?.id === res.id}
                        onClick={() => setSelectedResource(res)}
                    />
                ))}

                {/* Visual padding at bottom */}
                <div className="h-4" />
            </div>

            {/* Detail Modal Integration */}
            <ResourceDetailModal
                resource={selectedResource}
                isOpen={!!selectedResource}
                onClose={() => setSelectedResource(null)}
            />
        </div>
    );
};
