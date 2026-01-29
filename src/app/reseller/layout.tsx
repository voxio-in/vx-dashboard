import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "reseller") {
    redirect("/dashboard");
  }
  return (
    <UnsavedChangesProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none z-0" />
          <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
            {children}
          </div>
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
