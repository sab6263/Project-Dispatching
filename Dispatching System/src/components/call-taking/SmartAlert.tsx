import React from 'react';
import { Zap, CheckCircle, ArrowRight, XCircle, Plus, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSupervisorAgent } from '../../hooks/useSupervisorAgent';

const FULL_QUICK_ACTIONS = [
    { label: "Reanimation", code: "R0", keyword: "Herz-Kreislauf-Stillstand", desc: "Laufende Reanimation", units: ["RTW", "NEF", "HLF"], color: "bg-red-500" },
    { label: "Feuer Groß", code: "B4", keyword: "Brand Industrie/Wohn", desc: "Offenes Feuer, Menschengefahr", units: ["ELW", "HLF", "HLF", "DLK", "RTW"], color: "bg-orange-500" },
    { label: "VU Person klemmt", code: "THL3", keyword: "Verkehrsunfall", desc: "Pkw gegen Baum, Person eingeklemmt", units: ["HLF", "RW", "RTW", "NEF", "Pol"], color: "bg-blue-500" }
];

export const SmartAlert: React.FC = () => {
    const { recommendation, sentiment, actions } = useSupervisorAgent();

    if (!recommendation || recommendation.status === 'rejected') {
        return (
            <div className="h-full flex flex-col gap-4">
                {/* Sentiment Header even without recommendation? Maybe not, AI analyzes content anyway. Let's show it if score > 0.2 */}
                {(sentiment.score > 0.2) && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className={cn("px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shadow-sm backdrop-blur-md flex items-center gap-2",
                            sentiment.label === 'Panisch' ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" :
                                sentiment.label === 'Besorgt' ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                                    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30")}>
                            <span>Sentiment: {sentiment.label}</span>
                        </div>
                    </div>
                )}

                <div className="bg-surface rounded-xl border border-border border-dashed p-6 flex flex-col items-center justify-center text-textMuted opacity-50 flex-1 relative">
                    <Zap className="w-8 h-8 mb-2" />
                    <span className="text-sm">Warte auf Analyse...</span>
                </div>
                <div className="bg-surface rounded-xl border border-border p-4">
                    <h4 className="text-xs font-semibold text-textMuted uppercase mb-3 text-center">Schnellzugriff</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {FULL_QUICK_ACTIONS.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => actions.manualTrigger(action)}
                                className={`p-2 rounded-lg ${action.color} text-white text-xs font-bold transition-transform hover:scale-105 shadow-lg`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const isAccepted = recommendation.status === 'accepted';

    return (
        <div className={cn("h-full bg-surface rounded-xl border relative overflow-hidden flex flex-col transition-all duration-300",
            isAccepted ? "border-success/50 bg-success/5" : "border-primary/50")}>

            <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", isAccepted ? "from-success to-green-400" : "from-primary to-purple-500")} />

            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", isAccepted ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                        {isAccepted ? <CheckCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-white leading-none">{isAccepted ? "DISPOSITION BESTÄTIGT" : "KI SUPERVISOR"}</h3>
                        {!isAccepted && <span className="text-[10px] text-textMuted mt-1">Überwache Einsatzlage...</span>}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {!isAccepted && (
                        <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-success/20 text-success bg-success/10">
                            {Math.round(recommendation.confidence * 100)}% Match
                        </div>
                    )}
                    <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                        sentiment.label === 'Panisch' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            sentiment.label === 'Besorgt' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>
                        {sentiment.label}
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
                {!isAccepted && (
                    <div className="bg-surfaceHighlight/50 p-3 rounded-lg border border-border/50">
                        <div className="text-[10px] text-textMuted uppercase mb-1">KI Reasoning Logic</div>
                        <div className="text-sm text-textLight italic font-serif leading-relaxed">
                            "{recommendation.reasoning || "Analyse based on transcript keywords."}"
                        </div>
                    </div>
                )}

                <div>
                    <div className="text-xs text-textMuted uppercase mb-1">Einsatzstichwort</div>
                    <div className="flex items-end gap-3">
                        <span className="text-2xl font-bold text-primary">{recommendation.code}</span>
                        <span className="text-xl font-medium text-white">{recommendation.keyword}</span>
                    </div>
                    <div className="text-sm text-textMuted mt-1">{recommendation.description}</div>
                </div>

                <div>
                    <div className="text-xs text-textMuted uppercase mb-2 flex justify-between items-center">
                        <span>Empfohlene Kräfte</span>
                        {!isAccepted && <button onClick={actions.addUnit} className="text-primary hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recommendation.units.map((unit, i) => (
                            <span key={i} className="px-3 py-1.5 bg-surfaceHighlight border border-border rounded-lg text-sm font-medium text-white shadow-sm flex items-center gap-2 group">
                                {unit}
                                {!isAccepted && <button onClick={() => actions.removeUnit(unit)} className="text-textMuted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>}
                            </span>
                        ))}
                        {recommendation.units.length === 0 && <span className="text-sm text-textMuted italic">Keine Kräfte ausgewählt</span>}
                    </div>
                </div>

                <div className="mt-auto pt-4 flex gap-3">
                    {!isAccepted ? (
                        <>
                            <button onClick={actions.reject} className="flex-1 bg-surfaceHighlight hover:bg-red-500/10 text-textMuted hover:text-red-400 border border-border py-2.5 rounded-lg flex items-center justify-center gap-2">
                                <XCircle className="w-4 h-4" /> Ablehnen
                            </button>
                            <button onClick={actions.accept} className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                <CheckCircle className="w-4 h-4" /> Übernehmen
                            </button>
                        </>
                    ) : (
                        <button className="w-full bg-success hover:bg-success/90 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-success/20">
                            Alarmieren <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
