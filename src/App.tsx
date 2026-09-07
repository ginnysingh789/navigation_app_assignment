import { useState, useEffect } from "react";
import { RouteMap } from "./components/map/RouteMap";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Header } from "./components/layout/header";
import { route, truck } from "./data/mock";
import { useTruckTracking } from "./hooks/useTruckTracking";
import { TruckStatus } from "./components/tracking/truckStatus";

function App() {
  const {
    tracking,
    pauseTracking,
    resumeTracking,
    resetTracking,
  } = useTruckTracking();

  // Dark mode theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const isMoving = tracking.isRunning && !tracking.isPaused;

  return (
    <DashboardLayout
      header={
        <Header
          truck_name={truck.name}
          truck_id={truck.id}
          isTracking={isMoving}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
        <RouteMap
          truck_position={tracking.currentPosition}
          isMoving={isMoving}
          currentSegmentIndex={tracking.currentSegmentIndex}
          completedStopsId={tracking.completedStopsId}
          isCompleted={tracking.isCompleted}
          isDark={isDark}
        />

        <TruckStatus
          tracking={tracking}
          route={route}
          onPause={pauseTracking}
          onResume={resumeTracking}
          onReset={resetTracking}
        />
      </div>
    </DashboardLayout>
  );
}

export default App;