export interface Coordintaes {
  lat: number;
  lng: number;
}

export type StopId = "origin" | "d1" | "d2" | "d3"; 

export interface RouteStop {
    id: StopId,
    name: string,
    corrdinates: Coordintaes
}

export interface Route {
    id: string,
    name: string,
    stops: RouteStop[]
}

export interface Truck {
    id: string,
    name: string,
    speedKmh: number
}

export interface trackingState {
    currentPosition: Coordintaes,
    currentSegmentIndex: string,
    segmentProgess: string,
    distanceCoveredKmh: number,
    completedStopsId: StopId[]
    isRunning: boolean,
    isCompleted: boolean,
    isPaused: boolean
}