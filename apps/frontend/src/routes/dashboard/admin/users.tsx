import { createFileRoute } from "@tanstack/react-router";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import {
  useToggleUserMutation,
  useDeleteUserMutation,
} from "@/hooks/mutations/useUserMutations";
import { Role } from "@vx/shared";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { data: users, isLoading } = useUsersQuery();
  const { mutate: toggleUser } = useToggleUserMutation();
  const { mutate: deleteUser } = useDeleteUserMutation();

  const myUsers = users?.filter((u: any) => u.role === Role.USER) || [];

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <button className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium">
          + Create User
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
            {myUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            ) : (
              myUsers.map((user: any) => (
                <tr
                  key={user._id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-white">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleUser(user._id)}
                        className="text-xs px-2 py-1 rounded border border-white/10 text-muted-foreground hover:bg-white/5"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-xs px-2 py-1 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10"
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
