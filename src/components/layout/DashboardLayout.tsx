import type { ReactNode } from "react";

//Dashboard wrapper
interface DashboardLayoutProps {
    header: ReactNode,
    children: ReactNode
}

export const DashboardLayout = ({header, children}:DashboardLayoutProps) => {
    return (
         <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {header}

      <main className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </main>
    </div>
    )

}