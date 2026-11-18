import { useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { ErrorText } from "@/components/common/error-text";
import { PageLoading } from "@/components/common/page-loading";
import { TopBar } from "@/components/common/top-bar";
import { BarList } from "@/components/features/report/bar-list";
import { DailyChart } from "@/components/features/report/daily-chart";
import { RecentIncidentsTable } from "@/components/features/report/recent-incidents-table";
import { capitalize, emergencyLabel } from "@/lib/format";
import type { EmergencyType, Report } from "@/types";

export default function ReportsPage() {
  const [days, setDays] = useState("30");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Report>("/reports", { params: { days } })
      .then((response) => setReport(response.data))
      .catch((e) => setError(errorMessage(e)));
  }, [days]);

  if (!report) {
    return error ? <ErrorText message={error} /> : <PageLoading />;
  }

  return (
    <>
      <TopBar title="Reports">
        <Select value={days} onChange={(e) => setDays(e.target.value)} className="h-10 w-40">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </Select>
      </TopBar>

      <div className="flex-1 space-y-5 overflow-auto p-4 lg:p-7">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Incidents" value={report.totals.total} />
          <StatCard label="Completed" value={report.totals.completed} className="text-brand-teal" />
          <StatCard label="Avg response (min)" value={report.avg_response_minutes ?? 0} className="text-brand-amber" />
          <StatCard label="Passed to next unit" value={report.totals.escalations} className="text-brand-primary" />
        </div>

        <DailyChart rows={report.daily} />

        <div className="grid gap-5 lg:grid-cols-2">
          <BarList title="Calls per barangay" rows={report.by_barangay.map((r) => ({ label: r.label, value: r.count }))} />
          <BarList title="Emergency types" rows={report.by_type.map((r) => ({ label: emergencyLabel[r.label as EmergencyType] ?? r.label, value: r.count }))} />
          <BarList title="Priority" rows={report.by_priority.map((r) => ({ label: capitalize(r.label), value: r.count }))} />
          <BarList
            title="Ambulance trips"
            rows={report.by_ambulance.map((r) => ({ label: r.name, value: r.trips, note: r.avg_response_minutes === null ? undefined : `${r.avg_response_minutes} min` }))}
          />
        </div>

        <RecentIncidentsTable rows={report.recent} />
        <p className="text-xs text-muted">Response time is counted from when the incident was logged until the ambulance reached the scene. Average accept time: {report.avg_accept_seconds ?? "-"} s.</p>
      </div>
    </>
  )
}
