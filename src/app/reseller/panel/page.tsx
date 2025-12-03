import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserFlows } from "@/features/flow/queries";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const flowIds = user.flows || [];

  const flows = await getUserFlows(flowIds);
  return <DashboardClient initialFlows={flows} />;
}
