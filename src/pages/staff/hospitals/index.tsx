import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ErrorText } from "@/components/common/error-text";
import { TopBar } from "@/components/common/top-bar";
import { HospitalForm } from "@/components/features/hospital/hospital-form";
import { HospitalTable } from "@/components/features/hospital/hospital-table";
import { useAuth } from "@/context/auth-state";
import type { Hospital } from "@/types";

export default function HospitalsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data } = await api.get<Hospital[]>("/hospitals");
    setHospitals(data);
  }, []);

  // Initial data load
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch((e) => setError(errorMessage(e))); }, [load]);

  const openForm = (hospital: Hospital | null) => { setEditing(hospital); setOpenModal(true); };

  // Handle Deletion of Hospital
  const handleDelete = async (hospital: Hospital) => {
    if (!confirm(`Delete ${hospital.name}?`)) return;
    try {
      await api.delete(`/admin/hospitals/${hospital.id}`);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <>
      <TopBar title="Hospitals">
        {isAdmin && <Button size="s" onClick={() => openForm(null)}>+ Add hospital</Button>}
      </TopBar>

      <div className="flex-1 space-y-4 overflow-auto p-4 lg:p-7">
        <p className="text-muted">Destinations the ambulance crew can choose when transporting a patient.</p>
        <ErrorText message={error} />
        <HospitalTable hospitals={hospitals} canEdit={isAdmin} onEdit={openForm} onDelete={handleDelete} />
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editing ? "Edit hospital" : "Add hospital"}>
        <HospitalForm hospital={editing ?? undefined} onSuccess={() => { setOpenModal(false); void load(); }} />
      </Modal>
    </>
  )
}
