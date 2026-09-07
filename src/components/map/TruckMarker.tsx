//Truck Marker
import L from "leaflet";
import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import type { Coordintaes } from "../../types/tracking";
import { truck } from "../../data/mock";

interface TruckMarkerProps {
  positions: Coordintaes;
  isMoving?: boolean;
}

// Custom Leaflet DivIcon for the truck
function getTruckIcon(isMoving: boolean) {
  return L.divIcon({
    className: "truck-marker-icon",
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        ${
          isMoving
            ? `<div style="position: absolute; inset: 2px; border-radius: 9999px; background-color: rgba(245, 158, 11, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ""
        }
        <div style="position: relative; z-index: 10; display: flex; height: 36px; width: 36px; align-items: center; justify-content: center; border-radius: 9999px; background-color: #f59e0b; color: #ffffff; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.5), 0 2px 4px rgba(0,0,0,0.2); border: 2.5px solid #ffffff;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

//Keep getting the lat & lng, and keep moving the TruckMarker
export const TruckMarker = ({
  positions,
  isMoving = true,
}: TruckMarkerProps) => {
  const markerPosition: [number, number] = [
    positions.lat,
    positions.lng,
  ];

  const truckIcon = useMemo(
    () => getTruckIcon(isMoving),
    [isMoving],
  );

  return (
    <Marker position={markerPosition} icon={truckIcon}>
      <Popup>
        <div className="p-1 text-xs">
          <p className="font-bold text-slate-900">{truck.name}</p>
          <p className="text-slate-500">ID: {truck.id}</p>
          <div className="mt-1.5 border-t border-slate-200 pt-1 text-[11px] text-slate-600">
            <p>
              Status:{" "}
              <span className="font-semibold text-amber-600">
                {isMoving ? "In Transit" : "Stationary"}
              </span>
            </p>
            <p>
              Coords: {positions.lat.toFixed(4)}, {positions.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};