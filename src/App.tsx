import { RouteMap } from "./components/map/RouteMap";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Header } from "./components/layout/header";
import { truck } from "./data/mock";

function App() {
  return (
    <DashboardLayout
      header={
        <Header
          truck_name={truck.name}
          truck_id={truck.id}
          isTracking={false}
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
        <RouteMap />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Truck Status
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Tracking panel will be added next.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;