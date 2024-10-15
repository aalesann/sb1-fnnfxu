import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, PlusCircle } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

interface MarkerData {
  position: [number, number];
  title: string;
  description: string;
}

function AddMarkerToClick({ addMarker }: { addMarker: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      addMarker(e.latlng);
    },
  });
  return null;
}

function App() {
  const defaultPosition: [number, number] = [-26.18489, -58.17313];
  const [markers, setMarkers] = useState<MarkerData[]>([
    { position: defaultPosition, title: 'Default Location', description: 'This is the default location' }
  ]);
  const [newMarker, setNewMarker] = useState<MarkerData | null>(null);

  const handleAddMarker = (latlng: L.LatLng) => {
    setNewMarker({ position: [latlng.lat, latlng.lng], title: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMarker) {
      setMarkers([...markers, newMarker]);
      setNewMarker(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <MapIcon className="mr-2" /> mmaps
        </h1>
        <div className="h-[400px] w-full mb-4">
          <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position}>
                <Popup>
                  <strong>{marker.title}</strong><br />
                  {marker.description}
                </Popup>
              </Marker>
            ))}
            <AddMarkerToClick addMarker={handleAddMarker} />
          </MapContainer>
        </div>
        {newMarker && (
          <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <PlusCircle className="mr-2" /> Add New Marker
            </h2>
            <div className="mb-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={newMarker.title}
                onChange={(e) => setNewMarker({ ...newMarker, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={newMarker.description}
                onChange={(e) => setNewMarker({ ...newMarker, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Marker
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;