import React, { useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { LiveTranscript } from './LiveTranscript';
import { IntakeForm } from './IntakeForm';
import { DispatchRecommendation } from './DispatchRecommendation'; // New Import
import { CallHeader } from './CallHeader';

export const CallTakingView: React.FC = () => {
    const transcriptRef = useRef<ImperativePanelHandle>(null);
    const [isTranscriptCollapsed, setIsTranscriptCollapsed] = useState(false);

    const toggleTranscript = () => {
        const panel = transcriptRef.current;
        if (panel) {
            if (isTranscriptCollapsed) {
                panel.expand();
            } else {
                panel.collapse();
            }
        }
    };

    return (
        <div className="absolute inset-0 bg-background flex flex-col">
            {/* New Header */}
            <CallHeader />

            <div className="flex-1 relative">
                <PanelGroup direction="horizontal" style={{ height: '100%' }}>
                    {/* Left Panel: Transcript */}
                    <Panel
                        ref={transcriptRef}
                        defaultSize={30}
                        minSize={15}
                        collapsible={true}
                        collapsedSize={0}
                        onCollapse={() => setIsTranscriptCollapsed(true)}
                        onExpand={() => setIsTranscriptCollapsed(false)}
                        className="p-4 pr-2 transition-all duration-300 ease-in-out h-full flex flex-col overflow-hidden"
                    >
                        <LiveTranscript onToggleCollapse={toggleTranscript} isCollapsed={isTranscriptCollapsed} />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-transparent hover:bg-primary transition-colors flex items-center justify-center -ml-0.5 z-10 group">
                        <div className="w-0.5 h-8 bg-border group-hover:bg-primary rounded-full transition-colors" />
                    </PanelResizeHandle>

                    {/* Middle Panel: Intake Form */}
                    <Panel defaultSize={45} minSize={30} className="p-4 px-2">
                        <IntakeForm />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-transparent hover:bg-primary transition-colors flex items-center justify-center -ml-0.5 z-10 group">
                        <div className="w-0.5 h-8 bg-border group-hover:bg-primary rounded-full transition-colors" />
                    </PanelResizeHandle>

                    {/* Right Panel: Dispatch Recommendation */}
                    <Panel defaultSize={25} minSize={20} className="p-4 pl-2 h-full flex flex-col overflow-hidden">
                        <DispatchRecommendation />
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};
