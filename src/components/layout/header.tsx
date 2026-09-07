//Header of the application
interface Headerprop {
  truck_name: string;
  truck_id: string;
  isTracking: boolean;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Header = ({
  truck_name,
  truck_id,
  isTracking,
  isDark = false,
  onToggleTheme,
}: Headerprop) => {
  return (
    <header className="border-b border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Application identity */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            FreightFox
          </p>

          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Logistics Tracker
          </h1>
        </div>

        {/* Truck information & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {truck_name}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {truck_id}
            </p>
          </div>

          {/* Tracking status */}
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isTracking
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isTracking ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />

            {isTracking ? "Tracking" : "Idle"}
          </div>

          {/* Dark mode toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              {isDark ? (
                // Sun icon
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  />
                </svg>
              ) : (
                // Moon icon
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};