export type Role = "admin" | "dispatcher" | "crew";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  ambulance_id: number | null;
  ambulance_name: string | null;
  on_duty: boolean;
};

export type AmbulanceStatus =
  | "available" | "dispatched" | "en_route" | "on_scene"
  | "transporting" | "at_hospital" | "out_of_service" | "offline";

export type Ambulance = {
  id: number;
  name: string;
  plate_no: string;
  home_barangay_id: number | null;
  home_barangay: string | null;
  status: AmbulanceStatus;
  display_status: AmbulanceStatus;
  gps_fresh: boolean;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  last_seen_at: string | null;
  crew: { id: number; name: string; on_duty: boolean }[];
};

export type GeoLine = { type: "LineString"; coordinates: [number, number][] };
export type DispatchStage = "en_route" | "on_scene" | "transporting" | "at_hospital" | "completed";

export type Dispatch = {
  id: number;
  incident_id: number;
  ambulance_id: number;
  ambulance_name: string | null;
  status: "offered" | "accepted" | "declined" | "expired" | "cancelled" | "completed";
  stage: DispatchStage | null;
  rank: number | null;
  eta_seconds: number | null;
  distance_m: number | null;
  eta_source: "osrm" | "estimate" | null;
  offered_at: string | null;
  expires_at: string | null;
  hospital: { id: number; name: string; lat: number; lng: number } | null;
  route_eta_seconds: number | null;
  route_distance_m: number | null;
  route_updated_at: string | null;
  route?: GeoLine | null;
};

export type IncidentStatus =
  | "awaiting_unit" | "offered" | "en_route" | "on_scene"
  | "transporting" | "at_hospital" | "completed" | "cancelled";
export type Priority = "low" | "medium" | "high" | "critical";
export type EmergencyType = "cardiac" | "accident" | "childbirth" | "breathing" | "other";

export type Incident = {
  id: number;
  caller_name: string;
  caller_phone: string;
  barangay_id: number;
  barangay: string | null;
  address: string | null;
  lat: number;
  lng: number;
  emergency_type: EmergencyType;
  priority: Priority;
  notes: string | null;
  status: IncidentStatus;
  assigned_ambulance_id: number | null;
  ambulance_name: string | null;
  dispatch: Dispatch | null;
  created_at: string;
};

export type Candidate = {
  rank: number;
  ambulance: Ambulance;
  eta_seconds: number;
  distance_m: number;
  source: "osrm" | "estimate";
  is_home_unit: boolean;
};

export type Recommendations = {
  candidates: Candidate[];
  unavailable_home_units: { id: number; name: string; status: AmbulanceStatus }[];
};

export type Barangay = { id: number; name: string; lat: number; lng: number; is_island: boolean };
export type Hospital = { id: number; name: string; contact: string | null; lat: number; lng: number };

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  level: "info" | "success" | "warning" | "critical";
  incident_id: number | null;
  read: boolean;
  created_at: string;
};

export type CrewState = {
  user: User;
  ambulance: Ambulance;
  offer: (Dispatch & { incident: Incident }) | null;
  trip: (Dispatch & { incident: Incident }) | null;
  server_time: string;
};

export type CountRow = { label: string; count: number };

export type Report = {
  days: string;
  totals: { total: number; completed: number; cancelled: number; open: number; escalations: number };
  avg_response_minutes: number | null;
  avg_accept_seconds: number | null;
  by_barangay: CountRow[];
  by_type: CountRow[];
  by_priority: CountRow[];
  by_ambulance: { name: string; trips: number; avg_response_minutes: number | null }[];
  daily: { date: string; count: number }[];
  recent: {
    id: number;
    created_at: string;
    emergency_type: EmergencyType;
    priority: Priority;
    barangay: string | null;
    status: IncidentStatus;
    ambulance_name: string | null;
    response_minutes: number | null;
  }[];
};
