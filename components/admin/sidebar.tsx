"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  News01Icon,
  Calendar03Icon,
  Store01Icon,
  UserGroupIcon,
  Mail01Icon,
  Settings01Icon,
  MegaphoneIcon,
  UserIcon,
  CheckListIcon,
  Location01Icon,
  Tag01Icon,
  Image01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home01Icon },
  { href: "/admin/posts", label: "Posts", icon: News01Icon },
  { href: "/admin/events", label: "Events", icon: Calendar03Icon },
  { href: "/admin/partners", label: "Partners", icon: Store01Icon },
  {
    href: "/admin/partner-requests",
    label: "Partner Requests",
    icon: CheckListIcon,
  },
  { href: "/admin/ads", label: "Ad Placements", icon: MegaphoneIcon },
  { href: "/admin/assets", label: "Assets", icon: Image01Icon },
  { href: "/admin/users", label: "Users", icon: UserGroupIcon, adminOnly: true },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail01Icon },
  { href: "/admin/messages", label: "Messages", icon: UserIcon },
  { href: "/admin/counties", label: "Counties", icon: Location01Icon, adminOnly: true },
  { href: "/admin/categories", label: "Categories", icon: Tag01Icon, adminOnly: true },
];

const settingsItem = { href: "/admin/settings", label: "Settings", icon: Settings01Icon };

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { collapsed, toggle } = useSidebar();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <aside
      className={cn(
        "hidden flex-shrink-0 border-r bg-river-blue transition-all duration-200 lg:flex lg:flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + Toggle */}
      <div className="flex h-16 flex-shrink-0 items-center border-b border-white/10 px-3">
        {collapsed ? (
          <Link href="/admin" className="mx-auto">
            <span className="text-xl font-bold tracking-wide text-white">R</span>
          </Link>
        ) : (
          <Link href="/admin" className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold tracking-wide text-white">RIVER</span>
            <span className="text-lg font-normal tracking-wide text-amber-light">LANDS</span>
          </Link>
        )}
        <button
          onClick={toggle}
          className={cn(
            "ml-auto rounded p-1 text-white/50 transition-colors hover:text-white",
            collapsed && "mx-auto ml-0 mt-0"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <HugeiconsIcon
            icon={collapsed ? ArrowRightDoubleIcon : ArrowLeftDoubleIcon}
            size={16}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center gap-0" : "gap-3",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <HugeiconsIcon icon={item.icon} size={18} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings — pinned to bottom */}
      <div className="px-2 pb-2">
        <Link
          href={settingsItem.href}
          title={collapsed ? settingsItem.label : undefined}
          className={cn(
            "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            collapsed ? "justify-center gap-0" : "gap-3",
            pathname.startsWith(settingsItem.href)
              ? "bg-white/15 text-white"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          )}
        >
          <HugeiconsIcon icon={settingsItem.icon} size={18} />
          {!collapsed && settingsItem.label}
        </Link>
      </div>

      {/* User info */}
      {collapsed ? (
        <div className="border-t border-white/10 p-3 flex justify-center">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-medium text-white"
            title={user?.fullName || user?.email || ""}
          >
            {(user?.fullName || user?.email || "?").charAt(0).toUpperCase()}
          </div>
        </div>
      ) : (
        <div className="border-t border-white/10 p-4">
          <div className="text-xs text-white/40">Signed in as</div>
          <div className="truncate text-sm text-white/80">
            {user?.fullName || user?.email}
          </div>
          <div className="text-xs capitalize text-amber-light/70">
            {user?.role}
          </div>
        </div>
      )}
    </aside>
  );
}
