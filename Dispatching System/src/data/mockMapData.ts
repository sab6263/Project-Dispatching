export interface Location {
    lat: number;
    lng: number;
}

export type LatLngTuple = [number, number];

export interface MockRouting {
    duration: number;
    baseTime: number;
    trafficDelay: number;
    confidence: number;
}

export interface Station {
    id: string;
    name: string;
    type: 'Station';
    category: 'Fire' | 'EMS';
    position: LatLngTuple;
    address: string;
    mockRouting: MockRouting;
}

export interface Hospital {
    id: string;
    name: string;
    type: 'Hospital';
    position: LatLngTuple;
    bedsTotal: number;
    bedsAvailable: number;
    emergencyAvailable: boolean;
    traumaCenter: boolean;
    address: string;
    admissions?: number;
}

export interface TimelineEvent {
    time: string;
    event: string;
}

export interface Mission {
    keyword: string;
    description: string;
    timeline: TimelineEvent[];
}

export interface Vehicle {
    id: string;
    name: string;
    type: 'Vehicle';
    category: 'Fire' | 'EMS';
    subtype: string;
    stationId: string;
    position: LatLngTuple;
    status: 'Available' | 'Dispatched' | 'Returning' | 'In Transit';
    fuel: number;
    mission?: Mission;
}

export interface Incident {
    id: string;
    name: string;
    type: 'Incident';
    description: string;
    position: LatLngTuple;
    severity: 'High' | 'Medium' | 'Low';
    address: string;
    timeline: TimelineEvent[];
}

export const CENTER: LatLngTuple = [48.7667, 11.4226];

