import type { Coordintaes } from "../types/tracking";

//Calculate the distance betweeen 2 points
export function calculateDistanceKm(
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

//Calculate the remaining distance to the next stop
export function calculateRemainingDistanceKm(
  currentPosition: Coordintaes,
  nextStop: Coordintaes,
): number {
  return calculateDistanceKm(
    currentPosition,
    nextStop,
  );
}

//Calculate the time needed to reach the next stop
export function calculateEtaMinutes(
  distanceKm: number,
  speedKmh: number,
): number {
  if (!speedKmh || speedKmh <= 0 || !isFinite(speedKmh)) {
    return 0;
  }

  if (!distanceKm || distanceKm <= 0 || !isFinite(distanceKm)) {
    return 0;
  }

  return (distanceKm / speedKmh) * 60;
}

//Convert minutes into a readable format
export function formatEta(minutes: number): string {
  if (!minutes || minutes <= 0 || !isFinite(minutes)) {
    return "Arriving now";
  }

  const roundedMinutes = Math.ceil(minutes);

  if (roundedMinutes < 60) {
    return `${roundedMinutes} min`;
  }

  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}