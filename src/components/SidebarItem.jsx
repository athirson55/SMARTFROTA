import { NavLink } from "react-router-dom";
import { AppIcon } from "./AppIcon";

export function SidebarItem({ to, label, icon, end = false, isCollapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "fg-sidebar-item",
          isActive ? "is-active" : "",
          isCollapsed ? "is-collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <span className="fg-sidebar-item__icon">
        <AppIcon type={icon} />
      </span>
      <span className="fg-sidebar-item__label">{label}</span>
    </NavLink>
  );
}
