import React from 'react';
import { IncidentGrid } from '../situational-awareness/IncidentGrid';

export const DispatchingView: React.FC = () => {
    return (
        <div className="h-full w-full bg-background p-4 overflow-hidden relative">
            {/* Background Gradient Mesh for "Premium" feel */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 h-full">
                <IncidentGrid isFullScreen={true} />
            </div>
        </div>
    );
};
