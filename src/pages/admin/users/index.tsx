import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TopBar } from "@/components/common/top-bar";
import { ErrorText } from "@/components/common/error-text";
import { UserForm } from "@/components/features/user/user-form";
import { UserTable } from "@/components/features/user/user-table";
import type { Ambulance, User } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [editing, setEditing] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [list, units] = await Promise.all([api.get<User[]>("/admin/users"), api.get<Ambulance[]>("/admin/ambulances")]);
    setUsers(list.data);
    setAmbulances(units.data);
  }, []);

  // Initial data load
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch((e) => setError(errorMessage(e))); }, [load]);

  const openForm = (user: User | null) => { setEditing(user); setOpenModal(true); };

  // Handle Deletion of User
  const handleDelete = async (user: User) => {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <>
      <TopBar title="Users">
        <Button size="s" onClick={() => openForm(null)}>+ Add user</Button>
      </TopBar>

      <div className="flex-1 space-y-5 overflow-auto p-4 lg:p-7">
        <ErrorText message={error} />
        <UserTable users={users} onEdit={openForm} onDelete={handleDelete} />
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editing ? "Edit user" : "Add user"}>
        <UserForm user={editing ?? undefined} ambulances={ambulances} onSuccess={() => { setOpenModal(false); void load(); }} />
      </Modal>
    </>
  )
}
