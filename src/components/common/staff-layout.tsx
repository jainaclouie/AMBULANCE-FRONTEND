import { Navigate, Outlet } from "react-router";
import { PageLoading } from "@/components/common/page-loading";
import { Sidebar } from "@/components/common/sidebar";
import { Toasts } from "@/components/features/notification/toasts";
import { useAuth } from "@/context/auth-state";
import type { Role } from "@/types";

type RoleLayoutProps = { roles: Role[] };

// Wraps pages that only some roles may open. Staff pages get the sidebar.
export function StaffLayout({ roles }: RoleLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return (
    <div className="flex h-dvh flex-col bg-surface-page lg:flex-row">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Toasts />
    </div>
  )
}

// Crew pages: no sidebar, phone layout
export function CrewLayout() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "crew") return <Navigate to="/" replace />;

  return (
    <>
      <Outlet />
      <Toasts />
    </>
  )
}
