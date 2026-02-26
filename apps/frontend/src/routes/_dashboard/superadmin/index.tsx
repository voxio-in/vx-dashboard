import { createFileRoute } from "@tanstack/react-router";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@vx/shared";
import { Shield, UserCheck, Users } from "lucide-react";

export const Route = createFileRoute("/_dashboard/superadmin/")({
  component: SuperAdminDashboard,
});

function SuperAdminDashboard() {
  const { data: users, isLoading } = useUsersQuery();

  const stats = [
    {
      label: "Total Admins",
      value: users?.filter((u: any) => u.role === Role.ADMIN).length || 0,
      icon: Shield,
    },
    {
      label: "Total Resellers",
      value: users?.filter((u: any) => u.role === Role.RESELLER).length || 0,
      icon: UserCheck,
    },
    {
      label: "Total Users",
      value: users?.filter((u: any) => u.role === Role.USER).length || 0,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SuperAdmin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of all accounts in the system
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
