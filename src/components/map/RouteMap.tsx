//Mop containter
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { route } from "../../data/mock";
import { TruckMarker } from "./TruckMarker";
export const RouteMap = () => {
  //Takes the stop coordinates and put into positions
  const positions = route.stops.map(
    (stop) => [stop.corrdinates.lat, stop.corrdinates.lng] as [number, number],
  );
  console.log(positions);
  const center = positions[0]; //Extract the first coordinates from the mock data
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative w-full" style={{ height: "520px" }}>
        <MapContainer
          center={center} //Center handles where the map should open when it load for the first time ... It accept lng and lat .
          zoom={13}
          scrollWheelZoom
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline //Polyline is used to draw line segment on the map
            positions={positions}
            pathOptions={{
              color: "#2563eb",
              weight: 5,
              opacity: 0.8,
            }}
          />
          {
            //
            route.stops.map((stop) => {
              const position: [number, number] = [
                stop.corrdinates.lat,
                stop.corrdinates.lng,
              ];
              return (
                <Marker key={stop.id} position={position}>
                  <Popup>
                    <strong>{stop.name}</strong>
                  </Popup>
                </Marker>
              );
            })
          }
          <TruckMarker positions={route.stops[0].corrdinates}></TruckMarker> 
        </MapContainer>
      </div>
    </section>
  );
};
