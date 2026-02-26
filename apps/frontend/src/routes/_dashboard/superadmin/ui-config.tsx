import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useGlobalConfigQuery,
  useUpdateRoleConfigMutation,
} from "@/hooks/queries/useSuperAdminQuery";
import { Role, UI_REGISTRY } from "@vx/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_dashboard/superadmin/ui-config" as any)(
  {
    component: UIConfigPage,
  },
);

const roles = [Role.ADMIN, Role.RESELLER, Role.USER];
const allComponents = Object.entries(UI_REGISTRY);

function UIConfigPage() {
  const { data: config, isLoading } = useGlobalConfigQuery();
  const { mutate: updateRoleConfig, isPending } = useUpdateRoleConfigMutation();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);

  const currentHidden: string[] =
    config?.roleOverrides?.[selectedRole]?.hiddenComponents || [];

  const toggleComponent = (componentId: string) => {
    const updated = currentHidden.includes(componentId)
      ? currentHidden.filter((c: string) => c !== componentId)
      : [...currentHidden, componentId];
    updateRoleConfig({ role: selectedRole, hiddenComponents: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">UI Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Control which UI elements are visible per role
        </p>
      </div>

      <Tabs
        value={selectedRole}
        onValueChange={(val) => setSelectedRole(val as Role)}
      >
        <TabsList>
          {roles.map((role) => (
            <TabsTrigger key={role} value={role} className="capitalize">
              {role}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role} value={role} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base capitalize">
                  {role} visibility
                </CardTitle>
                <CardDescription>
                  Toggle components off to hide them from {role} users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {allComponents.map(([key, value]) => {
                      const isHidden = currentHidden.includes(value);
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {value}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={isHidden ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {isHidden ? "Hidden" : "Visible"}
                            </Badge>
                            <Switch
                              checked={!isHidden}
                              onCheckedChange={() => toggleComponent(value)}
                              disabled={isPending}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