export const STATIONS: Station[] = [
    // --- Berufsfeuerwehr ---
    {
        id: 's1',
        name: 'Feuerwehr Ingolstadt (Hauptwache)',
        type: 'Station',
        category: 'Fire',
        position: [48.758, 11.433],
        address: 'Dreizehnerstraße 1, 85049 Ingolstadt',
        mockRouting: { duration: 4, baseTime: 3, trafficDelay: 1, confidence: 87 }
    },
    {
        id: 's2',
        name: 'Werkfeuerwehr AUDI AG',
        type: 'Station',
        category: 'Fire',
        position: [48.783, 11.414],
        address: '85057 Ingolstadt, Audi-Werksgelände',
        mockRouting: { duration: 6, baseTime: 5, trafficDelay: 1, confidence: 82 }
    },
    // --- Rettungswachen (BRK / Partner) ---
    {
        id: 's3',
        name: 'BRK Kreisverband Ingolstadt (RW Mitte)',
        type: 'Station',
        category: 'EMS',
        position: [48.766, 11.422],
        address: 'Auf der Schanz 30, 85049 Ingolstadt',
        mockRouting: { duration: 5, baseTime: 4, trafficDelay: 1, confidence: 89 }
    },
    {
        id: 's27',
        name: 'Rettungswache Ingolstadt Süd',
        type: 'Station',
        category: 'EMS',
        position: [48.729, 11.428],
        address: 'Hanslmairstraße 6, 85051 Ingolstadt',
        mockRouting: { duration: 8, baseTime: 7, trafficDelay: 1, confidence: 84 }
    },
    {
        id: 's45',
        name: 'BRK Rettungswache Klinikum',
        type: 'Station',
        category: 'EMS',
        position: [48.775, 11.402], // Levelingstraße/Klinikum
        address: 'Levelingstraße 21, 85049 Ingolstadt',
        mockRouting: { duration: 6, baseTime: 5, trafficDelay: 1, confidence: 85 }
    },
    {
        id: 's46',
        name: 'ADAC Luftrettung (Christoph 32)',
        type: 'Station',
        category: 'EMS',
        position: [48.7753, 11.4047], // Klinikum Helipad
        address: 'Am Klinikum',
        mockRouting: { duration: 3, baseTime: 2, trafficDelay: 1, confidence: 92 }
    },
    {
        id: 's47',
        name: 'BRK Katastrophenschutzzentrum',
        type: 'Station',
        category: 'EMS',
        position: [48.760, 11.450], // Generic centralized location for logistics
        address: 'Marie-Curie-Straße 18',
        mockRouting: { duration: 7, baseTime: 6, trafficDelay: 1, confidence: 83 }
    },
    {
        id: 's48',
        name: 'Kreis-Wasserwacht Ingolstadt',
        type: 'Station',
        category: 'EMS',
        position: [48.763, 11.418], // Baggersee/Donau area approx
        address: 'Am Auwaldsee',
        mockRouting: { duration: 6, baseTime: 5, trafficDelay: 1, confidence: 86 }
    },
    // --- Freiwillige Feuerwehren (Stadt und Stadtteile) ---
    { id: 's13', name: 'FF IN-Stadtmitte', type: 'Station', category: 'Fire', position: [48.765, 11.424], address: 'Innenstadt', mockRouting: { duration: 4, baseTime: 3, trafficDelay: 1, confidence: 88 } },
    { id: 's16', name: 'FF Ingolstadt-Friedrichshofen', type: 'Station', category: 'Fire', position: [48.780, 11.380], address: 'Friedrichshofen', mockRouting: { duration: 9, baseTime: 8, trafficDelay: 1, confidence: 81 } },
    { id: 's15', name: 'FF Ingolstadt-Ringsee / Kothau', type: 'Station', category: 'Fire', position: [48.750, 11.450], address: 'Ringsee', mockRouting: { duration: 7, baseTime: 6, trafficDelay: 1, confidence: 84 } },
    { id: 's14', name: 'FF Ingolstadt-Haunwöhr', type: 'Station', category: 'Fire', position: [48.745, 11.410], address: 'Haunwöhr', mockRouting: { duration: 8, baseTime: 7, trafficDelay: 1, confidence: 82 } },
    { id: 's17', name: 'FF Ingolstadt Mailing-Feldkirchen', type: 'Station', category: 'Fire', position: [48.770, 11.480], address: 'Mailing-Feldkirchen', mockRouting: { duration: 9, baseTime: 8, trafficDelay: 1, confidence: 80 } },
    { id: 's40', name: 'FF Ingolstadt-Hagau', type: 'Station', category: 'Fire', position: [48.720, 11.370], address: 'Hagau', mockRouting: { duration: 12, baseTime: 10, trafficDelay: 2, confidence: 76 } },
    { id: 's20', name: 'FF Ingolstadt-Gerolfing', type: 'Station', category: 'Fire', position: [48.770, 11.350], address: 'Gerolfing', mockRouting: { duration: 11, baseTime: 9, trafficDelay: 2, confidence: 78 } },
    { id: 's44', name: 'FF Haunstadt / Oberhaunstadt', type: 'Station', category: 'Fire', position: [48.790, 11.440], address: 'Oberhaunstadt', mockRouting: { duration: 8, baseTime: 7, trafficDelay: 1, confidence: 83 } },
    { id: 's18', name: 'FF Etting', type: 'Station', category: 'Fire', position: [48.800, 11.400], address: 'Etting', mockRouting: { duration: 10, baseTime: 8, trafficDelay: 2, confidence: 79 } },
    { id: 's19', name: 'FF Ingolstadt-Zuchering e.V.', type: 'Station', category: 'Fire', position: [48.710, 11.400], address: 'Zuchering', mockRouting: { duration: 13, baseTime: 11, trafficDelay: 2, confidence: 74 } },
    { id: 's37', name: 'FF Rothenturm-Niederfeld', type: 'Station', category: 'Fire', position: [48.730, 11.460], address: 'Rothenturm', mockRouting: { duration: 9, baseTime: 8, trafficDelay: 1, confidence: 81 } },
    { id: 's39', name: 'Feuerwehr Brunnenreuth', type: 'Station', category: 'Fire', position: [48.720, 11.410], address: 'Brunnenreuth', mockRouting: { duration: 11, baseTime: 10, trafficDelay: 1, confidence: 77 } },
    { id: 's36', name: 'FF IN-Hundszell', type: 'Station', category: 'Fire', position: [48.730, 11.390], address: 'Hundszell', mockRouting: { duration: 10, baseTime: 9, trafficDelay: 1, confidence: 78 } },
    { id: 's38', name: 'FF IN-Unsernherrn', type: 'Station', category: 'Fire', position: [48.730, 11.430], address: 'Unsernherrn', mockRouting: { duration: 9, baseTime: 8, trafficDelay: 1, confidence: 80 } },
    { id: 's41', name: 'FF IN-Dünzlau', type: 'Station', category: 'Fire', position: [48.780, 11.320], address: 'Dünzlau', mockRouting: { duration: 14, baseTime: 12, trafficDelay: 2, confidence: 73 } },
    { id: 's42', name: 'FF IN-Mühlhausen', type: 'Station', category: 'Fire', position: [48.790, 11.340], address: 'Mühlhausen', mockRouting: { duration: 13, baseTime: 11, trafficDelay: 2, confidence: 75 } },
    { id: 's43', name: 'FF IN-Pettenhofen', type: 'Station', category: 'Fire', position: [48.795, 11.330], address: 'Pettenhofen', mockRouting: { duration: 14, baseTime: 12, trafficDelay: 2, confidence: 72 } },
    // --- Umland / Nachbarorte ---
    { id: 's4', name: 'FF Gaimersheim', type: 'Station', category: 'Fire', position: [48.813, 11.370], address: 'Gaimersheim', mockRouting: { duration: 12, baseTime: 10, trafficDelay: 2, confidence: 77 } },
    { id: 's5', name: 'FF Manching', type: 'Station', category: 'Fire', position: [48.718, 11.493], address: 'Manching', mockRouting: { duration: 15, baseTime: 13, trafficDelay: 2, confidence: 71 } },
    { id: 's6', name: 'Rettungswache Kösching', type: 'Station', category: 'EMS', position: [48.810, 11.500], address: 'Köpferweg 1', mockRouting: { duration: 14, baseTime: 12, trafficDelay: 2, confidence: 74 } },
    { id: 's7', name: 'FF Eichstätt', type: 'Station', category: 'Fire', position: [48.891, 11.184], address: 'Eichstätt', mockRouting: { duration: 22, baseTime: 19, trafficDelay: 3, confidence: 65 } },
    { id: 's8', name: 'FF Geisenfeld', type: 'Station', category: 'Fire', position: [48.684, 11.611], address: 'Geisenfeld', mockRouting: { duration: 25, baseTime: 21, trafficDelay: 4, confidence: 62 } },
    { id: 's29', name: 'RW Geisenfeld', type: 'Station', category: 'EMS', position: [48.684, 11.611], address: 'Geisenfeld', mockRouting: { duration: 25, baseTime: 21, trafficDelay: 4, confidence: 62 } },
    { id: 's30', name: 'RW Eichstätt', type: 'Station', category: 'EMS', position: [48.891, 11.184], address: 'Eichstätt', mockRouting: { duration: 22, baseTime: 19, trafficDelay: 3, confidence: 65 } },
    { id: 's31', name: 'RW Neuburg', type: 'Station', category: 'EMS', position: [48.730, 11.180], address: 'Neuburg', mockRouting: { duration: 18, baseTime: 15, trafficDelay: 3, confidence: 68 } },
    { id: 's34', name: 'MHD Ingolstadt', type: 'Station', category: 'EMS', position: [48.780, 11.440], address: 'Malteser', mockRouting: { duration: 7, baseTime: 6, trafficDelay: 1, confidence: 84 } },
    { id: 's35', name: 'JUH Ingolstadt', type: 'Station', category: 'EMS', position: [48.750, 11.410], address: 'Johanniter', mockRouting: { duration: 8, baseTime: 7, trafficDelay: 1, confidence: 82 } },
    { id: 's9', name: 'FF Vohburg', type: 'Station', category: 'Fire', position: [48.769, 11.618], address: 'Vohburg', mockRouting: { duration: 24, baseTime: 20, trafficDelay: 4, confidence: 63 } },
    { id: 's10', name: 'FF Lenting', type: 'Station', category: 'Fire', position: [48.799, 11.459], address: 'Lenting', mockRouting: { duration: 9, baseTime: 8, trafficDelay: 1, confidence: 81 } },
    { id: 's12', name: 'FF Reichertshofen', type: 'Station', category: 'Fire', position: [48.658, 11.470], address: 'Reichertshofen', mockRouting: { duration: 20, baseTime: 17, trafficDelay: 3, confidence: 67 } },
    { id: 's21', name: 'FF Großmehring', type: 'Station', category: 'Fire', position: [48.760, 11.530], address: 'Großmehring', mockRouting: { duration: 16, baseTime: 14, trafficDelay: 2, confidence: 70 } },
    { id: 's22', name: 'FF Wettstetten', type: 'Station', category: 'Fire', position: [48.830, 11.410], address: 'Wettstetten', mockRouting: { duration: 11, baseTime: 9, trafficDelay: 2, confidence: 78 } },
    { id: 's23', name: 'FF Hepberg', type: 'Station', category: 'Fire', position: [48.820, 11.460], address: 'Hepberg', mockRouting: { duration: 10, baseTime: 9, trafficDelay: 1, confidence: 79 } }
];

