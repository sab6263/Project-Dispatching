import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Incident, Unit, CallData, AIRecommendation } from '../types';
import { MOCK_INCIDENTS, MOCK_UNITS } from '../data/mockData';

interface CADContextType {
    incidents: Incident[];
    units: Unit[];
    activeCall: CallData;
    aiRecommendation: AIRecommendation | null;
    setActiveCall: React.Dispatch<React.SetStateAction<CallData>>;
    setAIRecommendation: React.Dispatch<React.SetStateAction<AIRecommendation | null>>;
    addIncident: (incident: Incident) => void;
    updateIncidentStatus: (id: string, status: Incident['status']) => void;
    assignUnit: (incidentId: string, unitId: string) => void;
    updateUnitStatus: (unitId: string, status: Unit['status']) => void;
    selectedUnitId: string | null;
    setSelectedUnitId: React.Dispatch<React.SetStateAction<string | null>>;
    activeTranscriptHighlight: string | null;
    setActiveTranscriptHighlight: React.Dispatch<React.SetStateAction<string | null>>;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const defaultCallData: CallData = {
    id: '', // Added Case ID
    callerName: '',
    callerPhone: '',
    location: '',
    notes: '',
    transcript: [],
    priority: '',
};

const CADContext = createContext<CADContextType | undefined>(undefined);

export const CADProvider = ({ children }: { children: ReactNode }) => {
    const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
    const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);
    const [activeCall, setActiveCall] = useState<CallData>(defaultCallData);
    const [aiRecommendation, setAIRecommendation] = useState<AIRecommendation | null>(null);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const [activeTranscriptHighlight, setActiveTranscriptHighlight] = useState<string | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Theme Effect
    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const addIncident = React.useCallback((incident: Incident) => {
        setIncidents((prev) => [incident, ...prev]);
    }, []);

    const updateIncidentStatus = React.useCallback((id: string, status: Incident['status']) => {
        setIncidents((prev) =>
            prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
        );
    }, []);

    const assignUnit = React.useCallback((incidentId: string, unitId: string) => {
        // Update incident assigned units
        setIncidents((prev) =>
            prev.map((inc) =>
                inc.id === incidentId
                    ? { ...inc, assignedUnits: [...inc.assignedUnits, unitId] }
                    : inc
            )
        );

        // Update unit status to dispatched (S3) automatically? Or let user do it?
        // User requirement: "Action Panel... allowing the dispatcher to assign specific units".
        // Usually assigning implies sending them. Let's set unit to S3 (En Route) if it was S1/S2.
        setUnits((prev) =>
            prev.map((unit) =>
                unit.id === unitId ? { ...unit, status: 'S3' } : unit
            )
        );
    }, []);

    const updateUnitStatus = React.useCallback((unitId: string, status: Unit['status']) => {
        setUnits((prev) =>
            prev.map((unit) => (unit.id === unitId ? {
                ...unit,
                status,
                statusLastUpdated: new Date().toISOString()
            } : unit))
        );
    }, []);

    const value = React.useMemo(() => ({
        incidents,
        units,
        activeCall,
        setActiveCall,
        aiRecommendation,
        setAIRecommendation,
        addIncident,
        updateIncidentStatus,
        assignUnit,
        updateUnitStatus,
        selectedUnitId,
        setSelectedUnitId,
        activeTranscriptHighlight,
        setActiveTranscriptHighlight,
        theme,
        toggleTheme
    }), [incidents, units, activeCall, aiRecommendation, addIncident, updateIncidentStatus, assignUnit, updateUnitStatus, selectedUnitId, activeTranscriptHighlight, theme]);

    return (
        <CADContext.Provider
            value={value}
        >
            {children}
        </CADContext.Provider>
    );
};

export const useCAD = () => {
    const context = useContext(CADContext);
    if (context === undefined) {
        throw new Error('useCAD must be used within a CADProvider');
    }
    return context;
};
