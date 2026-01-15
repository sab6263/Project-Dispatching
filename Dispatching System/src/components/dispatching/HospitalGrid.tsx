import React, { useMemo } from 'react';
import { MOCK_HOSPITALS } from '../../data/mockData';
import { Building2, Stethoscope, Gauge } from 'lucide-react';
import { cn } from '../../lib/utils';

export const HospitalGrid: React.FC = () => {
    // Sort: Available first, then Limited, then Full. Secondary sort by distance.
    const sortedHospitals = useMemo(() => {
        const priority = { 'Available': 0, 'Limited': 1, 'Full': 2 };
        return [...MOCK_HOSPITALS].sort((a, b) => {
            const statusDiff = priority[a.status] - priority[b.status];
            if (statusDiff !== 0) return statusDiff;
            return a.distance - b.distance;
        });
    }, []);

    const getStatusColor = (status: import('../../types').Hospital['status']) => {
        switch (status) {
            case 'Available': return 'bg-success text-black border-success/50';
            case 'Limited': return 'bg-warning text-black border-warning/50';
            case 'Full': return 'bg-danger text-white border-danger/50';
        }
    };

    return (
        <div className="h-full bg-surface rounded-xl border border-border flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-surfaceHighlight/30 flex items-center justify-between">
                <h3 className="font-semibold text-textMain tracking-wide flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> KRANKENHÄUSER (IVENA)
                </h3>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {sortedHospitals.map(hospital => (
                    <div key={hospital.id} className="bg-background rounded-lg border border-border p-3 flex justify-between items-center group hover:border-primary/50 transition-all">
                        <div className="flex flex-col gap-1">
                            <div className="font-bold text-white group-hover:text-primary transition-colors">{hospital.name}</div>
                            <div className="text-xs text-textMuted flex items-center gap-2">
                                <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {hospital.distance} km</span>
                                <span className="text-border">|</span>
                                <span className="opacity-75">{hospital.address}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {hospital.specialties.map(spec => (
                                    <span key={spec} className="text-[10px] px-1.5 py-0.5 rounded bg-surfaceHighlight border border-border text-textMuted flex items-center gap-1">
                                        <Stethoscope className="w-2.5 h-2.5" /> {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ml-4 min-w-[80px] text-center",
                            getStatusColor(hospital.status)
                        )}>
                            {hospital.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
