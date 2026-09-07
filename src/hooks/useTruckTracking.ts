// This hook will handle the moving part of the truck
// Current truck position
// Current route segment
// Progress between stops
// Distance covered
// Running / paused / completed state
import { useState, useEffect } from "react";
import { route } from "../data/mock";
import { Tracking_Config } from "../constansts/tracking";
import type { Coordintaes,trackingState } from "../types/tracking";

//Calculate the distance betweeen 2 points
function calculateDistanceKm(
  from: Coordintaes,
  to: Coordintaes,
): number {
  const earthRadiusKm = 6371;

  const latitudeDifference =
    ((to.lat - from.lat) * Math.PI) / 180;

  const longitudeDifference =
    ((to.lng - from.lng) * Math.PI) / 180;

  const fromLatitude =
    (from.lat * Math.PI) / 180;

  const toLatitude =
    (to.lat * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.sin(longitudeDifference / 2) ** 2 *
      Math.cos(fromLatitude) *
      Math.cos(toLatitude);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function getPositionBetweenPoints(
  from: Coordintaes,
  to: Coordintaes,
  progress: number,
): Coordintaes {
  return {
    lat:
      from.lat +
      (to.lat - from.lat) * progress,

    lng:
      from.lng +
      (to.lng - from.lng) * progress,
  };
}

//Intial stage 
function getIntialState () :trackingState{
    return {
        currentPosition: route.stops[0].corrdinates,
        currentSegmentIndex: 0,
        segmentProgess: 0,
        distanceCoveredKmh: 0,
        completedStopsId: [],
        isRunning: true,
        isPaused: false,
        isCompleted: false
    }
}

export const useTruckTracking = () : trackingState =>{
    const [tracking, setTracking] = 
    useState<trackingState>(getIntialState);
    useEffect(() => {
        //If the truck is paused dont run it 
        if(!tracking.isRunning || tracking.isPaused){
            return;
        }

        const interval = setInterval(() => {
            setTracking((previous) => {
                if(previous.isCompleted){
                    return previous //Already reached the final destination
                }
                const currentStop = route.stops[previous.currentSegmentIndex];
                const nextStop = route.stops[previous.currentSegmentIndex + 1]
                
                if (!nextStop || ! currentStop){
                    return{
                        ...previous,
                        isRunning: false,
                        isCompleted: true,
                        isPaused: false,
                        currentPosition: route.stops[route.stops.length -1 ].corrdinates
                    }
                }
                //How much the truck moves after each update
                const progressIncrement =
                  Tracking_Config.animationIntervalMs /
                  Tracking_Config.segmentDurationMs;
                //Add the new progess
                const newProgress = previous.segmentProgess + progressIncrement;

                const segementDistanceKm = calculateDistanceKm(
                  currentStop.corrdinates,
                  nextStop.corrdinates
                );
                //Check whether we reached the next stop or not
                if (newProgress >= 1) {
                  //Add to the stops array
                  const newCompleteStops = [
                    ...previous.completedStopsId,
                    nextStop.id,
                  ];

                  const isFinalStop =
                    previous.currentSegmentIndex + 1 >=
                    route.stops.length - 1;

                  return {
                    ...previous,
                    currentPosition: nextStop.corrdinates,
                    currentSegmentIndex:
                      previous.currentSegmentIndex + 1,
                    segmentProgess: 0,
                    distanceCoveredKmh:
                      previous.distanceCoveredKmh + segementDistanceKm,
                    completedStopsId: newCompleteStops,
                    isRunning: !isFinalStop,
                    isCompleted: isFinalStop,
                    isPaused: false,
                  };
                }

                const currentPosition = getPositionBetweenPoints(
                  currentStop.corrdinates,
                  nextStop.corrdinates,
                  newProgress
                );
                return {
                  ...previous,
                  currentPosition,
                  segmentProgess: newProgress,
                  distanceCoveredKmh:
                    previous.distanceCoveredKmh +
                    segementDistanceKm * progressIncrement,
                };
            })
        },Tracking_Config.animationIntervalMs) //Run this code again and again after 100ms
        return () => {
            clearInterval(interval)
        };
    },[tracking.isRunning,tracking.isPaused]
)
return tracking;

}