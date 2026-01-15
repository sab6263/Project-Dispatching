import React from 'react';
import { X, MapPin, AlertTriangle, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import type { Vehicle, Station, Hospital, Incident } from '../../data/mockMapData';

interface MapSidebarProps {
    item: any;
    onClose: () => void;
    incidents: Incident[];
    routeMetrics: any;
    vehicles: Vehicle[];
    stations: Station[];
    onSelectVehicle: (item: any) => void;
}

export const MapSidebar: React.FC<MapSidebarProps> = ({ item, onClose, incidents, routeMetrics, vehicles, stations, onSelectVehicle }) => {
    if (!item) return null;

    const parentStation = item.type === 'Vehicle' && item.stationId && item.status === 'Available' && stations
        ? stations.find(s => s.id === item.stationId)
        : null;

    return (
        <div className="glass-panel animate-slide-in" style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            zIndex: 1000,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            color: '#f1f5f9',
            background: 'rgba(15, 23, 42, 0.9)', // Added background for legibility
            backdropFilter: 'blur(12px)',
            borderLeft: '1px solid rgba(255,255,255,0.1)'
        }}
            onDragOver={(e) => {
                if (item.type === 'Station') {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                }
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {parentStation && (
                        <button
                            onClick={() => onSelectVehicle(parentStation)}
                            title={`Back to ${parentStation.name}`}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{item.name}</h2>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {item.type === 'Vehicle' && <VehicleDetails vehicle={item} incidents={incidents} routeMetrics={routeMetrics} stations={stations} />}
                {item.type === 'Hospital' && <HospitalDetails hospital={item} />}
                {item.type === 'Incident' && <IncidentDetails incident={item} />}
                {item.type === 'Station' && <StationDetails station={item} vehicles={vehicles} onSelectVehicle={onSelectVehicle} routeMetrics={routeMetrics} />}
            </div>

            {/* Actions */}
            {item.type !== 'Hospital' && (
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155' }}>
                    {item.type === 'Station' ? (
                        <div style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '2px dashed #3b82f6',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#60a5fa',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                                e.currentTarget.style.borderColor = '#60a5fa';
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                                const vehicleData = e.dataTransfer.getData('vehicle');
                                if (vehicleData) {
                                    const vehicle = JSON.parse(vehicleData);
                                    console.log('🚑 VEHICLE DROPPED TO DISPATCH PROPOSAL:', {
                                        vehicle: vehicle,
                                        station: item,
                                        timestamp: new Date().toISOString()
                                    });
                                }
                            }}
                        >
                            Add to dispatch proposal
                        </div>
                    ) : (
                        <button style={{
                            width: '100%',
                            padding: '12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}>
                            Add to dispatch proposal
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const VehicleDetails = ({ vehicle, routeMetrics, stations }: any) => {
    const parentStation = vehicle.stationId && stations
        ? stations.find((s: Station) => s.id === vehicle.stationId)
        : null;

    const useStationRouting = vehicle.status === 'Available' && parentStation?.mockRouting;

    const baseDriveTime = useStationRouting
        ? parentStation.mockRouting.baseTime
        : (routeMetrics?.baseTime || 0);
    const trafficDelay = useStationRouting
        ? parentStation.mockRouting.trafficDelay
        : (routeMetrics?.delay || 0);

    const totalDriveTime = baseDriveTime + trafficDelay;

    const isAvailable = vehicle.status === 'Available';
    const isReturning = vehicle.status === 'Returning';

    let estimatedReadyTime = 0;
    let aiReasoning = "Unit is fully available. Routing calculations assume immediate dispatch capability + standard drive times.";

    if (!isAvailable) {
        if (isReturning) {
            estimatedReadyTime = 8;
            aiReasoning = `Unit is currently returning to base. AI estimates ${estimatedReadyTime} min for restocking and handover before next potential dispatch.`;
            if (vehicle.fuel < 10) {
                const refuelingTime = 10;
                estimatedReadyTime += refuelingTime;
                aiReasoning = `Unit is returning to base with critically low fuel (${vehicle.fuel}%). AI estimates ${refuelingTime} min for refueling + ${estimatedReadyTime - refuelingTime} min for restocking before readiness.`;
            }
        } else {
            estimatedReadyTime = 23;
            const missionDesc = vehicle.mission?.keyword || "current incident";
            aiReasoning = `Unit deployed to "${missionDesc}". Based on incident severity, AI projects approx ${estimatedReadyTime} min clearance time before readiness.`;
        }
    } else {
        if (vehicle.fuel < 10) {
            const refuelingTime = 10;
            estimatedReadyTime = refuelingTime;
            aiReasoning = `Unit has critically low fuel (${vehicle.fuel}%) and requires refueling before next dispatch. Estimated ${refuelingTime} min for refueling.`;
        }
    }

    const displayTime = (routeMetrics || useStationRouting) ? (estimatedReadyTime + totalDriveTime) : '--';

    // Logic to handle timeline for Returning vehicles
    let displayMission = vehicle.mission;
    if (isReturning) {
        if (!displayMission) {
            // If no previous mission data, create a placeholder
            displayMission = {
                keyword: 'Return Trip',
                description: 'Unit returning to station',
                timeline: []
            };
        }
        // Create a new timeline array to avoid mutating the original
        const returningEvent = { time: 'Now', event: 'Returning to Base' };
        // We want 'Returning to Base' to be the *last* event chronologically, 
        // which becomes the *first* event when reversed in the UI loop.
        displayMission = {
            ...displayMission,
            timeline: [...displayMission.timeline, returningEvent]
        };
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Type</span>
                    <span style={{ fontWeight: 600 }}>{vehicle.subtype}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8' }}>Status</span>
                    <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: vehicle.status === 'Available' ? 'rgba(34, 197, 94, 0.2)' :
                            vehicle.status === 'Dispatched' ? 'rgba(239, 68, 68, 0.2)' :
                                'rgba(234, 179, 8, 0.2)',
                        color: vehicle.status === 'Available' ? '#4ade80' :
                            vehicle.status === 'Dispatched' ? '#ef4444' :
                                '#facc15',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'none'
                    }}>
                        {vehicle.status === 'Dispatched' ? 'In Operation' : vehicle.status}
                    </span>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ marginBottom: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ESTIMATED TIME TO SCENE
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>
                        {displayTime} <span style={{ fontSize: '1.25rem' }}>min</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Confidence</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22c55e' }}>
                            {useStationRouting
                                ? `${parentStation.mockRouting.confidence}%`
                                : (routeMetrics ? '85%' : '--')}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {estimatedReadyTime > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: '#a855f7' }}>Estimated time to ready</span>
                            <span style={{ color: '#a855f7' }}>{estimatedReadyTime} min</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#cbd5e1' }}>Drive Time</span>
                        <span style={{ color: '#cbd5e1' }}>{baseDriveTime} min</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#cbd5e1' }}>Traffic Delay</span>
                        <span style={{ color: '#cbd5e1' }}>+ {trafficDelay} min</span>
                    </div>
                </div>

                {!isAvailable && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ marginTop: '2px' }}>
                            <Sparkles size={16} color="#94a3b8" />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.4' }}>
                            {aiReasoning}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ marginBottom: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Vehicle Status
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#cbd5e1' }}>Estimated fuel level</span>
                    <span style={{ fontWeight: 600 }}>{vehicle.fuel}%</span>
                </div>
                <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${vehicle.fuel}%`,
                        background: vehicle.fuel < 20 ? '#ef4444' : vehicle.fuel < 50 ? '#eab308' : '#22c55e',
                        height: '100%',
                        transition: 'width 0.5s ease-out'
                    }} />
                </div>
            </div>

            {displayMission && (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ marginBottom: '20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        CURRENT MISSION TIMELINE
                    </div>
                    <div style={{ position: 'relative', paddingLeft: '12px' }}>
                        {[...displayMission.timeline].reverse().map((event: any, idx: number, arr: any[]) => {
                            const isLatest = idx === 0;
                            const isLast = idx === arr.length - 1;

                            return (
                                <div key={idx} style={{ marginBottom: isLast ? '0px' : '24px', position: 'relative', paddingLeft: '24px' }}>
                                    {/* Timeline Line Segment */}
                                    {!isLast && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '7px',
                                            top: isLatest ? '32px' : '0px',
                                            bottom: '-24px',
                                            width: '2px',
                                            background: '#334155',
                                            zIndex: 0
                                        }} />
                                    )}
                                    {isLast && !isLatest && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '7px',
                                            top: '0px',
                                            height: '32px',
                                            width: '2px',
                                            background: '#334155',
                                            zIndex: 0
                                        }} />
                                    )}

                                    <div style={{
                                        position: 'absolute',
                                        left: '0px',
                                        top: isLatest ? '24px' : '26px',
                                        width: isLatest ? '16px' : '12px',
                                        height: isLatest ? '16px' : '12px',
                                        borderRadius: '50%',
                                        background: isLatest ? '#10b981' : '#94a3b8',
                                        marginLeft: isLatest ? '0px' : '2px',
                                        boxShadow: isLatest ? '0 0 12px rgba(16, 185, 129, 0.6)' : 'none',
                                        zIndex: 1,
                                        border: '2px solid #1e293b'
                                    }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2px' }}>{event.time}</span>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
                                            {event.event.replace(/:.+/, '')} {/* Strip existing keyword from event string if present to avoid duplication */}
                                        </span>
                                        {event.event.includes('Dispatched') && displayMission.keyword && (
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>
                                                Keyword: {displayMission.keyword}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const HospitalDetails = ({ hospital }: { hospital: Hospital }) => {
    const total = hospital.bedsTotal || 100;
    const available = hospital.bedsAvailable || 0;
    const occupied = total - available;
    const occupancyRate = Math.round((occupied / total) * 100);

    let statusColor = '#4ade80';
    let statusText = 'Normal';
    if (occupancyRate > 90) {
        statusColor = '#ef4444';
        statusText = 'Critical';
    } else if (occupancyRate > 75) {
        statusColor = '#f97316';
        statusText = 'High';
    }

    const admissions = hospital.admissions || 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>
                <MapPin size={18} />
                <span>{hospital.address}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '1rem', fontWeight: 600 }}>ER Status</span>
                <span style={{
                    background: hospital.emergencyAvailable ? '#22c55e' : '#ef4444',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {hospital.emergencyAvailable ? 'Open' : 'Closed'}
                </span>
            </div>

            <div>
                <div style={{
                    textTransform: 'uppercase', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px'
                }}>
                    Occupancy
                </div>
                <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${occupancyRate}%`, height: '100%', background: statusColor, borderRadius: '5px', transition: 'width 0.5s ease-out' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.9rem' }}>{occupancyRate}% ({statusText})</span>
                </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '1rem' }}>Admissions (1h):</span>
                    <span style={{
                        background: '#f1f5f9', color: '#0f172a', fontWeight: 700, fontSize: '0.9rem', padding: '2px 10px', borderRadius: '12px', minWidth: '24px', textAlign: 'center'
                    }}>
                        {admissions}
                    </span>
                </div>
            </div>
        </div>
    );
};

const IncidentDetails = ({ incident }: { incident: Incident }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'rgba(249, 115, 22, 0.15)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#fb923c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} />
                {incident.name}
            </h3>
            <p style={{ margin: 0, color: '#fed7aa' }}>{incident.description}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="#94a3b8" />
                <span style={{ color: '#cbd5e1' }}>{incident.address}</span>
            </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#eab308" /> Incident Timeline
            </h3>
            <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #334155' }}>
                {incident.timeline && incident.timeline.map((event, idx) => (
                    <div key={idx} style={{ marginBottom: '16px', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', left: '-25px', top: '4px',
                            width: '8px', height: '8px', borderRadius: '50%', background: '#d1d5db'
                        }} />
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{event.time}</div>
                        <div>{event.event}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const StationDetails = ({ station, vehicles, onSelectVehicle }: any) => {
    const stationVehicles = vehicles.filter((v: Vehicle) => v.stationId === station.id && v.status === 'Available');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={20} color="#94a3b8" />
                    <span style={{ color: '#cbd5e1' }}>{station.address}</span>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ marginBottom: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ESTIMATED TIME TO SCENE
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>
                            {station.mockRouting ? station.mockRouting.duration : '--'}
                        </div>
                        <span style={{ fontSize: '1.25rem', color: '#3b82f6' }}>min</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Confidence</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22c55e' }}>
                            {station.mockRouting ? `${station.mockRouting.confidence}%` : '--'}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#e2e8f0' }}>Available Vehicles ({stationVehicles.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stationVehicles.length === 0 ? (
                        <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No vehicles assigned</div>
                    ) : (
                        stationVehicles.map((v: Vehicle) => (
                            <div
                                key={v.id}
                                draggable={true}
                                onDragStart={(e) => {
                                    e.dataTransfer.effectAllowed = 'move';
                                    e.dataTransfer.setData('vehicle', JSON.stringify(v));
                                    // Custom drag image logic removed for simplicity in TS migration or kept if needed.
                                    // To keep it simple, we'll skip the complex manual DOM node creation for drag image in this step,
                                    // or just rely on default.
                                }}
                                onClick={() => onSelectVehicle(v)}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'grab',
                                    border: '1px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v.subtype}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{v.name}</div>
                                </div>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: v.status === 'Available' ? 'rgba(34, 197, 94, 0.2)' :
                                        v.status === 'Dispatched' ? 'rgba(239, 68, 68, 0.2)' :
                                            v.status === 'Returning' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                    color: v.status === 'Available' ? '#4ade80' :
                                        v.status === 'Dispatched' ? '#f87171' :
                                            v.status === 'Returning' ? '#60a5fa' : '#facc15',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                }}>
                                    {v.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
