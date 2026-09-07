// Route Map container
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { route } from "../../data/mock";
import { TruckMarker } from "./TruckMarker";
import type { Coordintaes, RouteStop, StopId } from "../../types/tracking";

interface RouteMapProps {
  truck_position: Coordintaes;
  isMoving?: boolean;
  currentSegmentIndex?: number;
  completedStopsId?: StopId[];
  isCompleted?: boolean;
  isDark?: boolean;
}

// Generate visually differentiated icons for Origin, Delivery, Active, and Completed stops
function getStopIcon(
  stop: RouteStop,
  isOrigin: boolean,
  isCompleted: boolean,
  isCurrentTarget: boolean,
) {
  let content: string;
  let style: string;
  let ringHtml = "";

  if (isOrigin) {
    style = "background-color: #059669; color: #ffffff; border: 2.5px solid #ffffff;";
    content = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    `;
  } else if (isCompleted) {
    style = "background-color: #059669; color: #ffffff; border: 2px solid #ffffff;";
    content = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
  } else if (isCurrentTarget) {
    style = "background-color: #2563eb; color: #ffffff; border: 2.5px solid #ffffff;";
    content = stop.name;
    ringHtml = `<div style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid #3b82f6; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.8;"></div>`;
  } else {
    style = "background-color: #f8fafc; color: #475569; border: 2px solid #cbd5e1;";
    content = stop.name;
  }

  return L.divIcon({
    className: "custom-stop-marker",
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        ${ringHtml}
        <div style="position: relative; z-index: 10; display: flex; height: 30px; width: 30px; align-items: center; justify-content: center; border-radius: 9999px; box-shadow: 0 2px 5px rgba(0,0,0,0.25); font-size: 11px; font-weight: 700; ${style}">
          ${content}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

export const RouteMap = ({
  truck_position,
  isMoving = true,
  currentSegmentIndex = 0,
  completedStopsId = [],
  isCompleted = false,
  isDark = false,
}: RouteMapProps) => {
  // Takes the stop coordinates and converts to latlng positions
  const positions = route.stops.map(
    (stop) =>
      [stop.corrdinates.lat, stop.corrdinates.lng] as [number, number],
  );

  const center = positions[0]; // Center on origin on initial load

  // Tile layers: CartoDB Voyager for light mode, CartoDB Dark Matter for dark mode
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-[420px] w-full sm:h-[480px] lg:h-[620px]">
        <MapContainer
          key={isDark ? "map-dark" : "map-light"}
          center={center}
          zoom={13}
          scrollWheelZoom
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer attribution={attribution} url={tileUrl} />

          {/* Route path polyline */}
          <Polyline
            positions={positions}
            pathOptions={{
              color: isDark ? "#60a5fa" : "#2563eb",
              weight: 5,
              opacity: 0.85,
              lineCap: "round",
              lineJoin: "round",
            }}
          />

          {/* Stop markers */}
          {route.stops.map((stop, index) => {
            const position: [number, number] = [
              stop.corrdinates.lat,
              stop.corrdinates.lng,
            ];

            const isOrigin = stop.id === "origin";
            const stopIsCompleted =
              completedStopsId.includes(stop.id) ||
              (isOrigin && currentSegmentIndex > 0) ||
              isCompleted;

            const isCurrentTarget =
              !isCompleted &&
              !stopIsCompleted &&
              index === currentSegmentIndex + 1;

            const icon = getStopIcon(
              stop,
              isOrigin,
              stopIsCompleted,
              isCurrentTarget,
            );

            let statusLabel = "Upcoming Stop";
            if (isOrigin) {
              statusLabel = stopIsCompleted
                ? "Departed Origin"
                : "Starting Location";
            } else if (stopIsCompleted) {
              statusLabel = "Delivery Completed";
            } else if (isCurrentTarget) {
              statusLabel = "Next Stop (En Route)";
            }

            return (
              <Marker key={stop.id} position={position} icon={icon}>
                <Popup>
                  <div className="p-1 text-xs">
                    <p className="font-bold text-slate-900">
                      {stop.name}
                      {isOrigin && " (Origin)"}
                    </p>
                    <div className="mt-1 border-t border-slate-200 pt-1 text-[11px] text-slate-600">
                      <p>
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            stopIsCompleted
                              ? "text-emerald-600"
                              : isCurrentTarget
                                ? "text-blue-600"
                                : "text-slate-500"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </p>
                      <p>
                        Coords: {stop.corrdinates.lat.toFixed(4)},{" "}
                        {stop.corrdinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Moving truck marker */}
          <TruckMarker
            positions={truck_position}
            isMoving={isMoving && !isCompleted}
          />
        </MapContainer>
      </div>
    </section>
  );
};
