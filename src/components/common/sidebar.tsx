import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-state";
import { cn } from "@/lib/cn";

type NavItemProps = { to: string; label: string };

// Figma component: Nav Item (State = Default | Active)
function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn("block rounded-[10px] px-3 py-2.5 font-semibold", isActive ? "bg-surface-dark-hover text-white" : "text-on-dark-muted hover:bg-surface-dark-hover/60")}
    >
      {label}
    </NavLink>
  )
}

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex shrink-0 gap-1.5 overflow-x-auto bg-surface-dark p-3 text-white lg:w-[200px] lg:flex-col lg:p-4 lg:pt-6">
      <div className="flex items-center gap-2.5 px-2 pb-1 font-bold lg:pb-7">
        <div className="grid size-8 place-items-center rounded-[9px] bg-brand-primary text-xl">+</div>
        Dispatch
      </div>

      <NavItem to="/live" label="Live map" />
      <NavItem to="/incidents/new" label="New incident" />
      <NavItem to="/reports" label="Reports" />
      <NavItem to="/hospitals" label="Hospitals" />
      {user?.role === "admin" && <NavItem to="/admin/ambulances" label="Ambulances" />}
      {user?.role === "admin" && <NavItem to="/admin/users" label="Users" />}

      <div className="ml-auto flex items-center gap-3 lg:mt-auto lg:ml-0 lg:flex-col lg:items-stretch lg:border-t lg:border-surface-dark-hover lg:pt-3">
        <div className="px-1">
          <div className="font-bold">{user?.name}</div>
          <div className="text-[11px] text-on-dark-muted capitalize">{user?.role}</div>
        </div>
        <Button size="s" className="bg-surface-dark-hover" onClick={() => void logout()}>Sign out</Button>
      </div>
    </aside>
  )
}
