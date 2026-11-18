import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/common/empty-state";
import { PageLoading } from "@/components/common/page-loading";
import { TopBar } from "@/components/common/top-bar";
import { AmbulanceList } from "@/components/features/ambulance/ambulance-list";
import { AssignPanel } from "@/components/features/incident/assign-panel";
import { IncidentCard } from "@/components/features/incident/incident-card";
import { FleetMap } from "@/components/features/map/fleet-map";
import { useFleet } from "@/hooks/use-fleet";
import { ambulanceChip } from "@/lib/format";

export default function LiveMapPage() {
  const { ambulances, incidents, loading, reload } = useFleet();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (loading) {
    return <PageLoading />;
  }

  const count = (kind: string) => ambulances.filter((a) => ambulanceChip(a.display_status) === kind).length;

  return (
    <>
      <TopBar title="Live map">
        <div className="hidden items-center gap-3 md:flex">
          <Chip kind="available">{count("available")} available</Chip>
          <Chip kind="busy">{count("busy")} busy</Chip>
          <Chip kind="offline">{count("offline")} offline</Chip>
        </div>
        <Link to="/incidents/new"><Button size="s">+ New incident</Button></Link>
      </TopBar>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Active incidents */}
        <aside className="flex max-h-[40%] shrink-0 flex-col gap-3 overflow-auto border-b border-line bg-surface-subtle p-5 lg:max-h-none lg:w-[360px] lg:border-r lg:border-b-0">
          <h2 className="text-base font-bold">Active incidents</h2>
          {incidents.length === 0 && <EmptyState>No active incidents. New calls will appear here.</EmptyState>}

          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} selected={selectedId === incident.id} onSelect={(id) => setSelectedId(selectedId === id ? null : id)}>
              {selectedId === incident.id && <AssignPanel incident={incident} onChanged={reload} />}
            </IncidentCard>
          ))}
        </aside>

        {/* Map */}
        <div className="relative min-h-[320px] flex-1">
          <div className="absolute inset-0">
            <FleetMap ambulances={ambulances} incidents={incidents} selectedId={selectedId} />
          </div>
          <AmbulanceList ambulances={ambulances} />
        </div>
      </div>
    </>
  )
}
