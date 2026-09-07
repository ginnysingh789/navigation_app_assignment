//Truck Marker
import { Marker, Popup } from "react-leaflet"
import type { Coordintaes } from "../../types/tracking"
interface TruckMarkerProps {
    positions: Coordintaes
}
//Keep getting the lat & lng , and keep moving the TruckMarker
export const TruckMarker = ({positions}: TruckMarkerProps) => {
    const markerPosition : [number, number]=
    [positions.lat,
        positions.lng
    ]
    return(
        <Marker position={markerPosition}>
            <Popup>
                <strong>Truck-01</strong>
            </Popup>
        </Marker>
    )
}