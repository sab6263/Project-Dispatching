import React, { useRef, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { LiveTranscript } from './LiveTranscript';
import { IntakeForm } from './IntakeForm';
import { DispatchRecommendation } from './DispatchRecommendation';
import { CallHeader } from './CallHeader';
import { useCAD } from '../../context/CADContext';

export const CallTakingView: React.FC = () => {
    const { activeCall } = useCAD();
    const [isFocusMode, setIsFocusMode] = useState(false);

    // Panel Refs for imperative resizing
    const transcriptPanelRef = useRef<ImperativePanelHandle>(null);
    const formPanelRef = useRef<ImperativePanelHandle>(null);
    const dispatchPanelRef = useRef<ImperativePanelHandle>(null);

    // Logic: If we have Location & Code -> Dispatch is "Visible" (Ready).
    const isDispatchReady = Boolean(activeCall.location && activeCall.location.length > 3 && activeCall.code);

    // Effect: Handle Dynamic Resizing for Focus Mode
    useEffect(() => {
        const transcriptPanel = transcriptPanelRef.current;
        const formPanel = formPanelRef.current;
        const dispatchPanel = dispatchPanelRef.current;

        if (transcriptPanel && formPanel && dispatchPanel) {
            if (isFocusMode) {
                // Focus Mode: Expand Dispatch to 55-60%, Shrink others proportionally
                transcriptPanel.resize(15);
                formPanel.resize(30);
                dispatchPanel.resize(55);
            } else {
                // Default Mode: Balanced
                transcriptPanel.resize(30);
                formPanel.resize(45);
                dispatchPanel.resize(25);
            }
        }
    }, [isFocusMode, isDispatchReady]);

    return (
        <div className="absolute inset-0 bg-background flex flex-col">
            <CallHeader />

            <div className="flex-1 relative min-h-0">
                <PanelGroup direction="horizontal" style={{ height: '100%' }}>
                    {/* Left Panel: Transcript */}
                    <Panel
                        ref={transcriptPanelRef}
                        defaultSize={isDispatchReady ? 30 : 55}
                        minSize={15}
                        className="p-4 pr-2 transition-all duration-400 ease-in-out min-h-0 h-full"
                    >
                        <LiveTranscript />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-transparent hover:bg-primary transition-colors flex items-center justify-center -ml-0.5 z-10 group">
                        <div className="w-0.5 h-8 bg-border group-hover:bg-primary rounded-full transition-colors" />
                    </PanelResizeHandle>

                    {/* Middle Panel: Intake Form */}
                    <Panel
                        ref={formPanelRef}
                        defaultSize={45}
                        minSize={30}
                        className="p-4 px-2 transition-all duration-400 ease-in-out min-h-0 h-full"
                    >
                        <IntakeForm />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-transparent hover:bg-primary transition-colors flex items-center justify-center -ml-0.5 z-10 group">
                        <div className="w-0.5 h-8 bg-border group-hover:bg-primary rounded-full transition-colors" />
                    </PanelResizeHandle>

                    {/* Right Panel: Dispatch Recommendation */}
                    {/* Only render when ready, creating the dynamic resize effect on the Left Panel */}
                    {isDispatchReady && (
                        <Panel
                            ref={dispatchPanelRef}
                            defaultSize={25}
                            minSize={20}
                            className="p-4 pl-2 min-h-0 h-full overflow-y-auto animate-in slide-in-from-right duration-500"
                        >
                            <DispatchRecommendation onFocusModeChange={setIsFocusMode} />
                        </Panel>
                    )}
                </PanelGroup>
            </div>
        </div>
    );
};
