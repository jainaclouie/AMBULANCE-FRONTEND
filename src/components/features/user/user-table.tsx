import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { capitalize } from "@/lib/format";
import type { User } from "@/types";

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

const headers = ["Name", "Email", "Role", "Ambulance", "Phone", ""];

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <Card className="overflow-auto">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-surface-subtle text-xs text-muted">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-line">
              <td className="px-4 py-3.5 font-bold">{u.name}</td>
              <td className="px-4 py-3.5">{u.email}</td>
              <td className="px-4 py-3.5"><Chip kind={u.role === "crew" ? "available" : u.role === "admin" ? "critical" : "busy"} dot={false}>{capitalize(u.role)}</Chip></td>
              <td className="px-4 py-3.5">{u.ambulance_name ?? "-"}</td>
              <td className="px-4 py-3.5">{u.phone ?? "-"}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button variant="tertiary" size="s" className="px-2" onClick={() => onEdit(u)}>Edit</Button>
                  <Button variant="tertiary" size="s" className="px-2 text-brand-primary" onClick={() => onDelete(u)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
