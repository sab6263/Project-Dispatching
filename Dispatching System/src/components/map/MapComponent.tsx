
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { Building2, Plus } from 'lucide-react';
import type { Hospital, Vehicle, Incident, Station } from '../../data/mockMapData';

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

const GetIcon = (type: string, category?: string, label?: string) => {
    let content;
    let bgColor = '#334155';
    let pulse = false;
    let textColor = 'white';
    let size = 40;
    let borderColor = 'white';
    let borderRadius = '50%';
    let borderWidth = '3px';

    if (type === 'Hospital') {
        bgColor = '#ef4444';
        borderColor = 'rgba(255, 255, 255, 0.8)';
        textColor = 'rgba(255, 255, 255, 0.9)';
        borderRadius = '8px';
        size = 40;
        borderWidth = '2px';
        content = <Plus size={22} strokeWidth={4} />;
    } else if (type === 'Station') {
        bgColor = '#475569';
        borderColor = 'rgba(255, 255, 255, 0.8)';
        textColor = 'rgba(255, 255, 255, 0.9)';
        borderRadius = '8px';
        size = 40;
        borderWidth = '2px';
        content = <Building2 size={22} strokeWidth={2} />;
    } else if (type === 'Vehicle') {
        const text = label || '?';
        content = <div style={{
            fontWeight: '800',
            fontSize: text.length > 3 ? '10px' : '12px',
            lineHeight: '1.1',
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {text}
        </div>;

        if (category === 'Fire') {
            bgColor = '#ef4444';
        } else {
            bgColor = '#eab308';
            textColor = '#3f3f46';
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
        <div className="map-wrapper" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
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
                        icon={GetIcon('Hospital')}
                        eventHandlers={{ click: () => onSelect(h) }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>{h.name}</Tooltip>
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
