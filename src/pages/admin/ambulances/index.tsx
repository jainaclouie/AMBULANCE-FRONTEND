import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TopBar } from "@/components/common/top-bar";
import { ErrorText } from "@/components/common/error-text";
import { AmbulanceForm } from "@/components/features/ambulance/ambulance-form";
import { AmbulanceTable } from "@/components/features/ambulance/ambulance-table";
import { StatCard } from "@/components/ui/stat-card";
import { ambulanceChip } from "@/lib/format";
import type { Ambulance, Barangay } from "@/types";

export default function AmbulancesPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [editing, setEditing] = useState<Ambulance | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [list, places] = await Promise.all([api.get<Ambulance[]>("/admin/ambulances"), api.get<Barangay[]>("/barangays")]);
    setAmbulances(list.data);
    setBarangays(places.data);
  }, []);

  // Initial data load
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch((e) => setError(errorMessage(e))); }, [load]);

  const openForm = (ambulance: Ambulance | null) => { setEditing(ambulance); setOpenModal(true); };

  // Handle Out of Service toggle
  const handleToggleService = async (ambulance: Ambulance) => {
    try {
      await api.put(`/admin/ambulances/${ambulance.id}`, { out_of_service: ambulance.status !== "out_of_service" });
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  // Handle Deletion of Ambulance
  const handleDelete = async (ambulance: Ambulance) => {
    if (!confirm(`Delete ${ambulance.name}?`)) return;
    try {
      await api.delete(`/admin/ambulances/${ambulance.id}`);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const count = (kind: string) => ambulances.filter((a) => ambulanceChip(a.display_status) === kind).length;

  return (
    <>
      <TopBar title="Ambulances">
        <Button size="s" onClick={() => openForm(null)}>+ Add ambulance</Button>
      </TopBar>

      <div className="flex-1 space-y-5 overflow-auto p-4 lg:p-7">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total units" value={ambulances.length} />
          <StatCard label="Available" value={count("available")} className="text-brand-teal" />
          <StatCard label="On a call" value={count("busy")} className="text-brand-amber" />
          <StatCard label="Offline" value={count("offline")} className="text-muted" />
        </div>

        <ErrorText message={error} />
        <AmbulanceTable ambulances={ambulances} onEdit={openForm} onToggleService={handleToggleService} onDelete={handleDelete} />
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editing ? "Edit ambulance" : "Add ambulance"}>
        <AmbulanceForm ambulance={editing ?? undefined} barangays={barangays} onSuccess={() => { setOpenModal(false); void load(); }} />
      </Modal>
    </>
  )
}
