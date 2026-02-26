import { createFileRoute } from "@tanstack/react-router";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import {
  useDeleteUserMutation,
  useToggleUserMutation,
} from "@/hooks/mutations/useUserMutations";
import { Role } from "@vx/shared";

export const Route = createFileRoute("/_dashboard/superadmin/admin")({
  component: AdminsPage,
});

function AdminsPage() {
  const { data: users, isLoading } = useUsersQuery();
  const { mutate: deleteUser } = useDeleteUserMutation();
  const { mutate: toggleUser } = useToggleUserMutation();

  const admins = users?.filter((u: any) => u.role === Role.ADMIN) || [];

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Admins</h1>
        <button className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90">
          + Create Admin
        </button>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {["Name", "Email", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((admin: any) => (
                <tr
                  key={admin._id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-white">{admin.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${admin.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleUser(admin._id)}
                        className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 text-muted-foreground"
                      >
                        {admin.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteUser(admin._id)}
                        className="text-xs px-2 py-1 rounded border border-red-500/20 hover:bg-red-500/10 text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