export const HOSPITALS: Hospital[] = [
    {
        id: 'h1',
        name: 'Klinikum Ingolstadt GmbH',
        type: 'Hospital',
        position: [48.7753, 11.4047],
        bedsTotal: 1150,
        bedsAvailable: 154,
        emergencyAvailable: true,
        traumaCenter: true,
        address: 'Krumenauerstraße 25, 85049 Ingolstadt'
    },
    {
        id: 'h6',
        name: 'GOIN Bereitschaftspraxis',
        type: 'Hospital',
        position: [48.7753, 11.4047],
        bedsTotal: 10,
        bedsAvailable: 8,
        emergencyAvailable: false,
        traumaCenter: false,
        address: 'Krumenauerstraße 25 (am Klinikum)'
    },
    {
        id: 'h3',
        name: 'Klinik Dr. Maul - Notaufnahme',
        type: 'Hospital',
        position: [48.768, 11.423],
        bedsTotal: 80,
        bedsAvailable: 12,
        emergencyAvailable: true,
        traumaCenter: false,
        address: 'Am Nordbahnhof 15, 85049 Ingolstadt'
    },
    {
        id: 'h7',
        name: 'Medical Care Center Klinikum',
        type: 'Hospital',
        position: [48.776, 11.405],
        bedsTotal: 0,
        bedsAvailable: 0,
        emergencyAvailable: false,
        traumaCenter: false,
        address: 'MVZ am Klinikum'
    },
    {
        id: 'h2',
        name: 'Klinik Kösching',
        type: 'Hospital',
        position: [48.8085, 11.4988],
        bedsTotal: 180,
        bedsAvailable: 45,
        emergencyAvailable: true,
        traumaCenter: false,
        address: 'Krankenhausstraße 19, 85092 Kösching'
    },
    {
        id: 'h4',
        name: 'KJF Klinik St. Elisabeth (Neuburg)',
        type: 'Hospital',
        position: [48.7368, 11.1798],
        bedsTotal: 320,
        bedsAvailable: 68,
        emergencyAvailable: true,
        traumaCenter: true,
        address: 'Müller-Gnadenegg-Weg 4, 86633 Neuburg'
    },
    {
        id: 'h5',
        name: 'Danuvius Klinik',
        type: 'Hospital',
        position: [48.7635, 11.4245],
        bedsTotal: 120,
        bedsAvailable: 24,
        emergencyAvailable: false,
        traumaCenter: false,
        address: 'Preysingstraße 1-3, 85049 Ingolstadt'
    }
];

