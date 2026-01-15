// ... imports
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useCAD } from '../../context/CADContext';
import L from 'leaflet';
import { cn } from '../../lib/utils';
// ... Leaflet icons setup (same as before)
// Fix Leaflet generic marker issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const getIncidentIcon = (category: string, isActive: boolean) => {
    let svgContent = '';
    let colorClass = isActive ? 'bg-red-600 animate-pulse' : 'bg-gray-500'; // Active is red/pulsing

    // ... logic for svgContent based on category (same as before but simplified or reused)
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('feuer') || lowerCat.includes('brand')) {
        colorClass = isActive ? 'bg-orange-600 animate-pulse' : 'bg-orange-800';
        svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3a9 9 0 0 1 3 3.3Z"/></svg>`;
    } else if (lowerCat.includes('rettung') || lowerCat.includes('notfall')) {
        colorClass = isActive ? 'bg-red-600 animate-pulse' : 'bg-red-900';
        svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    } else {
        colorClass = isActive ? 'bg-blue-600 animate-pulse' : 'bg-blue-900';
        svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }

    return new L.DivIcon({
        className: 'custom-icon',
        html: `<div class="${colorClass} w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 relative z-10 box-content">${svgContent}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

const getUnitIcon = (status: string, isAssignedToActive: boolean) => {
    const isAvailable = status === 'S1' || status === 'S2';
    const color = isAvailable ? '#22c55e' : '#3b82f6';

    // Pulse effect if assigned to active
    const pulseStyle = isAssignedToActive ? 'box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); animation: pulse 2s infinite;' : 'box-shadow: 0 0 5px rgba(0,0,0,0.3);';

    return new L.DivIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; ${pulseStyle}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });
};

// Mock Route Data (Traffic XAI) - unchanged
const getMockRoute = (start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
    const mid1 = { lat: start.lat + (end.lat - start.lat) * 0.33, lng: start.lng + (end.lng - start.lng) * 0.33 };
    const mid2 = { lat: start.lat + (end.lat - start.lat) * 0.66, lng: start.lng + (end.lng - start.lng) * 0.66 };
    return [
        { positions: [[start.lat, start.lng], [mid1.lat, mid1.lng]], color: '#22c55e' },
        { positions: [[mid1.lat, mid1.lng], [mid2.lat, mid2.lng]], color: '#ef4444' },
        { positions: [[mid2.lat, mid2.lng], [end.lat, end.lng]], color: '#22c55e' }
    ];
};

const MapClickHandler = () => {
    const { setSelectedUnitId } = useCAD();
    useMapEvents({
        click: () => setSelectedUnitId(null),
    });
    return null;
};

export const OperationalMap: React.FC = () => {
    const { incidents, units, selectedUnitId, setSelectedUnitId } = useCAD();

    // Identify active incident (mock: first one with status 'Open' or 'Dispatching')
    const activeIncident = incidents.find(i => i.status === 'Open' || i.status === 'Dispatching');

    // Find selected unit data
    const selectedUnit = units.find(u => u.id === selectedUnitId);
    let routeSegments: any[] = [];

    if (selectedUnit && selectedUnit.status === 'S3') {
        const target = activeIncident?.location || { lat: 48.137, lng: 11.575 };
        routeSegments = getMockRoute(selectedUnit.location, target);
    }

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-border bg-surface relative z-0">
            {/* Removed Coverage Button */}

            <MapContainer
                center={[48.137, 11.575]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                scrollWheelZoom={true}
            >
                <MapClickHandler />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Route Rendering */}
                {selectedUnitId && routeSegments.map((seg, i) => (
                    <Polyline
                        key={i}
                        positions={seg.positions as [number, number][]}
                        pathOptions={{ color: seg.color, weight: 4, opacity: 0.8, dashArray: seg.color === '#ef4444' ? '5, 10' : undefined }}
                    >
                        {seg.color === '#ef4444' && <Tooltip sticky>Verkehrsbehinderung (+4min)</Tooltip>}
                    </Polyline>
                ))}

                {/* Incidents */}
                {incidents.filter(i => i.status !== 'Closed').map(inc => {
                    const isActive = inc.id === activeIncident?.id;
                    return (
                        <Marker
                            key={inc.id}
                            position={[inc.location.lat, inc.location.lng]}
                            icon={getIncidentIcon(inc.category, isActive)}
                            zIndexOffset={isActive ? 1000 : 0}
                        >
                            <Popup className="custom-popup">
                                <div className="font-sans text-stone-900 min-w-[200px]">
                                    <div className="font-bold border-b border-gray-200 pb-1 mb-1">{inc.code || inc.type}</div>
                                    <div className="text-xs text-gray-600 mb-2">{inc.location.address}</div>
                                    <div className="flex justify-between items-center">
                                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded text-white", inc.priority === '1' ? "bg-red-500" : "bg-blue-500")}>Prio {inc.priority}</span>
                                        <span className="text-xs font-semibold">{inc.status}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Units */}
                {units.map(unit => {
                    const isAssigned = activeIncident?.assignedUnits?.includes(unit.id) || unit.id === selectedUnitId;
                    return (
                        <Marker
                            key={unit.id}
                            position={[unit.location.lat, unit.location.lng]}
                            icon={getUnitIcon(unit.status, !!isAssigned)}
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e);
                                    setSelectedUnitId(unit.id);
                                }
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* Legend Overlay - Moved to Bottom Left */}
            <div className="absolute bottom-6 left-6 bg-surface/90 backdrop-blur border border-border p-3 rounded-lg text-xs z-[1000] shadow-xl">
                <div className="font-bold mb-2 text-textMain uppercase tracking-wider">Legende</div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-orange-600 border border-white animate-pulse"></div>
                    <span className="text-white">Feuer (Aktiv)</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-600 border border-white animate-pulse"></div>
                    <span className="text-white">Rettung (Aktiv)</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 border border-white"></div>
                    <span className="text-textMuted">Frei (S1/S2)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 border border-white"></div>
                    <span className="text-textMuted">Gebunden</span>
                </div>
            </div>
        </div>
    );
};
