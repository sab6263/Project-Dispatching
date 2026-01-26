import { Ambulance, Truck, CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ResourceCardProps {
    id: string;
    type: string;
    callsign: string;
    eta: string;
    matchScore: number;
    distance?: string;
    trafficInfo?: string;
    category?: 'Fire' | 'EMS';
    // Selection for Detail View Focus
    isSelected?: boolean;
    onClick?: () => void;
    // Selection for Dispatch (Protocol Compliance)
    isSelectedForDispatch?: boolean;
    onToggleSelection?: (e: React.MouseEvent) => void;
    onRemove?: (e: React.MouseEvent) => void;
    isManual?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
    type, callsign, eta, matchScore,
    distance, category,
    isSelected, onClick,
    isSelectedForDispatch = true, // Default to true
    onToggleSelection,
    onRemove,
    isManual
}) => {

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
                p-3 rounded-lg border transition-all cursor-pointer group relative overflow-hidden
                ${isSelected
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "bg-surface border-white/5 hover:bg-surfaceHighlight hover:border-white/10"
                }
                ${!isSelectedForDispatch ? "opacity-50 grayscale-[0.5]" : ""}
            `}
        >
            {/* Selection Checkbox (Stop propagation to prevent focus change) */}
            <div
                className="absolute top-3 right-3 z-10 flex flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Select/Deselect Toggle */}
                <div
                    onClick={onToggleSelection}
                    className={`
                        w-6 h-6 rounded border flex items-center justify-center transition-colors cursor-pointer
                        ${isSelectedForDispatch
                            ? "bg-green-500 border-green-500 text-black hover:bg-green-400"
                            : "bg-surface border-white/20 hover:border-white/40 hover:bg-white/10"}
                    `}
                >
                    {isSelectedForDispatch && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                {/* Remove Action */}
                <div
                    onClick={onRemove}
                    className="w-6 h-6 rounded border border-white/10 bg-surface flex items-center justify-center text-textMuted hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove from list"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Content Container */}
            <div className="flex justify-between items-start mb-1 pr-8">
                <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <div className={cn(
                        "p-3 rounded-xl bg-white/5 flex items-center justify-center transition-colors",
                        isSelected ? 'text-primary bg-primary/20' : 'text-textMuted group-hover:text-white'
                    )}>
                        {(type.includes('RTW') || type.includes('KTW') || (category === 'EMS' && !type.includes('NEF'))) ? (
                            <Ambulance className="w-6 h-6" />
                        ) : (
                            <Truck className="w-6 h-6" />
                        )}
                    </div>

                    {/* Text Details */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-xl text-white tracking-tight">{callsign}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-bold text-textMuted uppercase tracking-wider">
                                {type}
                            </span>
                        </div>
                        {/* ETA & Distance Context */}
                        <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-green-400 font-bold">{eta}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-textMuted">{distance}{distance && !distance.includes('km') && !distance.includes('--') ? ' km' : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Score & Label */}
                {!isManual ? (
                    <div className="flex flex-col items-end justify-center min-w-[80px]">
                        {/* Score Ring */}
                        <div className={cn(
                            "relative w-12 h-12 flex items-center justify-center rounded-full border-[3px] font-bold text-sm bg-black/20 mb-1",
                            getScoreColor(matchScore)
                        )}>
                            {matchScore}%
                        </div>
                        <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider text-right leading-tight">
                            System<br />Confidence
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-end justify-center min-w-[80px] pt-2">
                        <span className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
                            User Added
                        </span>
                    </div>
                )}
            </div >
        </div >
    );
};