export const VEHICLES: Vehicle[] = [
    { id: 'v1', name: 'Florian Ingolstadt 1/10/1', type: 'Vehicle', category: 'Fire', subtype: 'KdoW', stationId: 's1', position: [48.762, 11.430], status: 'Dispatched', fuel: 95, mission: { keyword: 'Structure Fire with Person in Danger', description: 'Fire Alarm / Person in danger', timeline: [{ time: '22:52', event: 'Dispatched: Structure Fire with Person in Danger' }, { time: '22:57', event: 'Arrived at Scene' }, { time: '23:06', event: 'On Scene' }] } },
    { id: 'v2', name: 'Florian Ingolstadt 1/11/1', type: 'Vehicle', category: 'Fire', subtype: 'ELW 1', stationId: 's1', position: [48.758, 11.433], status: 'Available', fuel: 95 },
    { id: 'v3', name: 'Florian Ingolstadt 1/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's1', position: [48.762, 11.435], status: 'Dispatched', fuel: 85, mission: { keyword: 'Structure Fire with Person in Danger', description: 'Fire Alarm / Person in danger', timeline: [{ time: '22:52', event: 'Dispatched: Structure Fire with Person in Danger' }, { time: '22:57', event: 'Arrived at Scene' }, { time: '23:08', event: 'On Scene' }] } },
    { id: 'v4', name: 'Florian Ingolstadt 1/30/1', type: 'Vehicle', category: 'Fire', subtype: 'DLK 23/12', stationId: 's1', position: [48.758, 11.433], status: 'Available', fuel: 88 },
    { id: 'v5', name: 'Florian Ingolstadt 1/40/2', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's1', position: [48.758, 11.433], status: 'Available', fuel: 100 },
    { id: 'v6', name: 'Florian Ingolstadt 1/65/1', type: 'Vehicle', category: 'Fire', subtype: 'KlaF', stationId: 's1', position: [48.758, 11.433], status: 'Available', fuel: 94 },
    { id: 'v7', name: 'Florian Ingolstadt 1/61/1', type: 'Vehicle', category: 'Fire', subtype: 'RW', stationId: 's1', position: [48.758, 11.433], status: 'Available', fuel: 90 },
    { id: 'v8', name: 'Florian Ingolstadt 1/36/1', type: 'Vehicle', category: 'Fire', subtype: 'WLF', stationId: 's1', position: [48.758, 11.433], status: 'Available', fuel: 85 },
    { id: 'v_audi1', name: 'Florian Audi 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's2', position: [48.785, 11.416], status: 'Dispatched', fuel: 95, mission: { keyword: 'Industrial Fire with Hazmat', description: 'Factory fire', timeline: [{ time: '22:38', event: 'Dispatched: Industrial Fire with Hazmat' }, { time: '22:44', event: 'Arrived at Scene' }, { time: '22:58', event: 'On Scene' }] } },
    { id: 'v_audi2', name: 'Florian Audi 30/1', type: 'Vehicle', category: 'Fire', subtype: 'DLK 23/12', stationId: 's2', position: [48.783, 11.414], status: 'Available', fuel: 95 },
    { id: 'v_audi3', name: 'Florian Audi 29/1', type: 'Vehicle', category: 'Fire', subtype: 'ULF', stationId: 's2', position: [48.783, 11.414], status: 'Available', fuel: 90 },
    { id: 'e_m1', name: 'RK Ingolstadt 71/1', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's3', position: [48.775, 11.425], status: 'Dispatched', fuel: 100, mission: { keyword: 'Cardiac Arrest', description: 'Cardiac arrest', timeline: [{ time: '23:02', event: 'Dispatched: Cardiac Arrest' }, { time: '23:08', event: 'Arrived at Scene' }, { time: '23:15', event: 'On Scene' }] } },
    { id: 'e_m2', name: 'RK Ingolstadt 71/2', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's3', position: [48.760, 11.420], status: 'Returning', fuel: 95, mission: { keyword: 'Abdominal Pain', description: 'Patient transport', timeline: [{ time: '21:15', event: 'Dispatched: Abdominal Pain' }, { time: '21:22', event: 'Arrived at Scene' }, { time: '21:45', event: 'Transporting to Hospital' }, { time: '22:15', event: 'Arrived at Hospital' }] } },
    { id: 'e14', name: 'RK Geisenfeld 71/1', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's29', position: [48.686, 11.613], status: 'Dispatched', fuel: 89, mission: { keyword: 'Respiratory Distress', description: 'Breathing difficulty', timeline: [{ time: '22:55', event: 'Dispatched: Respiratory Distress' }, { time: '23:01', event: 'Arrived at Scene' }] } },
    { id: 'e_m4', name: 'RK Ingolstadt 71/4', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's3', position: [48.769, 11.425], status: 'Dispatched', fuel: 90, mission: { keyword: 'Stroke Alert', description: 'Possible stroke', timeline: [{ time: '23:10', event: 'Dispatched: Stroke Alert' }, { time: '23:15', event: 'Arrived at Scene' }] } },
    { id: 'e15', name: 'RK Neuburg 71/1', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's31', position: [48.732, 11.182], status: 'Dispatched', fuel: 92, mission: { keyword: 'Unconscious Person', description: 'Person unconscious', timeline: [{ time: '23:05', event: 'Dispatched: Unconscious Person' }, { time: '23:12', event: 'Arrived at Scene' }] } },
    { id: 'e_m6', name: 'RK Ingolstadt 76/1', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's3', position: [48.766, 11.422], status: 'Available', fuel: 100 },
    { id: 'e_s1', name: 'RK Ingolstadt 71/5', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's27', position: [48.725, 11.432], status: 'Dispatched', fuel: 88, mission: { keyword: 'Fall with Injury', description: 'Fall victim', timeline: [{ time: '22:48', event: 'Dispatched: Fall with Injury' }, { time: '22:54', event: 'Arrived at Scene' }, { time: '23:05', event: 'En Route to Hospital' }] } },
    { id: 'e_s2', name: 'RK Ingolstadt 76/2', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's27', position: [48.729, 11.428], status: 'Available', fuel: 95 },
    { id: 'e_k1', name: 'RK Ingolstadt 71/10', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's45', position: [48.775, 11.408], status: 'Returning', fuel: 85, mission: { keyword: 'Interfacility Transport', description: 'Transfer to specialist clinic', timeline: [{ time: '20:00', event: 'Dispatched: Interfacility Transport' }, { time: '20:15', event: 'Patient Pickup' }, { time: '21:30', event: 'Patient Dropoff' }] } },
    { id: 'e_k2', name: 'RK Ingolstadt 76/3', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's45', position: [48.775, 11.402], status: 'Available', fuel: 95 },
    { id: 'a1', name: 'Christoph 32', type: 'Vehicle', category: 'EMS', subtype: 'RTH', stationId: 's46', position: [48.7700, 11.4100], status: 'Dispatched', fuel: 80, mission: { keyword: 'Mass Casualty Incident', description: 'Multi-vehicle accident', timeline: [{ time: '23:00', event: 'Dispatched: Mass Casualty Incident' }, { time: '23:03', event: 'Airborne' }, { time: '23:12', event: 'Arrived at Scene' }] } },
    { id: 'w1', name: 'Wasserwacht Ingolstadt 91/1', type: 'Vehicle', category: 'EMS', subtype: 'GW-Wasser', stationId: 's48', position: [48.763, 11.418], status: 'Available', fuel: 90 },
    { id: 'k1', name: 'Rotkreuz Ingolstadt 54/1', type: 'Vehicle', category: 'EMS', subtype: 'GW-San', stationId: 's47', position: [48.760, 11.450], status: 'Available', fuel: 100 },
    { id: 'e_mh1', name: 'Johannes Ingolstadt 71/1', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's34', position: [48.780, 11.440], status: 'Available', fuel: 93 },
    { id: 'e_mh2', name: 'Johannes Ingolstadt 71/2', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's34', position: [48.780, 11.440], status: 'Available', fuel: 88 },
    { id: 'e_mh3', name: 'Johannes Ingolstadt 76/1', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's34', position: [48.780, 11.440], status: 'Available', fuel: 95 },
    { id: 'e8', name: 'Akkon Ingolstadt 72/1', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's35', position: [48.752, 11.412], status: 'Returning', fuel: 85, mission: { keyword: 'Dialysis Transport', description: 'Routine transport', timeline: [{ time: '16:00', event: 'Dispatched: Dialysis Transport' }, { time: '16:30', event: 'Transport Complete' }] } },
    { id: 'e8b', name: 'Akkon Ingolstadt 72/2', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's35', position: [48.752, 11.412], status: 'Available', fuel: 90 },
    { id: 'e8c', name: 'Akkon Ingolstadt 72/3', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's35', position: [48.752, 11.412], status: 'Available', fuel: 87 },
    { id: 'v9', name: 'Florian Ingolstadt 2/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's13', position: [48.765, 11.424], status: 'Available', fuel: 96 },
    { id: 'v10', name: 'Florian Ingolstadt 2/30/1', type: 'Vehicle', category: 'Fire', subtype: 'DLK 23/12', stationId: 's13', position: [48.765, 11.424], status: 'Available', fuel: 92 },
    { id: 'v11', name: 'Florian Ingolstadt 2/21/1', type: 'Vehicle', category: 'Fire', subtype: 'TLF 4000', stationId: 's13', position: [48.765, 11.424], status: 'Available', fuel: 98 },
    { id: 'v12', name: 'Florian Ingolstadt 3/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's14', position: [48.745, 11.410], status: 'Available', fuel: 94 },
    { id: 'v13', name: 'Florian Ingolstadt 3/11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's14', position: [48.745, 11.410], status: 'Available', fuel: 90 },
    { id: 'v13b', name: 'Florian Ingolstadt 3/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's14', position: [48.745, 11.410], status: 'Available', fuel: 92 },
    { id: 'v14', name: 'Florian Ingolstadt 4/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's15', position: [48.752, 11.452], status: 'Dispatched', fuel: 97, mission: { keyword: 'Vehicle Accident with Entrapment', description: 'Traffic accident with trapped person', timeline: [{ time: '22:45', event: 'Dispatched: Vehicle Accident with Entrapment' }, { time: '22:51', event: 'Arrived at Scene' }, { time: '23:02', event: 'On Scene' }] } },
    { id: 'v15', name: 'Florian Ingolstadt 4/48/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 20 KatS', stationId: 's15', position: [48.750, 11.450], status: 'Available', fuel: 85 },
    { id: 'v15b', name: 'Florian Ingolstadt 4/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's15', position: [48.750, 11.450], status: 'Available', fuel: 90 },
    { id: 'v16', name: 'Florian Ingolstadt 5/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's16', position: [48.782, 11.382], status: 'Dispatched', fuel: 95, mission: { keyword: 'Building Fire', description: 'Apartment fire', timeline: [{ time: '22:50', event: 'Dispatched: Building Fire' }, { time: '22:56', event: 'Arrived at Scene' }] } },
    { id: 'v17', name: 'Florian Ingolstadt 5/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's16', position: [48.780, 11.380], status: 'Available', fuel: 98 },
    { id: 'v17b', name: 'Florian Ingolstadt 5/43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's16', position: [48.780, 11.380], status: 'Available', fuel: 89 },
    { id: 'v18', name: 'Florian Ingolstadt 6/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's17', position: [48.770, 11.480], status: 'Available', fuel: 93 },
    { id: 'v19', name: 'Florian Ingolstadt 6/56/1', type: 'Vehicle', category: 'Fire', subtype: 'GW-L2', stationId: 's17', position: [48.770, 11.480], status: 'Available', fuel: 90 },
    { id: 'v19b', name: 'Florian Ingolstadt 6/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's17', position: [48.770, 11.480], status: 'Available', fuel: 87 },
    { id: 'v20', name: 'Florian Ingolstadt 7/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's18', position: [48.802, 11.402], status: 'Dispatched', fuel: 96, mission: { keyword: 'Brush Fire', description: 'Vegetation fire', timeline: [{ time: '22:42', event: 'Dispatched: Brush Fire' }, { time: '22:49', event: 'Arrived at Scene' }, { time: '22:58', event: 'On Scene' }] } },
    { id: 'v21', name: 'Florian Ingolstadt 7/11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's18', position: [48.800, 11.400], status: 'Available', fuel: 92 },
    { id: 'v21b', name: 'Florian Ingolstadt 7/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's18', position: [48.800, 11.400], status: 'Available', fuel: 88 },
    { id: 'v22', name: 'Florian Ingolstadt 8/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's19', position: [48.712, 11.402], status: 'Dispatched', fuel: 95, mission: { keyword: 'Gas Leak', description: 'Natural gas emergency', timeline: [{ time: '23:01', event: 'Dispatched: Gas Leak' }, { time: '23:07', event: 'Arrived at Scene' }] } },
    { id: 'v23', name: 'Florian Ingolstadt 8/11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's19', position: [48.710, 11.400], status: 'Available', fuel: 75 },
    { id: 'v23b', name: 'Florian Ingolstadt 8/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's19', position: [48.710, 11.400], status: 'Available', fuel: 85 },
    { id: 'v24', name: 'Florian Ingolstadt 9/40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's20', position: [48.770, 11.350], status: 'Available', fuel: 91 },
    { id: 'v25', name: 'Florian Ingolstadt 9/43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's20', position: [48.770, 11.350], status: 'Available', fuel: 88 },
    { id: 'v25b', name: 'Florian Ingolstadt 9/14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's20', position: [48.770, 11.350], status: 'Available', fuel: 90 },
    { id: 'v26', name: 'Florian Großmehring 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's21', position: [48.762, 11.532], status: 'Dispatched', fuel: 94, mission: { keyword: 'Smoke Investigation', description: 'Smoke reported', timeline: [{ time: '22:58', event: 'Dispatched: Smoke Investigation' }, { time: '23:05', event: 'Arrived at Scene' }] } },
    { id: 'v27', name: 'Florian Großmehring 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's21', position: [48.760, 11.530], status: 'Available', fuel: 85 },
    { id: 'v28', name: 'Florian Wettstetten 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's22', position: [48.828, 11.408], status: 'Returning', fuel: 90, mission: { keyword: 'Burnt Food', description: 'Cooking mishap', timeline: [{ time: '22:30', event: 'Dispatched: Burnt Food' }, { time: '22:38', event: 'Arrived at Scene' }, { time: '22:50', event: 'Cleared Scene' }] } },
    { id: 'v29', name: 'Florian Wettstetten 21/1', type: 'Vehicle', category: 'Fire', subtype: 'TLF 16/25', stationId: 's22', position: [48.830, 11.410], status: 'Available', fuel: 90 },
    { id: 'v30', name: 'Florian Gaimersheim 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's4', position: [48.810, 11.375], status: 'Dispatched', fuel: 90, mission: { keyword: 'Electrical Fire', description: 'Electrical hazard', timeline: [{ time: '22:53', event: 'Dispatched: Electrical Fire' }, { time: '22:59', event: 'Arrived at Scene' }] } },
    { id: 'v31', name: 'Florian Gaimersheim 30/1', type: 'Vehicle', category: 'Fire', subtype: 'DLK 23/12', stationId: 's4', position: [48.813, 11.370], status: 'Available', fuel: 91 },
    { id: 'v32', name: 'Florian Manching 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's5', position: [48.720, 11.495], status: 'Dispatched', fuel: 89, mission: { keyword: 'Vehicle Fire', description: 'Car on fire', timeline: [{ time: '22:46', event: 'Dispatched: Vehicle Fire' }, { time: '22:52', event: 'Arrived at Scene' }, { time: '23:00', event: 'On Scene' }] } },
    { id: 'v33', name: 'Florian Manching 61/1', type: 'Vehicle', category: 'Fire', subtype: 'RW', stationId: 's5', position: [48.718, 11.493], status: 'Available', fuel: 94 },
    // Added to meet minimum 3 per station
    { id: 'e_s3', name: 'RK Ingolstadt 71/6', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's27', position: [48.729, 11.428], status: 'Available', fuel: 92 },
    { id: 'e_k3', name: 'RK Ingolstadt 71/20', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's45', position: [48.775, 11.402], status: 'Available', fuel: 90 },
    { id: 'a2', name: 'Christoph 32 (Reserve)', type: 'Vehicle', category: 'EMS', subtype: 'RTH', stationId: 's46', position: [48.7752, 11.4045], status: 'Available', fuel: 100 },
    { id: 'a3', name: 'Kater Ingolstadt 14/1', type: 'Vehicle', category: 'EMS', subtype: 'ELW', stationId: 's46', position: [48.7753, 11.4047], status: 'Available', fuel: 95 },
    { id: 'k2', name: 'Rotkreuz Ingolstadt 54/2', type: 'Vehicle', category: 'EMS', subtype: 'GW-Tech', stationId: 's47', position: [48.760, 11.450], status: 'Available', fuel: 95 },
    { id: 'k3', name: 'Rotkreuz Ingolstadt 14/1', type: 'Vehicle', category: 'EMS', subtype: 'MTW', stationId: 's47', position: [48.760, 11.450], status: 'Available', fuel: 98 },
    { id: 'w2', name: 'Wasserwacht Ingolstadt 99/1', type: 'Vehicle', category: 'EMS', subtype: 'Boot', stationId: 's48', position: [48.763, 11.418], status: 'Available', fuel: 100 },
    { id: 'w3', name: 'Wasserwacht Ingolstadt 14/1', type: 'Vehicle', category: 'EMS', subtype: 'MTW', stationId: 's48', position: [48.763, 11.418], status: 'Available', fuel: 92 },
    { id: 'v_hag1', name: 'Florian Hagau 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's40', position: [48.720, 11.370], status: 'Available', fuel: 90 },
    { id: 'v_hag2', name: 'Florian Hagau 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's40', position: [48.720, 11.370], status: 'Available', fuel: 95 },
    { id: 'v_hag3', name: 'Florian Hagau 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's40', position: [48.720, 11.370], status: 'Available', fuel: 92 },
    { id: 'v_haun1', name: 'Florian Haunstadt 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's44', position: [48.790, 11.440], status: 'Available', fuel: 91 },
    { id: 'v_haun2', name: 'Florian Haunstadt 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's44', position: [48.790, 11.440], status: 'Available', fuel: 96 },
    { id: 'v_haun3', name: 'Florian Haunstadt 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's44', position: [48.790, 11.440], status: 'Available', fuel: 89 },
    { id: 'v_rot1', name: 'Florian Rothenturm 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's37', position: [48.730, 11.460], status: 'Available', fuel: 88 },
    { id: 'v_rot2', name: 'Florian Rothenturm 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's37', position: [48.730, 11.460], status: 'Available', fuel: 94 },
    { id: 'v_rot3', name: 'Florian Rothenturm 55/1', type: 'Vehicle', category: 'Fire', subtype: 'GW-L1', stationId: 's37', position: [48.730, 11.460], status: 'Available', fuel: 90 },
    { id: 'v_brun1', name: 'Florian Brunnenreuth 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's39', position: [48.720, 11.410], status: 'Available', fuel: 92 },
    { id: 'v_brun2', name: 'Florian Brunnenreuth 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's39', position: [48.720, 11.410], status: 'Available', fuel: 95 },
    { id: 'v_brun3', name: 'Florian Brunnenreuth 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's39', position: [48.720, 11.410], status: 'Available', fuel: 90 },
    { id: 'v_hund1', name: 'Florian Hundszell 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's36', position: [48.730, 11.390], status: 'Available', fuel: 89 },
    { id: 'v_hund2', name: 'Florian Hundszell 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's36', position: [48.730, 11.390], status: 'Available', fuel: 96 },
    { id: 'v_hund3', name: 'Florian Hundszell 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's36', position: [48.730, 11.390], status: 'Available', fuel: 92 },
    { id: 'v_unser1', name: 'Florian Unsernherrn 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's38', position: [48.730, 11.430], status: 'Available', fuel: 91 },
    { id: 'v_unser2', name: 'Florian Unsernherrn 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's38', position: [48.730, 11.430], status: 'Available', fuel: 97 },
    { id: 'v_unser3', name: 'Florian Unsernherrn 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's38', position: [48.730, 11.430], status: 'Available', fuel: 93 },
    { id: 'v_dun1', name: 'Florian Dünzlau 44/1', type: 'Vehicle', category: 'Fire', subtype: 'TSF-W', stationId: 's41', position: [48.780, 11.320], status: 'Available', fuel: 85 },
    { id: 'v_dun2', name: 'Florian Dünzlau 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's41', position: [48.780, 11.320], status: 'Available', fuel: 92 },
    { id: 'v_dun3', name: 'Florian Dünzlau 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's41', position: [48.780, 11.320], status: 'Available', fuel: 90 },
    { id: 'v_muhl1', name: 'Florian Mühlhausen 44/1', type: 'Vehicle', category: 'Fire', subtype: 'TSF-W', stationId: 's42', position: [48.790, 11.340], status: 'Available', fuel: 88 },
    { id: 'v_muhl2', name: 'Florian Mühlhausen 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's42', position: [48.790, 11.340], status: 'Available', fuel: 94 },
    { id: 'v_muhl3', name: 'Florian Mühlhausen 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's42', position: [48.790, 11.340], status: 'Available', fuel: 91 },
    { id: 'v_pett1', name: 'Florian Pettenhofen 44/1', type: 'Vehicle', category: 'Fire', subtype: 'TSF-W', stationId: 's43', position: [48.795, 11.330], status: 'Available', fuel: 86 },
    { id: 'v_pett2', name: 'Florian Pettenhofen 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's43', position: [48.795, 11.330], status: 'Available', fuel: 93 },
    { id: 'v_pett3', name: 'Florian Pettenhofen 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's43', position: [48.795, 11.330], status: 'Available', fuel: 89 },
    { id: 'v_gaim3', name: 'Florian Gaimersheim 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's4', position: [48.813, 11.370], status: 'Available', fuel: 95 },
    { id: 'v_manch3', name: 'Florian Manching 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's5', position: [48.718, 11.493], status: 'Available', fuel: 96 },
    { id: 'e_kos1', name: 'Rotkreuz Kösching 71/1', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's6', position: [48.810, 11.500], status: 'Available', fuel: 92 },
    { id: 'e_kos2', name: 'Rotkreuz Kösching 76/1', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's6', position: [48.810, 11.500], status: 'Available', fuel: 98 },
    { id: 'e_kos3', name: 'Rotkreuz Kösching 72/1', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's6', position: [48.810, 11.500], status: 'Available', fuel: 90 },
    { id: 'v_ei1', name: 'Florian Eichstätt 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's7', position: [48.891, 11.184], status: 'Available', fuel: 93 },
    { id: 'v_ei2', name: 'Florian Eichstätt 30/1', type: 'Vehicle', category: 'Fire', subtype: 'DLK 23/12', stationId: 's7', position: [48.891, 11.184], status: 'Available', fuel: 95 },
    { id: 'v_ei3', name: 'Florian Eichstätt 21/1', type: 'Vehicle', category: 'Fire', subtype: 'TLF 4000', stationId: 's7', position: [48.891, 11.184], status: 'Available', fuel: 91 },
    { id: 'v_geis1', name: 'Florian Geisenfeld 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's8', position: [48.684, 11.611], status: 'Available', fuel: 94 },
    { id: 'v_geis2', name: 'Florian Geisenfeld 30/1', type: 'Vehicle', category: 'Fire', subtype: 'DLK 23/12', stationId: 's8', position: [48.684, 11.611], status: 'Available', fuel: 96 },
    { id: 'v_geis3', name: 'Florian Geisenfeld 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's8', position: [48.684, 11.611], status: 'Available', fuel: 90 },
    { id: 'e_geis2', name: 'Rotkreuz Geisenfeld 76/1', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's29', position: [48.684, 11.611], status: 'Available', fuel: 95 },
    { id: 'e_geis3', name: 'Rotkreuz Geisenfeld 72/1', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's29', position: [48.684, 11.611], status: 'Available', fuel: 91 },
    { id: 'e_ei1', name: 'Rotkreuz Eichstätt 71/1', type: 'Vehicle', category: 'EMS', subtype: 'RTW', stationId: 's30', position: [48.891, 11.184], status: 'Available', fuel: 93 },
    { id: 'e_ei2', name: 'Rotkreuz Eichstätt 76/1', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's30', position: [48.891, 11.184], status: 'Available', fuel: 97 },
    { id: 'e_ei3', name: 'Rotkreuz Eichstätt 72/1', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's30', position: [48.891, 11.184], status: 'Available', fuel: 89 },
    { id: 'e_neu2', name: 'Rotkreuz Neuburg 76/1', type: 'Vehicle', category: 'EMS', subtype: 'NEF', stationId: 's31', position: [48.730, 11.180], status: 'Available', fuel: 96 },
    { id: 'e_neu3', name: 'Rotkreuz Neuburg 72/1', type: 'Vehicle', category: 'EMS', subtype: 'KTW', stationId: 's31', position: [48.730, 11.180], status: 'Available', fuel: 92 },
    { id: 'v_voh1', name: 'Florian Vohburg 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's9', position: [48.769, 11.618], status: 'Available', fuel: 93 },
    { id: 'v_voh2', name: 'Florian Vohburg 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's9', position: [48.769, 11.618], status: 'Available', fuel: 96 },
    { id: 'v_voh3', name: 'Florian Vohburg 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's9', position: [48.769, 11.618], status: 'Available', fuel: 91 },
    { id: 'v_len1', name: 'Florian Lenting 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's10', position: [48.799, 11.459], status: 'Available', fuel: 92 },
    { id: 'v_len2', name: 'Florian Lenting 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's10', position: [48.799, 11.459], status: 'Available', fuel: 95 },
    { id: 'v_len3', name: 'Florian Lenting 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's10', position: [48.799, 11.459], status: 'Available', fuel: 93 },
    { id: 'v_reich1', name: 'Florian Reichertshofen 40/1', type: 'Vehicle', category: 'Fire', subtype: 'HLF 20', stationId: 's12', position: [48.658, 11.470], status: 'Available', fuel: 94 },
    { id: 'v_reich2', name: 'Florian Reichertshofen 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's12', position: [48.658, 11.470], status: 'Available', fuel: 96 },
    { id: 'v_reich3', name: 'Florian Reichertshofen 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's12', position: [48.658, 11.470], status: 'Available', fuel: 92 },
    { id: 'v_gross3', name: 'Florian Großmehring 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's21', position: [48.760, 11.530], status: 'Available', fuel: 97 },
    { id: 'v_wett3', name: 'Florian Wettstetten 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's22', position: [48.830, 11.410], status: 'Available', fuel: 95 },
    { id: 'v_hep1', name: 'Florian Hepberg 43/1', type: 'Vehicle', category: 'Fire', subtype: 'LF 10', stationId: 's23', position: [48.820, 11.460], status: 'Available', fuel: 93 },
    { id: 'v_hep2', name: 'Florian Hepberg 14/1', type: 'Vehicle', category: 'Fire', subtype: 'MTW', stationId: 's23', position: [48.820, 11.460], status: 'Available', fuel: 96 },
    { id: 'v_hep3', name: 'Florian Hepberg 11/1', type: 'Vehicle', category: 'Fire', subtype: 'MZF', stationId: 's23', position: [48.820, 11.460], status: 'Available', fuel: 92 }
];

export const INCIDENTS: Incident[] = [
    {
        id: 'i1',
        name: 'Structure Fire',
        type: 'Incident',
        description: 'Building Fire with potential victims',
        position: [48.770, 11.425],
        severity: 'High',
        address: 'Paradeplatz 4',
        timeline: [
            { time: '14:45', event: 'Call Received' },
            { time: '14:46', event: 'Dispatch Alerted' }
        ]
    }
];
