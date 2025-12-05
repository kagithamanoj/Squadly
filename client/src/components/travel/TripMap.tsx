import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon using CDN to avoid build issues
const icon = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface TripMapProps {
    activities: any[];
    origin: string;
    destination: string;
}

// Component to update map center based on markers
const MapUpdater: React.FC<{ bounds: L.LatLngBoundsExpression }> = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
};

const TripMap: React.FC<TripMapProps> = ({ activities }) => {
    // Mock coordinates for demo purposes since we don't have a geocoding API
    // In a real app, we would geocode the locations
    const getMockCoordinates = (location: string) => {
        // Simple hash to generate consistent pseudo-random coordinates around a base point
        // This is just for visualization without an API key
        const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseLat = 40.7128; // NYC
        const baseLng = -74.0060;

        return [
            baseLat + (hash % 100) / 100 - 0.5,
            baseLng + (hash % 100) / 100 - 0.5
        ] as [number, number];
    };

    const markers = activities
        .filter(a => a.location)
        .map(a => ({
            ...a,
            position: getMockCoordinates(a.location)
        }));

    const bounds = markers.length > 0
        ? L.latLngBounds(markers.map(m => m.position))
        : L.latLngBounds([[40.7128, -74.0060], [40.7589, -73.9851]]); // Default bounds

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
            <MapContainer
                center={[40.7128, -74.0060]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater bounds={bounds} />

                {markers.map((marker, idx) => (
                    <Marker key={idx} position={marker.position}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{marker.description}</h3>
                                <p className="text-xs text-gray-500">{marker.location}</p>
                                <p className="text-xs font-medium mt-1">{new Date(marker.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default TripMap;
