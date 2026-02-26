import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import {
  useDeleteUserMutation,
  useToggleUserMutation,
} from "@/hooks/mutations/useUserMutations";
import { UserFormModal } from "@/components/features/users/UserFormModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@vx/shared";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_dashboard/superadmin/resellers")({
  component: ResellersPage,
});

function ResellersPage() {
  const { data: users, isLoading } = useUsersQuery();
  const { mutate: deleteUser } = useDeleteUserMutation();
  const { mutate: toggleUser } = useToggleUserMutation();
  const [isOpen, setIsOpen] = useState(false);

  const resellers = users?.filter((u: any) => u.role === Role.RESELLER) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resellers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage reseller accounts
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Reseller
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Resellers
            <Badge variant="secondary" className="ml-2">
              {resellers.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resellers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No resellers found
                    </TableCell>
                  </TableRow>
                ) : (
                  resellers.map((r: any) => (
                    <TableRow key={r._id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.isActive ? "default" : "secondary"}>
                          {r.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUser(r._id)}
                          >
                            {r.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(r._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <UserFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        allowedRoles={[Role.RESELLER]}
      />
    </div>
  );
}
