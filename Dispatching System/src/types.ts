export type Priority = '1' | '2' | '3';
export type UnitStatus = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
export type UnitType = 'RTW' | 'NEF' | 'KTW' | 'HLF' | 'DLK' | 'ELW';

export interface Incident {
    id: string;
    code?: string;
    keyword?: string;
    type: string;
    category: string; // e.g. "Feuer", "Technische Hilfe", "Rettungsdienst"
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    priority: Priority;
    status: 'Open' | 'Dispatching' | 'Active' | 'Closed';
    createdAt: string;
    description?: string;
    assignedUnits: string[]; // Unit IDs
}

export interface Unit {
    id: string;
    callSign: string; // e.g. "Florian München 1/46-1"
    type: UnitType;
    category?: 'Fire' | 'EMS';
    status: UnitStatus;
    distance?: string;
    eta?: string;
    location: {
        lat: number;
        lng: number;
    };
    capabilities: string[];
    statusLastUpdated: string; // ISO 8601
}

export interface CallData {
    id: string; // Added Case ID
    callerName: string;
    callerPhone: string;
    location: string;
    notes: string;
    transcript: string[];
    priority?: string;
    summary?: string;
    lat?: number;
    lng?: number;
    isAddressValid?: boolean;
    // Classification
    code?: string;
    keyword?: string;
    // Address Details
    zip?: string;
    city?: string;
    district?: string;
    street?: string;
    floor?: string;
    // Scheduled
    patientName?: string;
    transportType?: string;
    // New Fields
    affectedPersonCount?: string;
}

export interface AIRecommendation {
    code: string;
    keyword: string;
    description: string;
    confidence: number;
    reasoning: string;
    matchedKeywords: string[];
    units: string[];
    status: 'analyzing' | 'suggested' | 'accepted' | 'rejected';
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    distance: number; // km
    status: 'Available' | 'Limited' | 'Full'; // Simplified IVENA status
    specialties: string[]; // e.g. "Stroke", "Trauma", "Herzkatheter"
}
