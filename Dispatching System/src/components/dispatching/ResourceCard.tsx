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
                glass-panel rounded-xl p-6 cursor-pointer transition-all duration-300
                hover:bg-white/5 hover:scale-[1.01]
                ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''}
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-full bg-white/5 ${isSelected ? 'text-primary' : 'text-textMuted'}`}>
                        {type === 'RTW' ? <Ambulance className="w-8 h-8" /> : <Truck className="w-8 h-8" />}
                    </div>
                    <div>
                        <h4 className="font-bold text-2xl text-white mb-1">{callsign}</h4>
                        <div className="flex items-center gap-3 text-sm text-textMuted uppercase tracking-wider">
                            <span className="font-bold">{type}</span>
                            <span>•</span>
                            <span className="text-white font-mono text-base">{eta}</span>
                        </div>
                    </div>
                </div>

                <div className={`
                    relative w-16 h-16 flex items-center justify-center rounded-full border-[5px] font-bold text-xl
                    ${getScoreColor(matchScore)}
                `}>
                    {matchScore}%
                </div>
            </div>
        </div>
    );
};
