import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import { pinIcon } from "@/components/features/map/map-icons";

type LocationPickerProps = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

function ClickToPlace({ onChange }: Pick<LocationPickerProps, "onChange">) {
  useMapEvents({ click: (e) => onChange(e.latlng.lat, e.latlng.lng) });
  return null;
}

function Recenter({ lat, lng }: Pick<LocationPickerProps, "lat" | "lng">) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], map.getZoom()); }, [map, lat, lng]);
  return null;
}

// Small map where the dispatcher taps the exact spot of the emergency
export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  return (
    <div className="h-48 overflow-hidden rounded-[10px] border border-line">
      <MapContainer center={[lat, lng]} zoom={15} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter lat={lat} lng={lng} />
        <ClickToPlace onChange={onChange} />
        <Marker
          position={[lat, lng]}
          icon={pinIcon("patient", "!")}
          draggable
          eventHandlers={{ dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onChange(p.lat, p.lng); } }}
        />
      </MapContainer>
    </div>
  )
}
