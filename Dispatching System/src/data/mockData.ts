import type { Incident, Unit } from '../types';

const generateUnits = (count: number): Unit[] => {
    const units: Unit[] = [];
    const types: Unit['type'][] = ['RTW', 'NEF', 'KTW', 'HLF', 'DLK', 'ELW'];
    const statuses: Unit['status'][] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    const capabilities = ['Fire', 'Tech', 'HazMat', 'HighRescue', 'WaterRescue', 'ALS', 'Doctor'];

    for (let i = 1; i <= count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Random Lat/Lng around Munich (approx 48.137, 11.575)
        const lat = 48.137 + (Math.random() - 0.5) * 0.1;
        const lng = 11.575 + (Math.random() - 0.5) * 0.1;

        units.push({
            id: `UNIT-${String(i).padStart(3, '0')}`,
            callSign: `Florian München ${Math.floor(Math.random() * 10) + 1}/${Math.floor(Math.random() * 50) + 10}-${Math.floor(Math.random() * 5) + 1}`,
            type,
            status,
            location: { lat, lng },
            capabilities: capabilities.filter(() => Math.random() > 0.7), // Random capabilities
            statusLastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()
        });
    }
    return units;
};

export const MOCK_UNITS: Unit[] = generateUnits(80);

export const MOCK_INCIDENTS: Incident[] = [
    {
        id: 'INC-2025-001',
        keyword: 'Room Fire',
        code: 'B3',
        type: 'B3 - Structure Fire',
        category: 'Fire',
        location: {
            address: '45 Leopold Street, 80802 Munich',
            lat: 48.155,
            lng: 11.585,
        },
        priority: '1',
        status: 'Dispatching',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        description: 'Smoke from window on 3rd floor, persons reported in danger.',
        assignedUnits: [],
    },
    {
        id: 'INC-2025-002',
        keyword: 'CPR / Cardiac',
        code: 'R2',
        type: 'R2 - Resuscitation',
        category: 'Rescue',
        location: {
            address: '1 Marienplatz, 80331 Munich',
            lat: 48.137,
            lng: 11.575,
        },
        priority: '1',
        status: 'Active',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        assignedUnits: ['UNIT-003'],
    },
    // Add a few more incidents...
    {
        id: 'INC-2025-003',
        keyword: 'MVA Trapped',
        code: 'THL3',
        type: 'THL 3 - MVA Persons Trapped',
        category: 'Tech',
        location: {
            address: 'Mittlerer Ring / Donnersbergerbrücke',
            lat: 48.142,
            lng: 11.535,
        },
        priority: '1',
        status: 'Active',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        assignedUnits: [],
    },
    {
        id: 'INC-2025-004',
        keyword: 'Helpless Person',
        code: 'R1',
        type: 'R1 - Medical',
        category: 'Rescue',
        location: {
            address: 'Munich Central Station',
            lat: 48.140,
            lng: 11.560,
        },
        priority: '2',
        status: 'Open',
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        assignedUnits: [],
    },
    {
        id: 'INC-2025-005',
        keyword: 'BMA Alarm',
        code: 'BMA',
        type: 'BMA - Commercial Fire Alarm',
        category: 'Fire',
        location: {
            address: 'Messe München',
            lat: 48.135,
            lng: 11.698,
        },
        priority: '3',
        status: 'Open',
        createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        assignedUnits: [],
    }
];

export const MOCK_HOSPITALS: import('../types').Hospital[] = [
    {
        id: 'HOSP-001',
        name: 'Grosshadern Hospital',
        address: '15 Marchioninistraße',
        distance: 5.2,
        status: 'Available',
        specialties: ['Level 1 Trauma', 'Stroke', 'Cath Lab', 'Neuro']
    },
    {
        id: 'HOSP-002',
        name: 'Schwabing Hospital',
        address: '1 Koerner Plaza',
        distance: 3.8,
        status: 'Limited',
        specialties: ['Pediatrics', 'Trauma', 'Burn Center']
    },
    {
        id: 'HOSP-003',
        name: 'Rechts der Isar',
        address: '22 Ismaninger Str.',
        distance: 2.1,
        status: 'Full',
        specialties: ['Maximalversorger', 'Trauma', 'Stroke', 'Herzkatheter']
    },
    {
        id: 'HOSP-004',
        name: 'Bogenhausen Hospital',
        address: '77 Englschalkinger Str.',
        distance: 6.5,
        status: 'Available',
        specialties: ['Trauma', 'Urology', 'Neuro']
    },
    {
        id: 'HOSP-005',
        name: 'Third Order Hospital',
        address: '44 Menzinger Str.',
        distance: 8.1,
        status: 'Available',
        specialties: ['Pediatrics', 'Obstetrics']
    },
];
