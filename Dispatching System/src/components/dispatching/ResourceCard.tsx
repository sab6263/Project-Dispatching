import React from 'react';
import { Ambulance, Truck, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ResourceCardProps {
    id: string;
    type: string;
    callsign: string;
    eta: string;
    matchScore: number;
    isSelected: boolean;
    onClick: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ id, type, callsign, eta, matchScore, isSelected, onClick }) => {

    // Helper for color ring based on score
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-500 border-green-500';
        if (score >= 70) return 'text-yellow-500 border-yellow-500';
        return 'text-red-500 border-red-500';
    };

    return (
        <div
            onClick={onClick}
            className={`
                glass-panel rounded-xl p-4 cursor-pointer transition-all duration-300
                hover:bg-white/5 hover:scale-[1.02]
                ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''}
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-white/5 ${isSelected ? 'text-primary' : 'text-textMuted'}`}>
                        {type === 'RTW' ? <Ambulance className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white">{callsign}</h4>
                        <div className="flex items-center gap-2 text-xs text-textMuted uppercase tracking-wider">
                            <span>{type}</span>
                            <span>•</span>
                            <span className="text-white font-mono">{eta}</span>
                        </div>
                    </div>
                </div>

                <div className={`
                    relative w-12 h-12 flex items-center justify-center rounded-full border-4 font-bold text-sm
                    ${getScoreColor(matchScore)}
                `}>
                    {matchScore}%
                </div>
            </div>
        </div>
    );
};
