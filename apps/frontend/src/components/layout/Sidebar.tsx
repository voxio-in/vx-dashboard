import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserCog,
  Workflow,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    minRole: Role.USER,
    icon: LayoutDashboard,
  },
  {
    label: "Admins",
    path: "/superadmin/admins",
    minRole: Role.SUPERADMIN,
    icon: Shield,
  },
  {
    label: "Resellers",
    path: "/superadmin/resellers",
    minRole: Role.SUPERADMIN,
    icon: UserCheck,
  },
  {
    label: "All Users",
    path: "/superadmin/users",
    minRole: Role.SUPERADMIN,
    icon: Users,
  },
  { label: "Users", path: "/admin/users", minRole: Role.ADMIN, icon: Users },
  {
    label: "My Users",
    path: "/reseller/users",
    minRole: Role.RESELLER,
    icon: Users,
  },
  { label: "Flows", path: "/user/flows", minRole: Role.USER, icon: Workflow },
  {
    label: "UI Config",
    path: "/superadmin/ui-config",
    minRole: Role.SUPERADMIN,
    icon: Settings,
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && ROLE_LEVEL[user.role as Role] >= ROLE_LEVEL[item.minRole],
  );

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="w-64 h-screen border-r border-border flex flex-col bg-background">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold">VX Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path as any}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                "[&.active]:bg-accent [&.active]:text-foreground [&.active]:font-medium",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 [.active_&]:opacity-100" />
            </Link>
          );
        })}
      </nav>

      <Separator />
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <Badge variant="outline" className="text-xs capitalize mt-0.5">
            {user?.role}
          </Badge>
        </div>
      </div>
    </aside>
  );
};
