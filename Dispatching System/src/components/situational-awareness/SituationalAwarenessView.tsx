import React, { useState } from 'react';
import { OperationalMap } from './OperationalMap';
import { ResourceGrid } from '../dispatching/ResourceGrid';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronRight, ChevronsRight } from 'lucide-react';


export const SituationalAwarenessView: React.FC = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(true);

    return (
        <div className="absolute inset-0 bg-background overflow-hidden">
            {/* Full Screen Map Layer */}
            <div className="absolute inset-0 z-0">
                <OperationalMap />
            </div>

            {/* Floating Resizable Overlay Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {isOverlayOpen ? (
                    <PanelGroup direction="horizontal" autoSaveId="view2-overlay">
                        {/* Spacer Panel - Transparent to show map */}
                        <Panel className="bg-transparent" minSize={50} />

                        <PanelResizeHandle className="w-4 -ml-2 bg-transparent hover:bg-white/5 transition-colors flex items-center justify-center cursor-col-resize group pointer-events-auto z-50">
                            <div className="h-16 w-1.5 rounded-full bg-surface border border-border group-hover:bg-primary group-hover:border-primary shadow-xl transition-all" />
                        </PanelResizeHandle>

                        {/* Content Panel - Max 50% */}
                        <Panel defaultSize={25} minSize={20} maxSize={50} className="pointer-events-auto flex flex-col z-20">
                            <div className="h-full bg-surface/85 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col overflow-hidden">
                                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/20">
                                    <span className="font-bold text-xs uppercase tracking-wider text-white">Einsatzmittel</span>
                                    <button
                                        onClick={() => setIsOverlayOpen(false)}
                                        className="p-1 hover:bg-white/10 rounded transition-colors text-textMuted hover:text-white"
                                        title="Panel schließen"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden p-2">
                                    <ResourceGrid />
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                ) : (
                    <div className="absolute top-4 right-4 pointer-events-auto">
                        <button
                            onClick={() => setIsOverlayOpen(true)}
                            className="bg-surface/90 backdrop-blur border border-white/10 px-4 py-2 rounded-lg text-white font-bold text-xs shadow-xl hover:bg-primary/20 hover:border-primary/50 transition-all flex items-center gap-2"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            Ressourcen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
