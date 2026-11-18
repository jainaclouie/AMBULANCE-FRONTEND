import { Navigate } from "react-router";
import { PageLoading } from "@/components/common/page-loading";
import { homePathFor, useAuth } from "@/context/auth-state";

// "/" sends each role to its own home screen
export function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoading />;
  return <Navigate to={user ? homePathFor(user.role) : "/login"} replace />;
}
