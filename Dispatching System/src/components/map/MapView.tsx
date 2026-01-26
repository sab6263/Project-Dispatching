
import { useState, useEffect } from 'react';
import { MapComponent } from './MapComponent';
import { MapSidebar } from './MapSidebar';
import { useMapSimulation } from '../../hooks/useMapSimulation';
import { INCIDENTS, STATIONS } from '../../data/mockData';

export const MapView = () => {
    const { vehicles, hospitals } = useMapSimulation();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [routeMetrics, setRouteMetrics] = useState<any>(null);

    // Sync selected item with live data
    useEffect(() => {
        if (selectedItem) {
            if (selectedItem.type === 'Vehicle') {
                const updated = vehicles.find(v => v.id === selectedItem.id);
                if (updated) setSelectedItem(updated);
            } else if (selectedItem.type === 'Hospital') {
                const updated = hospitals.find(h => h.id === selectedItem.id);
                if (updated) setSelectedItem(updated);
            }
        }
    }, [vehicles, hospitals, selectedItem]);

    const handleSelect = (item: any) => {
        setSelectedItem(item);
    };

    const handleClose = () => {
        setSelectedItem(null);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', overflow: 'hidden' }}>
            <MapComponent
                hospitals={hospitals}
                vehicles={vehicles}
                incidents={INCIDENTS}
                stations={STATIONS}
                selectedItem={selectedItem}
                onSelect={handleSelect}
                setRouteMetrics={setRouteMetrics}
            />

            <MapSidebar
                item={selectedItem}
                onClose={handleClose}
                incidents={INCIDENTS}
                stations={STATIONS}
                vehicles={vehicles}
                onSelectVehicle={handleSelect}
                routeMetrics={routeMetrics}
            />
        </div>
    );
};
