//Header of the application
interface Headerprop {
    truck_name: string,
    truck_id: string,
    isTracking: boolean
}

export const Header = ({truck_name,truck_id,isTracking}:Headerprop) => {
    return (
        <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Application identity */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            FreightFox
          </p>

          <h1 className="text-lg font-bold text-slate-900">
            Logistics Tracker
          </h1>
        </div>

        {/* Truck information */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {truck_name}
            </p>

            <p className="text-xs text-slate-500">
              {truck_id}
            </p>
          </div>

          {/* Tracking status */}
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isTracking
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isTracking
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }`}
            />

            {isTracking ? "Tracking" : "Idle"}
          </div>
        </div>

      </div>
    </header>
    )


}