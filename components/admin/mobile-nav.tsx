"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
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
  { href: "/admin/users", label: "Users", icon: UserGroupIcon, adminOnly: true },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail01Icon },
  { href: "/admin/messages", label: "Messages", icon: UserIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings01Icon },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/admin" className="flex items-baseline gap-0.5">
          <span className="text-lg font-bold tracking-wide text-white">
            RIVER
          </span>
          <span className="text-lg font-normal tracking-wide text-amber-light">
            LANDS
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <HugeiconsIcon icon={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
