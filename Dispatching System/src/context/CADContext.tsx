import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Incident, Unit, CallData, AIRecommendation } from '../types';

export type { Incident, Unit, CallData, AIRecommendation };
type CADIncident = Incident;
type CADUnit = Unit;
import { MOCK_INCIDENTS, MOCK_UNITS } from '../data/mockData';

interface CADContextType {
    incidents: CADIncident[];
    units: CADUnit[];
    activeCall: CallData;
    aiRecommendation: AIRecommendation | null;
    setActiveCall: React.Dispatch<React.SetStateAction<CallData>>;
    setAIRecommendation: React.Dispatch<React.SetStateAction<AIRecommendation | null>>;
    addIncident: (incident: CADIncident) => void;
    updateIncidentStatus: (id: string, status: CADIncident['status']) => void;
    assignUnit: (incidentId: string, unitId: string) => void;
    updateUnitStatus: (unitId: string, status: CADUnit['status']) => void;
    selectedUnitId: string | null;
    setSelectedUnitId: React.Dispatch<React.SetStateAction<string | null>>;
    activeTranscriptHighlight: string | null;
    setActiveTranscriptHighlight: React.Dispatch<React.SetStateAction<string | null>>;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    dispatchProposalUnits: CADUnit[];
    addToDispatchProposal: (unit: CADUnit) => void;
    removeFromDispatchProposal: (unitId: string) => void;
    // Dispatch Recommendations Persistence
    dispatchResources: any[];
    setDispatchResources: React.Dispatch<React.SetStateAction<any[]>>;
    deselectedManualIds: Set<CADUnit['id']>;
    toggleResourceSelection: (id: string, isManual?: boolean) => void;
}

const defaultCallData: CallData = {
    id: 'C-2024-001',
    callerName: '',
    callerPhone: '',
    location: '',
    notes: '',
    transcript: [],
    priority: '',
    summary: '',
    lat: 48.765,
    lng: 11.424,
    code: '',
    keyword: '',
    zip: '',
    city: '',
    district: '',
    street: '',
    floor: '',
    affectedPersonCount: ''
};

const MOCK_RECOMMENDATIONS = [
    {
        id: '1', type: 'RTW', callsign: 'IN-RK 74/1', eta: '5 min', matchScore: 94,
        distance: '3.2 km', trafficInfo: 'Clear',
        equipmentStatus: 'ready', crewStatus: 'ready', routeStatus: 'optimal'
    },
    {
        id: '2', type: 'NEF', callsign: 'IN-RK 76/1', eta: '7 min', matchScore: 89,
        distance: '5.1 km', trafficInfo: 'Heavy Traffic',
        equipmentStatus: 'ready', crewStatus: 'ready', routeStatus: 'diverted'
    },
    {
        id: '3', type: 'HLF', callsign: 'IN-FW 10/1', eta: '4 min', matchScore: 91,
        distance: '2.8 km', trafficInfo: 'Clear',
        equipmentStatus: 'missing', crewStatus: 'ready', routeStatus: 'optimal'
    },
    {
        id: '4', type: 'DLK', callsign: 'IN-FW 30/1', eta: '6 min', matchScore: 88,
        distance: '4.5 km', trafficInfo: 'Clear',
        equipmentStatus: 'ready', crewStatus: 'warning', routeStatus: 'optimal'
    },
];

// Map Raw Mock Data to CAD Types
const mappedIncidents: CADIncident[] = MOCK_INCIDENTS.map(inc => ({
    id: inc.id,
    type: inc.type,
    category: 'Fire', // Default mapping
    location: {
        address: inc.address,
        lat: inc.position[0],
        lng: inc.position[1]
    },
    priority: '1',
    status: inc.severity === 'High' ? 'Dispatching' : 'Open',
    createdAt: new Date().toISOString(),
    description: inc.description,
    assignedUnits: []
}));

const mappedUnits: CADUnit[] = MOCK_UNITS.map(unit => ({
    id: unit.id,
    callSign: unit.name,
    type: unit.subtype as any,
    category: unit.category,
    status: unit.status === 'Available' ? 'S1' : 'S3', // Map status strings to codes
    location: {
        lat: unit.position[0],
        lng: unit.position[1]
    },
    capabilities: [],
    statusLastUpdated: new Date().toISOString()
}));

const CADContext = createContext<CADContextType | undefined>(undefined);

export const CADProvider = ({ children }: { children: ReactNode }) => {
    const [incidents, setIncidents] = useState<CADIncident[]>(mappedIncidents);
    const [units, setUnits] = useState<CADUnit[]>(mappedUnits);
    const [activeCall, setActiveCall] = useState<CallData>(defaultCallData);
    const [aiRecommendation, setAIRecommendation] = useState<AIRecommendation | null>(null);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const [activeTranscriptHighlight, setActiveTranscriptHighlight] = useState<string | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [dispatchProposalUnits, setDispatchProposalUnits] = useState<CADUnit[]>([]);

    // Dispatch Recommendation Persistence
    const [dispatchResources, setDispatchResources] = useState<any[]>(
        MOCK_RECOMMENDATIONS.map(r => ({ ...r, isSelectedForDispatch: true }))
    );
    const [deselectedManualIds, setDeselectedManualIds] = useState<Set<string>>(new Set());

    // Theme Effect
    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const addIncident = (incident: CADIncident) => {
        setIncidents(prev => [...prev, incident]);
    };

    const updateIncidentStatus = (id: string, status: CADIncident['status']) => {
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    };

    const assignUnit = (incidentId: string, unitId: string) => {
        // Update incident assigned units
        setIncidents(prev => prev.map(inc =>
            inc.id === incidentId
                ? { ...inc, assignedUnits: [...inc.assignedUnits, unitId] }
                : inc
        ));

        // Update unit status to dispatched (S3) automatically
        setUnits(prev => prev.map(unit =>
            unit.id === unitId ? { ...unit, status: 'S3' } : unit
        ));
    };

    const updateUnitStatus = (unitId: string, status: CADUnit['status']) => {
        setUnits(prev => prev.map(u => u.id === unitId ? {
            ...u,
            status,
            statusLastUpdated: new Date().toISOString()
        } : u));
    };

    const addToDispatchProposal = (unit: CADUnit) => {
        setDispatchProposalUnits(prev => {
            // Avoid duplicates
            if (prev.find(u => u.id === unit.id)) return prev;
            return [...prev, unit];
        });
    };

    const removeFromDispatchProposal = (unitId: string) => {
        setDispatchProposalUnits(prev => prev.filter(u => u.id !== unitId));
        setDeselectedManualIds(prev => {
            const next = new Set(prev);
            next.delete(unitId);
            return next;
        });
    };

    const toggleResourceSelection = (id: string, isManual?: boolean) => {
        if (isManual) {
            setDeselectedManualIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        } else {
            setDispatchResources(prev => prev.map(res =>
                res.id === id
                    ? { ...res, isSelectedForDispatch: !res.isSelectedForDispatch }
                    : res
            ));
        }
    };

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
        toggleTheme,
        dispatchProposalUnits,
        addToDispatchProposal,
        removeFromDispatchProposal,
        dispatchResources,
        setDispatchResources,
        deselectedManualIds,
        toggleResourceSelection
    }), [incidents, units, activeCall, aiRecommendation, addIncident, updateIncidentStatus, assignUnit, updateUnitStatus, selectedUnitId, activeTranscriptHighlight, theme, dispatchProposalUnits, addToDispatchProposal, removeFromDispatchProposal, dispatchResources, deselectedManualIds, toggleResourceSelection]);

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
