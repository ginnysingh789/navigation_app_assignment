//Display the status of the truck
import { truck } from "../../data/mock";
import type { Route, trackingState } from "../../types/tracking";
import {
  calculateEtaMinutes,
  formatEta,
  calculateRemainingDistanceKm,
} from "../../utils/trackingUtils";

interface truckStatusProp {
  tracking: trackingState;
  route: Route;
  onPause: () => void;
  onResume: () => void;
  onReset?: () => void;
}

export const TruckStatus = ({
  tracking,
  route,
  onPause,
  onResume,
  onReset,
}: truckStatusProp) => {
  //Current stop
  const currentStop = route.stops[tracking.currentSegmentIndex];

  //Next stop
  const nextStop = route.stops[tracking.currentSegmentIndex + 1];

  //Completed Stop names
  const completedStops = route.stops.filter((stop) =>
    tracking.completedStopsId.includes(stop.id),
  );

  //Current stop name
  const currentStopName = tracking.isCompleted
    ? route.stops[route.stops.length - 1].name
    : (currentStop?.name ?? "unknown");

  //Next Stop name
  const nextStopName = tracking.isCompleted
    ? "Route completed"
    : (nextStop?.name ?? "calculating...");

  const remainingDistanceKm = nextStop
    ? calculateRemainingDistanceKm(
        tracking.currentPosition,
        nextStop.corrdinates,
      )
    : 0;

  const etaMinutes = nextStop
    ? calculateEtaMinutes(remainingDistanceKm, truck.speedKmh)
    : 0;

  const eta = tracking.isCompleted ? "Arrived" : formatEta(etaMinutes);

  // Segment progress percentage
  const segmentPercent = tracking.isCompleted
    ? 100
    : Math.min(
        100,
        Math.max(0, Math.round(tracking.segmentProgess * 100)),
      );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Live Tracking
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            Truck Status
          </h2>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
            tracking.isCompleted
              ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
              : tracking.isPaused
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              tracking.isCompleted
                ? "bg-blue-500"
                : tracking.isPaused
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          />

          {tracking.isCompleted
            ? "Completed"
            : tracking.isPaused
              ? "Paused"
              : "Tracking"}
        </div>
      </div>

      {/* Current location */}
      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Current Location
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {currentStopName}
        </p>
      </div>

      {/* Distance */}
      <div className="mt-5">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Distance Covered
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {tracking.distanceCoveredKmh.toFixed(2)} km
        </p>
      </div>

      {/* Next stop */}
      <div className="mt-5">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Next Stop
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {nextStopName}
        </p>
      </div>

      {/* Estimated arrival */}
      <div className="mt-5">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Estimated Arrival
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {eta}
        </p>
      </div>

      {/* Route Progress */}
      <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Route Progress
          </p>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {segmentPercent}%
          </span>
        </div>

        {/* Current leg progress bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{currentStop?.name ?? "Origin"}</span>
            <span>{nextStop ? nextStop.name : "Destination"}</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-150 dark:bg-blue-500"
              style={{ width: `${segmentPercent}%` }}
            />
          </div>
        </div>

        {/* Overall route progression Origin -> D1 -> D2 -> D3 */}
        <div className="mt-4">
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Overall Route Progression
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            {route.stops.map((stop, idx) => {
              const isStopCompleted =
                completedStops.some((s) => s.id === stop.id) ||
                (stop.id === "origin" && tracking.currentSegmentIndex > 0) ||
                tracking.isCompleted;
              const isCurrentStop =
                stop.id === currentStop?.id && !tracking.isCompleted;
              const isNextStop =
                stop.id === nextStop?.id && !tracking.isCompleted;

              return (
                <div
                  key={stop.id}
                  className="flex flex-1 items-center last:flex-initial"
                >
                  {/* Node */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                        isStopCompleted
                          ? "bg-emerald-600 text-white"
                          : isNextStop
                            ? "bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-800"
                            : isCurrentStop
                              ? "bg-blue-500 text-white"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                      title={stop.name}
                    >
                      {isStopCompleted
                        ? "✓"
                        : stop.id === "origin"
                          ? "O"
                          : stop.name}
                    </div>
                    <span
                      className={`mt-1 text-[10px] font-medium ${
                        isStopCompleted || isCurrentStop || isNextStop
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {stop.name}
                    </span>
                  </div>

                  {/* Connector line */}
                  {idx < route.stops.length - 1 && (
                    <div className="mx-1 mb-3.5 h-0.5 flex-1 bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-200"
                        style={{
                          width:
                            idx < tracking.currentSegmentIndex ||
                            tracking.isCompleted
                              ? "100%"
                              : idx === tracking.currentSegmentIndex
                                ? `${segmentPercent}%`
                                : "0%",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completed stops */}
      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Completed Stops
        </p>

        <div className="mt-3 space-y-2">
          {route.stops.map((stop) => {
            const isCompleted = completedStops.some(
              (completedStop) => completedStop.id === stop.id,
            );

            const isCurrent = stop.id === currentStop?.id;

            return (
              <div key={stop.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                        : isCurrent
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    {isCompleted ? "✓" : "•"}
                  </span>

                  <span
                    className={`text-sm ${
                      isCompleted || isCurrent
                        ? "font-semibold text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {stop.name}
                  </span>
                </div>

                {isCurrent && !tracking.isCompleted && (
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pause / Resume / Reset Controls */}
      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        {tracking.isCompleted ? (
          <div className="space-y-2">
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            >
              <svg
                className="h-4 w-4 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Route Completed
            </button>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.99] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                ↻ Restart Route Simulation
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={tracking.isPaused ? onResume : onPause}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.99] ${
              tracking.isPaused
                ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-950"
                : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-950"
            }`}
          >
            {tracking.isPaused ? (
              <>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Resume Tracking
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pause Tracking
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};
