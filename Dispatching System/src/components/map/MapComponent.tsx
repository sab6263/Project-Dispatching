
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Hospital, Vehicle, Incident, Station } from '../../data/mockData';

// Fix Leaflet Default Icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: null,
    shadowUrl: null,
});

interface RouteMetrics {
    duration: number;
    baseTime: number;
    distance: string;
    delay: number;
    trafficLevel: string;
    distribution: { free: number; moderate: number; heavy: number };
    trafficSegments: { color: string; percent: number }[];
}

interface MapComponentProps {
    hospitals: Hospital[];
    vehicles: Vehicle[];
    incidents: Incident[];
    stations: Station[];
    selectedItem: any;
    onSelect: (item: any) => void;
    setRouteMetrics: (metrics: RouteMetrics | null) => void;
}

const GetIcon = (type: string, category?: string, label?: string, extra?: { emergencyAvailable?: boolean; bedsAvailable?: number; bedsTotal?: number }) => {
    let content;
    let bgColor = '#334155';
    let pulse = false;
    let textColor = 'white';
    let size = 40;
    let borderColor = 'white';
    let borderRadius = '50%';
    let borderWidth = '3px';

    if (type === 'Hospital') {
        const isClosed = extra?.emergencyAvailable === false;
        const occupancy = extra ? (1 - (extra.bedsAvailable || 0) / (extra.bedsTotal || 1)) : 0;

        // Grey background like stations, white cross, status shown via border color
        bgColor = '#475569'; // Same grey as stations
        textColor = 'white'; // White cross icon

        // Border color based on occupancy thresholds
        // Green: <70% occupancy (plenty of beds)
        // Orange: 70-94% occupancy (getting busy)
        // Red: ≥95% occupancy (critical/full) OR ER is closed
        if (isClosed || occupancy >= 0.95) {
            borderColor = '#ef4444'; // Red for critical occupancy or closed ER
        } else if (occupancy >= 0.70) {
            borderColor = '#ff9500'; // Vibrant orange for high occupancy
        } else {
            borderColor = '#22c55e'; // Green for low occupancy
        }

        borderRadius = '6px'; // Rounded corners like transcript badges
        size = 40;
        borderWidth = '2px';

        content = (
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Base cross/plus icon */}
                <div style={{
                    position: 'relative',
                    width: '16px',
                    height: '16px',
                    opacity: isClosed ? 0.6 : 1
                }}>
                    {/* Vertical bar */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '100%',
                        backgroundColor: textColor,
                        borderRadius: '2px'
                    }} />
                    {/* Horizontal bar */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        transform: 'translateY(-50%)',
                        width: '100%',
                        height: '4px',
                        backgroundColor: textColor,
                        borderRadius: '2px'
                    }} />
                </div>
            </div>
        );
    } else if (type === 'Station') {
        bgColor = '#475569'; // Solid background
        borderColor = '#64748b';
        textColor = 'white';
        borderRadius = '6px'; // Rounded corners
        size = 40;
        borderWidth = '2px';
        content = <Building2 size={20} strokeWidth={2} style={{ color: textColor }} />;
    } else if (type === 'Vehicle') {
        const text = label || '?';
        borderRadius = '50%'; // Vehicles stay circular
        size = 40;
        borderWidth = '0px'; // No borders on any vehicles

        content = <div style={{
            fontWeight: '800',
            fontSize: text.length > 3 ? '9px' : '11px',
            lineHeight: '1.1',
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            letterSpacing: '-0.02em'
        }}>
            {text}
        </div>;

        if (category === 'Fire') {
            bgColor = '#dc2626'; // Red for fire vehicles
            textColor = 'white';
        } else {
            bgColor = '#ff9500'; // Vibrant orange for EMS vehicles (matches hospital orange border)
            textColor = 'white';
        }
    } else if (type === 'Incident') {
        content = null;
        bgColor = '#ef4444';
        pulse = true;
        size = 24;
    }

    const html = renderToStaticMarkup(
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: bgColor,
            borderRadius: borderRadius,
            border: `${borderWidth} solid ${borderColor}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            color: textColor,
        }} className={pulse ? 'pulse-animation' : ''}>
            {content}
        </div>
    );

    return L.divIcon({
        className: 'custom-leaftlet-icon',
        html: html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2)]
    });
};

const RoutingMachine = ({ from, to, setRouteMetrics }: { from: [number, number], to: [number, number], setRouteMetrics: (m: RouteMetrics | null) => void }) => {
    const map = useMap();
    const routingControlRef = useRef<any>(null);
    const [trafficSegments, setTrafficSegments] = useState<any[]>([]);

    useEffect(() => {
        if (!from || !to) return;
        setTrafficSegments([]);
        if (setRouteMetrics) setRouteMetrics(null);

        // @ts-ignore
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1])
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            showAlternatives: false,
            lineOptions: { styles: [] },
            show: false,
            createMarker: () => null
        });

        routingControl.on('routesfound', function (e: any) {
            const routes = e.routes;
            const route = routes[0];
            const summary = route.summary;
            const coords = route.coordinates;

            if (!coords || coords.length === 0) return;

            const segments: any[] = [];
            let currentSegment = { positions: [coords[0]], distance: 0 };
            const targetSegmentLength = 250;

            for (let i = 1; i < coords.length; i++) {
                const prev = L.latLng(coords[i - 1]);
                const curr = L.latLng(coords[i]);
                const dist = prev.distanceTo(curr);

                currentSegment.positions.push(coords[i]);
                // @ts-ignore
                currentSegment.distance += dist;

                // @ts-ignore
                if (currentSegment.distance >= targetSegmentLength || i === coords.length - 1) {
                    segments.push(currentSegment);
                    currentSegment = { positions: [coords[i]], distance: 0 };
                }
            }

            const avgBaseSpeed = summary.totalDistance / summary.totalTime;

            let totalDelaySeconds = 0;
            let distFree = 0;
            let distModerate = 0;
            let distHeavy = 0;

            const finalSegments = segments.map((seg, index) => {
                const progress = (index / segments.length);
                const rand = Math.random();

                const heavyProb = 0.05 + (progress > 0.7 ? 0.25 : 0);
                const moderateProb = 0.15 + (progress > 0.6 ? 0.25 : 0);

                let color = '#38bdf8';
                let level = 'free';
                let speedFactor = 1.0;

                if (rand < heavyProb) {
                    color = '#ef4444';
                    level = 'heavy';
                    speedFactor = 0.25;
                } else if (rand < heavyProb + moderateProb) {
                    color = '#f97316';
                    level = 'moderate';
                    speedFactor = 0.6;
                }

                if (level === 'free') distFree += seg.distance;
                else if (level === 'moderate') distModerate += seg.distance;
                else distHeavy += seg.distance;

                const segBaseTime = seg.distance / avgBaseSpeed;
                const segDelay = segBaseTime * ((1 / speedFactor) - 1);
                totalDelaySeconds += segDelay;

                return {
                    positions: seg.positions,
                    color: color,
                    distance: seg.distance
                };
            });

            setTrafficSegments(finalSegments);

            const totalDistForBar = finalSegments.reduce((acc, seg) => acc + seg.distance, 0) || 1;
            const barSegments = finalSegments.map(seg => ({
                color: seg.color,
                percent: (seg.distance / totalDistForBar) * 100
            }));

            const safeTotalDist = distFree + distModerate + distHeavy || 1;
            const dist = {
                free: Math.round((distFree / safeTotalDist) * 100),
                moderate: Math.round((distModerate / safeTotalDist) * 100),
                heavy: Math.round((distHeavy / safeTotalDist) * 100)
            };

            const computedDelayMin = Math.round(totalDelaySeconds / 60);
            const visualDelay = (computedDelayMin === 0 && (dist.moderate > 0 || dist.heavy > 0))
                ? 1
                : computedDelayMin;

            if (setRouteMetrics) {
                setRouteMetrics({
                    duration: Math.round((summary.totalTime / 60) + visualDelay),
                    baseTime: Math.round(summary.totalTime / 60),
                    distance: (summary.totalDistance / 1000).toFixed(1),
                    delay: visualDelay,
                    trafficLevel: visualDelay > 5 ? 'High' : (visualDelay > 1 ? 'Moderate' : 'Low'),
                    distribution: dist,
                    trafficSegments: barSegments
                });
            }
        });

        routingControl.addTo(map);
        routingControlRef.current = routingControl;

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [from[0], from[1], to[0], to[1], map]); // Removed setRouteMetrics from dependency to avoid loop if it's unstable, and used primitives for coords

    return (
        <>
            {trafficSegments.map((seg, idx) => (
                <Polyline
                    key={idx}
                    positions={seg.positions}
                    pathOptions={{ color: seg.color, weight: 6, opacity: 0.9 }}
                />
            ))}
        </>
    );
};

export const MapComponent: React.FC<MapComponentProps> = ({ hospitals, vehicles, incidents, stations, selectedItem, onSelect, setRouteMetrics }) => {
    const center: [number, number] = [48.7667, 11.4226];

    const targetIncident = incidents[0];
    const showRoute = selectedItem?.type === 'Vehicle' && targetIncident;

    return (
        <div className="map-wrapper" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: '#0e0e0e' }}>
            <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%', backgroundColor: '#0e0e0e' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> | Routing by OSRM'
                />

                {stations && stations.map(s => (
                    <Marker
                        key={s.id}
                        position={s.position}
                        icon={GetIcon('Station', s.category)}
                        eventHandlers={{ click: () => onSelect(s) }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>{s.name}</Tooltip>
                    </Marker>
                ))}

                {hospitals.map(h => (
                    <Marker
                        key={h.id}
                        position={h.position}
                        icon={GetIcon('Hospital', undefined, undefined, {
                            emergencyAvailable: h.emergencyAvailable,
                            bedsAvailable: h.bedsAvailable,
                            bedsTotal: h.bedsTotal
                        })}
                        eventHandlers={{ click: () => onSelect(h) }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                            <div className="text-xs">
                                <div className="font-bold">{h.name}</div>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        h.emergencyAvailable ? "bg-green-500" : "bg-red-500"
                                    )} />
                                    <span>ER: {h.emergencyAvailable ? 'Open' : 'Closed'}</span>
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}

                {vehicles.map(v => {
                    if (v.status === 'Available') return null;
                    return (
                        <Marker
                            key={v.id}
                            position={v.position}
                            icon={GetIcon('Vehicle', v.category, v.subtype)}
                            eventHandlers={{ click: () => onSelect(v) }}
                            zIndexOffset={100}
                        >
                            <Tooltip direction="top" offset={[0, -20]} opacity={1}>{v.name}</Tooltip>
                        </Marker>
                    );
                })}

                {incidents.map(i => (
                    <Marker
                        key={i.id}
                        position={i.position}
                        icon={GetIcon('Incident')}
                        eventHandlers={{ click: () => onSelect(i) }}
                        zIndexOffset={1000}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>{i.name}</Tooltip>
                    </Marker>
                ))}

                {showRoute && (
                    <RoutingMachine
                        from={selectedItem.position}
                        to={targetIncident.position}
                        setRouteMetrics={setRouteMetrics}
                    />
                )}

            </MapContainer>
        </div>
    );
};
