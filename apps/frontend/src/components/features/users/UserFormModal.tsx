import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { useCreateUserMutation } from "@/hooks/mutations/useUserMutations";
import { Role } from "@vx/shared";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  allowedRoles?: Role[];
}

export const UserFormModal = ({ isOpen, onClose, allowedRoles }: Props) => {
  const { user: currentUser } = useAuth();
  const { mutate, isPending } = useCreateUserMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: Role.USER,
  });
  const [error, setError] = useState("");

  const roles = allowedRoles || [Role.ADMIN, Role.RESELLER, Role.USER];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutate(
      { ...form, parentId: currentUser?._id },
      {
        onSuccess: () => {
          onClose();
          setForm({ name: "", email: "", password: "", role: Role.USER });
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "Failed to create user");
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            placeholder="••••••••"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={form.role}
            onValueChange={(val) =>
              setForm((p) => ({ ...p, role: val as Role }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r} className="capitalize">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
