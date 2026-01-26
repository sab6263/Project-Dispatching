import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProtocolComplianceProps {
    requiredCategories: string[];
    selectedResources: { type: string; isSelectedForDispatch: boolean }[];
}

export const ProtocolCompliance: React.FC<ProtocolComplianceProps> = ({ requiredCategories, selectedResources }) => {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] uppercase font-bold text-textMuted tracking-wider mr-2">
                Protocol Compliance:
            </span>

            {requiredCategories.map((category) => {
                // Logic: A category is satisfied if AT LEAST ONE selected unit matches the type
                const isSatisfied = selectedResources.some(
                    (res) => res.type.includes(category) && res.isSelectedForDispatch
                );

                return (
                    <div
                        key={category}
                        className={`
                            flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border transition-all duration-300
                            ${isSatisfied
                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"}
                        `}
                    >
                        {isSatisfied ? (
                            <CheckCircle2 className="w-3 h-3" />
                        ) : (
                            <AlertTriangle className="w-3 h-3" />
                        )}
                        {category}
                    </div>
                );
            })}
        </div>
    );
};
