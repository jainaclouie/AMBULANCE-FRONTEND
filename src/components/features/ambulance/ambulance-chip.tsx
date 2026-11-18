import { Chip } from "@/components/ui/chip";
import { ambulanceChip, statusLabel } from "@/lib/format";
import type { AmbulanceStatus } from "@/types";

export function AmbulanceChip({ status }: { status: AmbulanceStatus }) {
  return <Chip kind={ambulanceChip(status)}>{statusLabel[status]}</Chip>
}
