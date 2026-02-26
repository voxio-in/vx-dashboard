import { createFileRoute } from "@tanstack/react-router";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { useToggleUserMutation } from "@/hooks/mutations/useUserMutations";
import { Role } from "@vx/shared";

export const Route = createFileRoute("/dashboard/reseller/users")({
  component: ResellerUsersPage,
});

function ResellerUsersPage() {
  const { data: users, isLoading } = useUsersQuery();
  const { mutate: toggleUser } = useToggleUserMutation();

  const myUsers = users?.filter((u: any) => u.role === Role.USER) || [];

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">My Users</h1>
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
                    <button
                      onClick={() => toggleUser(user._id)}
                      className="text-xs px-2 py-1 rounded border border-white/10 text-muted-foreground hover:bg-white/5"
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
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
