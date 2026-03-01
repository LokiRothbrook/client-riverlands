"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminMobileNav } from "./mobile-nav";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu02Icon } from "@hugeicons/core-free-icons";

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return "Dashboard";

  const titles: Record<string, string> = {
    posts: "Posts",
    events: "Events",
    partners: "Partners",
    "partner-requests": "Partner Requests",
    ads: "Ad Placements",
    users: "Users",
    newsletter: "Newsletter",
    messages: "Messages",
    settings: "Settings",
  };

  const section = segments[1];
  const sub = segments[2];

  if (sub === "new") return `New ${titles[section]?.replace(/s$/, "") ?? section}`;
  if (sub === "edit" || segments[3] === "edit") return `Edit ${titles[section]?.replace(/s$/, "") ?? section}`;

  return titles[section] ?? section.charAt(0).toUpperCase() + section.slice(1);
}

export function AdminHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const pageTitle = getPageTitle(pathname);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <HugeiconsIcon icon={Menu02Icon} size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-river-blue p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AdminMobileNav />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.fullName || "Admin"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
