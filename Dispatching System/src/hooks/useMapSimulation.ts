
import { useState, useEffect } from 'react';
import { VEHICLES as INITIAL_VEHICLES, HOSPITALS as INITIAL_HOSPITALS } from '../data/mockMapData';
import type { Vehicle, Hospital } from '../data/mockMapData';

export const useMapSimulation = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
    const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);

    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Vehicle Simulation
            setVehicles(currentVehicles =>
                currentVehicles.map(v => {
                    // Simulate fuel consumption
                    let newFuel = v.fuel;
                    if (v.status !== 'Available' && Math.random() > 0.7) {
                        newFuel = Math.max(0, v.fuel - 1);
                    }

                    return { ...v, fuel: newFuel };
                })
            );

            // 2. Hospital Simulation
            setHospitals(currentHospitals =>
                currentHospitals.map(h => {
                    if (Math.random() > 0.2) {
                        return h;
                    }

                    const maxAdmissions = Math.max(5, Math.ceil(h.bedsTotal / 50));
                    const currentAdmissions = h.admissions !== undefined ? h.admissions : Math.round(maxAdmissions * 0.5);

                    const change = Math.floor(Math.random() * 3) - 1;
                    let newAdmissions = Math.max(0, Math.min(maxAdmissions, currentAdmissions + change));

                    const intensity = newAdmissions / maxAdmissions;
                    const targetOccupancyRate = 0.50 + (intensity * 0.45);
                    const noise = (Math.random() - 0.5) * 0.02;
                    const finalOccupancyRate = Math.min(0.99, Math.max(0.4, targetOccupancyRate + noise));

                    const targetOccupied = Math.round(h.bedsTotal * finalOccupancyRate);
                    const newAvailable = Math.max(0, h.bedsTotal - targetOccupied);

                    const isCritical = newAvailable < 3 || (newAvailable / h.bedsTotal) < 0.02;

                    return {
                        ...h,
                        bedsAvailable: newAvailable,
                        admissions: newAdmissions,
                        emergencyAvailable: !isCritical
                    };
                })
            );

        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return { vehicles, hospitals };
};
