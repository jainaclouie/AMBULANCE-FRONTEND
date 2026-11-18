import "@/styles/global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "@/context/auth-provider";
import { NotificationProvider } from "@/context/notification-provider";
import { CrewLayout, StaffLayout } from "@/components/common/staff-layout";
import { HomeRedirect } from "@/components/common/home-redirect";
import LoginPage from "@/pages/auth/login";
import LiveMapPage from "@/pages/dispatcher/live-map";
import NewIncidentPage from "@/pages/dispatcher/new-incident";
import AmbulancesPage from "@/pages/admin/ambulances";
import UsersPage from "@/pages/admin/users";
import HospitalsPage from "@/pages/staff/hospitals";
import ReportsPage from "@/pages/staff/reports";
import CrewHomePage from "@/pages/crew/home";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dispatcher and admin */}
          <Route element={<StaffLayout roles={["admin", "dispatcher"]} />}>
            <Route path="/live" element={<LiveMapPage />} />
            <Route path="/incidents/new" element={<NewIncidentPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<StaffLayout roles={["admin"]} />}>
            <Route path="/admin/ambulances" element={<AmbulancesPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
          </Route>

          {/* Ambulance crew (phone) */}
          <Route element={<CrewLayout />}>
            <Route path="/crew" element={<CrewHomePage />} />
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>,
)
